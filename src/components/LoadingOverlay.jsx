import { useState, useEffect, useRef } from "react";
import { STEP_INFO, LOG_LINES } from "../constants";

export default function LoadingOverlay({ step, pair }) {
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [tick, setTick] = useState(0);
  const logRef = useRef();

  useEffect(() => {
    const eligible = LOG_LINES.filter(([, s]) => s <= step);
    if (visibleLogs.length >= eligible.length) return;
    const t = setTimeout(
      () => {
        setVisibleLogs(eligible.slice(0, visibleLogs.length + 1));
      },
      visibleLogs.length === 0 ? 100 : 200,
    );
    return () => clearTimeout(t);
  }, [step, visibleLogs]);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 80);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [visibleLogs]);

  const info = STEP_INFO[step] || STEP_INFO[1];
  const pct = step === 1 ? 33 : step === 2 ? 66 : 99;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(6, 8, 12, 0.95)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.5s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "500px",
        }}
      >
        {/* Top Status */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
            animation: "slideUp 0.5s ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(16, 185, 129, 0.1)",
              borderRadius: "20px",
              padding: "4px 16px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent-primary)",
                animation: "pulse 1.5s infinite",
              }}
            ></span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--accent-primary)",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Intelligence Engine Active
            </span>
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "8px",
            }}
          >
            Processing Analysis
          </h2>
          <div
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            {pair} · Deep Market Scan
          </div>
        </div>

        {/* Steps Progress */}
        <div
          style={{
            marginBottom: "32px",
            animation: "slideUp 0.5s ease 0.1s both",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            {STEP_INFO.slice(1).map((s, i) => {
              const idx = i + 1;
              const done = step > idx;
              const active = step === idx;
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    opacity: step < idx ? 0.3 : 1,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      marginBottom: "8px",
                      color: done
                        ? "var(--accent-primary)"
                        : active
                          ? "var(--accent-secondary)"
                          : "var(--text-muted)",
                    }}
                  >
                    {done ? "✓" : s.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: done
                        ? "var(--accent-primary)"
                        : active
                          ? "var(--accent-secondary)"
                          : "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              height: "4px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "10px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: `linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))`,
                borderRadius: "10px",
                transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 500,
              }}
            >
              {info.sub}
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                fontWeight: 700,
              }}
            >
              {pct}%
            </span>
          </div>
        </div>

        {/* Data Stream */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            padding: "20px",
            animation: "slideUp 0.5s ease 0.2s both",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Analysis Data Stream
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              {String(tick % 9999).padStart(4, "0")} MS
            </span>
          </div>
          <div
            ref={logRef}
            style={{
              maxHeight: "120px",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            {visibleLogs.map(([line, s], i) => (
              <div
                key={i}
                style={{
                  fontSize: "12px",
                  lineHeight: "2",
                  color:
                    s === step ? "var(--accent-primary)" : "var(--text-muted)",
                  animation: "fadeIn 0.3s ease",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <span style={{ width: "12px", flexShrink: 0 }}>
                  {s < step ? "✓" : "→"}
                </span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            marginTop: "12px",
            animation: "slideUp 0.5s ease 0.3s both",
          }}
        >
          {[
            { label: "Data Samples", val: (120 + (tick % 80)).toString() },
            { label: "Execution", val: `${18 + (tick % 12)}ms` },
            { label: "Grounding", val: `${Math.min(step * 2, 6)}/6` },
          ].map((x) => (
            <div
              key={x.label}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  color: "var(--text-muted)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                {x.label}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                }}
              >
                {x.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
