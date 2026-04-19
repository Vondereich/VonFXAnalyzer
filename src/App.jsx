import { useState, useCallback, useEffect } from "react";
import "./App.css";

// Components
import LoadingOverlay from "./components/LoadingOverlay";
import ResultsView from "./components/ResultsView";
import SettingsModal from "./components/SettingsModal";
import UploadZone from "./components/UploadZone";

// Logic & Data
import {
  callGeminiAPI,
  formatGeminiImage,
  extractJSON,
  extractArray,
} from "./api/gemini";
import { getPairFlags } from "./constants";

function normalisePair(raw = "") {
  const s = raw.toUpperCase().trim();
  if (/^[A-Z]{3}\/[A-Z]{3,4}$/.test(s)) return s;
  const m = s.match(/^([A-Z]{3})([A-Z]{3,4})$/);
  if (m) return `${m[1]}/${m[2]}`;
  return null;
}

export default function App() {
  // State: Images (Multi-Timeframe Support)
  const [charts, setCharts] = useState([]); // Array of { b64, preview, mimeType }

  // State: Pair
  const [confirmedPair, setConfirmedPair] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(null);

  // State: Analysis
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState(null);

  // State: Settings
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    let savedModel = localStorage.getItem("geofx_model");
    // Migration for old or deprecated model names
    const deprecated = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-2.0-flash-exp",
      "gemini-3.1-flash",
      "claude-3-5-sonnet-20240620",
    ];
    if (!savedModel || deprecated.includes(savedModel)) {
      savedModel = "gemini-3.1-flash-lite-preview";
      localStorage.setItem("geofx_model", savedModel);
    }
    return {
      apiKey: localStorage.getItem("geofx_apiKey") || "",
      proxyUrl: localStorage.getItem("geofx_proxyUrl") || "",
      model: savedModel,
    };
  });

  // Save settings to localStorage
  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("geofx_apiKey", newSettings.apiKey);
    localStorage.setItem("geofx_proxyUrl", newSettings.proxyUrl);
    localStorage.setItem("geofx_model", newSettings.model);
  };

  // ── API Actions ────────────────────────────────────────────────────────────

  const doDetectPair = async (base64, mimeType) => {
    // Chain-of-Thought Prompt: First list text, then identify pair.
    const prompt = `You are a professional Financial Chart Analyzer. 
    INSTRUCTIONS:
    1. Scan the image and LIST all text strings, symbols, or watermarks you see (especially in corners).
    2. Based on that list, identify the financial instrument or currency pair (e.g., EURUSD, XAUUSD, BTCUSD).
    3. Return ONLY a raw JSON object: {"allText":["..."],"pair":"XXX/YYY","confidence":"HIGH|MED|LOW","note":"..."}`;

    try {
      const text = await callGeminiAPI(
        {
          contents: [
            { parts: [{ text: prompt }, formatGeminiImage(base64, mimeType)] },
          ],
        },
        settings,
      );
      let obj = extractJSON(text);

      // Deep Scan Retry: If failed or unsure, try again with even higher focus.
      if (!obj || obj.pair === "UNKNOWN" || obj.confidence === "LOW") {
        // If they have Pro in settings but using Flash, we could try to 'suggest' Pro
        // but for now let's just use a more aggressive prompt.
        const retryText = await callGeminiAPI(
          {
            contents: [
              {
                parts: [
                  {
                    text: "I need you to look again. Find ANY text like 'XAU', 'EUR', 'USD', 'GBP', 'JPY', 'BTC'. Even if it is a watermark or very small. Deduce the pair. JSON ONLY.",
                  },
                  formatGeminiImage(base64, mimeType),
                ],
              },
            ],
          },
          // Optimization: If the user is on Flash, but Pro is available, Pro would be better here.
          // Since we don't want to break the user's config, we stay with their selected model
          // but give much more precise keywords to look for.
          settings,
        );
        const retryObj = extractJSON(retryText);
        if (retryObj && retryObj.pair !== "UNKNOWN") obj = retryObj;
      }

      return (
        obj || {
          pair: "UNKNOWN",
          confidence: "LOW",
          note: "Detection failed after deep scan",
        }
      );
    } catch (e) {
      return { pair: "UNKNOWN", confidence: "LOW", note: e.message };
    }
  };

  const doChartAnalysis = async (chartsData, pair) => {
    const parts = [
      {
        text: `You are a technical analysis expert. Analyse these ${pair} chart(s) carefully. They may represent the same asset across different timeframes (Top-Down Analysis). Return raw JSON ONLY: {\"trend\":\"...\",\"support\":\"...\",\"resistance\":\"...\",\"patterns\":[\"...\"],\"indicators\":\"...\",\"summary\":\"...\",\"sentiment\":\"BULLISH or BEARISH or NEUTRAL\"}`,
      },
      ...chartsData.map((c) => formatGeminiImage(c.b64, c.mimeType)),
    ];

    const text = await callGeminiAPI(
      {
        contents: [{ parts }],
      },
      settings,
    );
    return extractJSON(text);
  };

  const doNewsSearch = async (pair) => {
    const text = await callGeminiAPI(
      {
        contents: [
          {
            parts: [
              {
                text: `Search for the latest news affecting ${pair}. Provide impact and details. Return raw JSON array ONLY: [{\"headline\":\"...\",\"impact\":\"POSITIVE\",\"currency\":\"...\",\"detail\":\"...\"}]`,
              },
            ],
          },
        ],
        tools: [{ google_search: {} }],
      },
      settings,
    );
    return extractArray(text) || [];
  };

  const doRecommendation = async (pair, tech, news) => {
    const text = await callGeminiAPI(
      {
        contents: [
          {
            parts: [
              {
                text: `Pair: ${pair}\nTech: ${JSON.stringify(tech)}\nNews: ${JSON.stringify(news)}\nYou are a professional forex advisor. Generate recommendation. Return raw JSON ONLY: {\"action\":\"BUY/SELL/HOLD\",\"entryZone\":\"...\",\"stopLoss\":\"...\",\"takeProfit\":\"...\",\"timeframe\":\"...\",\"confidence\":80,\"riskLevel\":\"LOW/MED/HIGH\",\"reasoning\":\"...\",\"riskNote\":\"...\"}`,
              },
            ],
          },
        ],
      },
      settings,
    );
    return extractJSON(text);
  };

  const doDetailedReport = async (pair, tech, news) => {
    const text = await callGeminiAPI(
      {
        contents: [
          {
            parts: [
              {
                text: `You are a professional market analyst and financial writer. Based on the following data, write a detailed, engaging trading report for ${pair}.\n\nTechnical Analysis: ${JSON.stringify(tech)}\n\nNews & Fundamentals: ${JSON.stringify(news)}\n\nFormat the report with a catchy headline, an executive summary, a deep dive into technicals, a fundamental outlook, and a final verdict. Use professional yet accessible language. Return the report in plain text or simple markdown.`,
              },
            ],
          },
        ],
      },
      settings,
    );
    return text;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleFiles = useCallback(
    async (fileList) => {
      const newFiles = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      if (newFiles.length === 0) return;

      setResult(null);
      setError(null);
      
      const newCharts = await Promise.all(
        newFiles.slice(0, 3).map(async (file) => {
          const mimeType = file.type || "image/jpeg";
          const b64 = await new Promise((res) => {
            const r = new FileReader();
            r.onload = (e) => res(e.target.result.split(",")[1]);
            r.readAsDataURL(file);
          });
          const preview = await new Promise((res) => {
            const r = new FileReader();
            r.onload = (e) => res(e.target.result);
            r.readAsDataURL(file);
          });
          return { b64, preview, mimeType };
        })
      );

      setCharts((prev) => {
        const combined = [...prev, ...newCharts].slice(0, 3); // Max 3 charts
        return combined;
      });

      if (!settings.apiKey && !settings.proxyUrl) {
        setError("Please enter your API Key in Settings first.");
        return;
      }

      // Only run detection if we don't have a confirmed pair and are adding the first chart
      if (!confirmedPair && !detected && newCharts.length > 0) {
        setDetecting(true);
        try {
          const firstChart = newCharts[0];
          const det = await doDetectPair(firstChart.b64, firstChart.mimeType);
          const normalised = normalisePair(det.pair || "");
          setDetected({
            ...det,
            pair: normalised || det.pair,
            valid: !!normalised && det.pair !== "UNKNOWN",
          });
        } catch (e) {
          setError("Failed to detect pair. Please select manually.");
        } finally {
          setDetecting(false);
        }
      }
    },
    [settings, confirmedPair, detected],
  );

  const removeChart = (index) => {
    setCharts((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        setDetected(null);
        setConfirmedPair(null);
        setResult(null);
        setReport(null);
      }
      return next;
    });
  };

  const reset = () => {
    setCharts([]);
    setConfirmedPair(null);
    setResult(null);
    setReport(null);
    setError(null);
    setDetected(null);
  };

  const analyse = async () => {
    if (charts.length === 0 || !confirmedPair) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      setStep(1);
      const tech = await doChartAnalysis(charts, confirmedPair);
      setStep(2);
      const news = await doNewsSearch(confirmedPair);
      setStep(3);
      const reco = await doRecommendation(confirmedPair, tech, news);
      setResult({ tech, news, reco });
    } catch (e) {
      setError(e.message || "Analysis failed. Please check your API Key or Proxy.");
    } finally {
      setLoading(false);
      setStep(0);
    }
  };

  const generateReport = async () => {
    if (!result) return;
    setLoadingReport(true);
    setError(null);
    try {
      const text = await doDetailedReport(
        confirmedPair,
        result.tech,
        result.news,
      );
      setReport(text);
    } catch (e) {
      setError("Failed to generate full report.");
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 1000,
        margin: "0 auto",
        padding: "40px 20px 100px",
      }}
    >
      {/* Header */}
      <header
        style={{
          textAlign: "center",
          marginBottom: 64,
          animation: "fadeIn 1s ease",
          position: "relative",
        }}
      >
        {/* Navigation Buttons */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: 0,
            display: "flex",
            gap: "12px",
            zIndex: 10,
          }}
        >
          <button
            onClick={reset}
            title="Home / Reset"
            style={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)")
            }
          >
            ⌂
          </button>
          <button
            onClick={() => setShowSettings(true)}
            title="Settings"
            style={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)")
            }
          >
            ⚙
          </button>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            borderRadius: "20px",
            padding: "4px 12px",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent-gold)",
              boxShadow: "0 0 8px var(--accent-gold)",
            }}
          ></span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--accent-gold)",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Premium Analysis Engine v0.1.2
          </span>
        </div>

        <h1
          className="financial-gradient-text"
          style={{
            fontSize: "clamp(36px, 8vw, 64px)",
            fontWeight: 800,
            margin: "0 0 16px 0",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
          }}
        >
          GeoFX Analyst
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "16px",
            fontWeight: 400,
            maxWidth: "560px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Advanced AI-driven market analysis combining technical patterns with
          real-time geopolitical intelligence.
        </p>
      </header>

      {/* Main UI */}
      <div style={{ display: "grid", gap: "24px" }}>
        <UploadZone
          charts={charts}
          detecting={detecting}
          detected={detected}
          confirmedPair={confirmedPair}
          onFilesSelect={handleFiles}
          onRemoveChart={removeChart}
          onConfirmPair={() => setConfirmedPair(detected.pair)}
          onPickPair={(p) => setConfirmedPair(p)}
        />

        <button
          onClick={analyse}
          disabled={loading || charts.length === 0 || !confirmedPair}
          style={{
            width: "100%",
            padding: "18px",
            background:
              loading || !confirmedPair
                ? "var(--bg-card)"
                : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            border: "none",
            color: loading || !confirmedPair ? "var(--text-muted)" : "#fff",
            fontSize: "15px",
            fontWeight: 600,
            borderRadius: "12px",
            boxShadow:
              loading || !confirmedPair
                ? "none"
                : "0 4px 12px rgba(16, 185, 129, 0.2)",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {loading
            ? `Analyzing Market Data...`
            : charts.length === 0
              ? "Upload Chart to Begin"
              : !confirmedPair
                ? "Confirm Pair to Analyze"
                : "Execute Multi-Timeframe Analysis"}
        </button>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "12px",
              padding: "20px",
              color: "#f87171",
              fontSize: "14px",
              animation: "slideUp 0.3s ease",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚠</span> SYSTEM ERROR
            </div>
            {error}
          </div>
        )}

        <ResultsView result={result} pair={confirmedPair} />

        {/* AI Writing Section */}
        {result && !loading && (
          <div style={{ animation: "slideUp 0.5s ease" }}>
            {!report ? (
              <button
                onClick={generateReport}
                disabled={loadingReport}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  color: "#60a5fa",
                  fontSize: "14px",
                  fontWeight: 600,
                  borderRadius: "12px",
                }}
              >
                {loadingReport
                  ? "Generating Intelligence Report..."
                  : "Generate Full Analyst Report (AI)"}
              </button>
            ) : (
              <div
                className="glass-card"
                style={{
                  background: "rgba(15, 18, 24, 0.8)",
                  backdropFilter: "blur(12px)",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    borderBottom: "1px solid var(--border-color)",
                    paddingBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#60a5fa",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    Comprehensive Market Report
                  </span>
                  <button
                    onClick={() => setReport(null)}
                    style={{ color: "var(--text-muted)", fontSize: "12px" }}
                  >
                    Close Report
                  </button>
                </div>
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "15px",
                    color: "var(--text-primary)",
                    lineHeight: "1.8",
                  }}
                >
                  {report}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals & Overlays */}
      {loading && <LoadingOverlay step={step} pair={confirmedPair} />}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
