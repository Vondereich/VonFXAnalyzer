export default function ResultsView({ result, pair }) {
  if (!result) return null;

  const getSentimentColor = (s) => {
    if (s === "BULLISH" || s === "BUY") return "var(--accent-primary)";
    if (s === "BEARISH" || s === "SELL") return "var(--danger)";
    return "var(--accent-gold)";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        animation: "slideUp 0.5s ease",
      }}
    >
      {/* Executive Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {[
          {
            label: "Market Sentiment",
            val: result.tech?.sentiment,
            color: getSentimentColor(result.tech?.sentiment),
            icon: "▣",
          },
          {
            label: "Strategic Action",
            val: result.reco?.action,
            color: getSentimentColor(result.reco?.action),
            icon: "◈",
          },
          {
            label: "Risk Exposure",
            val: result.reco?.riskLevel,
            color:
              result.reco?.riskLevel === "HIGH"
                ? "var(--danger)"
                : "var(--accent-gold)",
            icon: "⚠",
          },
        ].map((x) => (
          <div
            key={x.label}
            className="glass-card"
            style={{
              padding: "20px",
              textAlign: "center",
              borderTop: `2px solid ${x.color}`,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              {x.label}
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: x.color,
                letterSpacing: "0.5px",
              }}
            >
              {x.val || "—"}
            </div>
          </div>
        ))}
      </div>

      {/* AI Confidence Metric */}
      {result.reco?.confidence != null && (
        <div className="glass-card" style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                letterSpacing: "0.5px",
              }}
            >
              Artificial Intelligence Confidence Score
            </span>
            <span
              style={{
                color: "var(--accent-primary)",
                fontWeight: 800,
                fontSize: "16px",
              }}
            >
              {result.reco.confidence}%
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${result.reco.confidence}%`,
                background:
                  "linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))",
                borderRadius: "10px",
                transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>
      )}

      {/* Technical Intelligence */}
      <div className="glass-card">
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--accent-secondary)",
            marginBottom: "20px",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Technical Analysis Intelligence
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Primary Trend", val: result.tech?.trend },
            { label: "Support Floor", val: result.tech?.support },
            { label: "Resistance Ceiling", val: result.tech?.resistance },
            { label: "Indicator Signal", val: result.tech?.indicators },
          ].map((x) => (
            <div key={x.label}>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                {x.label}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                }}
              >
                {x.val || "—"}
              </div>
            </div>
          ))}
        </div>

        {result.tech?.patterns?.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                fontWeight: 600,
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              Identified Chart Patterns
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {result.tech.patterns.map((p, i) => (
                <span
                  key={i}
                  style={{
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    borderRadius: "6px",
                    padding: "4px 12px",
                    fontSize: "12px",
                    color: "#60a5fa",
                    fontWeight: 500,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.tech?.summary && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "16px",
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
            }}
          >
            {result.tech.summary}
          </div>
        )}
      </div>

      {/* Geopolitical Grounding */}
      {result.news?.length > 0 && (
        <div className="glass-card">
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--accent-gold)",
              marginBottom: "20px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Geopolitical & Fundamental Grounding
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {result.news.map((n, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255, 255, 255, 0.01)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "16px",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--bg-card-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.01)")
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      lineHeight: "1.4",
                    }}
                  >
                    {n.headline}
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    {n.currency && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          background: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "4px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {n.currency}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        background:
                          n.impact === "POSITIVE"
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(239, 68, 68, 0.1)",
                        borderRadius: "4px",
                        color:
                          n.impact === "POSITIVE"
                            ? "var(--accent-primary)"
                            : "var(--danger)",
                      }}
                    >
                      {n.impact}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    lineHeight: "1.5",
                  }}
                >
                  {n.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Recommendation */}
      {result.reco && (
        <div
          className="success-glow"
          style={{
            background: "var(--bg-card)",
            border: `1px solid ${getSentimentColor(result.reco.action)}33`,
            borderRadius: "16px",
            padding: "32px",
            borderLeft: `4px solid ${getSentimentColor(result.reco.action)}`,
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: getSentimentColor(result.reco.action),
              marginBottom: "24px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Strategic Trading Verdict
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {[
              {
                label: "Action",
                val: result.reco.action,
                color: getSentimentColor(result.reco.action),
              },
              {
                label: "Entry Zone",
                val: result.reco.entryZone,
                color: "var(--text-primary)",
              },
              {
                label: "Stop Loss",
                val: result.reco.stopLoss,
                color: "var(--danger)",
              },
              {
                label: "Take Profit",
                val: result.reco.takeProfit,
                color: "var(--accent-primary)",
              },
              {
                label: "Timeframe",
                val: result.reco.timeframe,
                color: "var(--accent-gold)",
              },
            ].map((x) => (
              <div
                key={x.label}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "10px",
                  padding: "16px",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--text-muted)",
                    fontWeight: 700,
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {x.label}
                </div>
                <div
                  style={{ fontSize: "16px", fontWeight: 800, color: x.color }}
                >
                  {x.val || "—"}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderLeft: "2px solid var(--border-color)",
              paddingLeft: "24px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--text-muted)",
                letterSpacing: "1px",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              Intelligence Rationale
            </div>
            <div
              style={{
                fontSize: "15px",
                color: "var(--text-secondary)",
                lineHeight: "1.7",
                marginBottom: "20px",
              }}
            >
              {result.reco.reasoning}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                fontWeight: 500,
                fontStyle: "italic",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "var(--accent-gold)" }}>⚠</span>{" "}
              {result.reco.riskNote}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
