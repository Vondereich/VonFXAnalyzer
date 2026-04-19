import { useState, useRef } from "react";
import { CURRENCY_PAIRS, getPairFlags } from "../constants";

const SectionTitle = ({ children }) => (
  <div
    style={{
      fontSize: 11,
      letterSpacing: 3,
      color: "#00ff88",
      marginBottom: 14,
    }}
  >
    {children}
  </div>
);

export default function UploadZone({
  charts = [],
  detecting,
  detected,
  confirmedPair,
  onFilesSelect,
  onRemoveChart,
  onConfirmPair,
  onPickPair,
}) {
  const [drag, setDrag] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const fileRef = useRef();

  const handleCustomApply = () => {
    if (customInput) {
      onPickPair(customInput.toUpperCase());
      setShowPicker(false);
      setCustomInput("");
    }
  };

  return (
    <div className="glass-card" style={{ padding: "30px" }}>
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "var(--accent-secondary)",
          marginBottom: "20px",
          letterSpacing: "1px",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            width: 12,
            height: 2,
            background: "var(--accent-secondary)",
          }}
        ></span>
        Chart Configuration
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          onFilesSelect(e.dataTransfer.files);
        }}
        onClick={() => !detecting && charts.length < 3 && fileRef.current.click()}
        style={{
          border: `1px dashed ${drag ? "var(--accent-secondary)" : "var(--border-color)"}`,
          background: drag
            ? "rgba(59, 130, 246, 0.05)"
            : "rgba(255, 255, 255, 0.02)",
          borderRadius: "12px",
          padding: charts.length > 0 ? "20px" : "48px 20px",
          textAlign: "center",
          cursor: detecting ? "wait" : charts.length < 3 ? "pointer" : "default",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          position: "relative",
          marginBottom: "24px",
        }}
      >
        {charts.length > 0 ? (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(charts.length, 3)}, 1fr)`, gap: "12px" }}>
              {charts.map((chart, idx) => (
                <div key={idx} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)", aspectRatio: "16/9" }}>
                  <img
                    src={chart.preview}
                    alt={`chart-${idx}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      background: "#000",
                    }}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveChart(idx); }}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "rgba(239, 68, 68, 0.8)",
                      border: "none",
                      color: "#fff",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      zIndex: 10,
                    }}
                  >
                    ×
                  </button>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(to top, rgba(6, 8, 12, 0.9) 0%, transparent 100%)",
                      padding: "16px 8px 8px",
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      textAlign: "left",
                      fontWeight: 600,
                    }}
                  >
                    Chart {idx + 1}
                  </div>
                </div>
              ))}
            </div>
            
            {detecting ? (
              <div style={{ marginTop: "16px", color: "var(--accent-gold)", fontSize: "13px", fontWeight: 600, animation: "pulse 1.5s infinite" }}>
                System processing visual data...
              </div>
            ) : charts.length < 3 ? (
              <div style={{ marginTop: "16px", color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500 }}>
                + Add up to {3 - charts.length} more timeframe(s)
              </div>
            ) : null}
          </div>
        ) : (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div
              style={{ fontSize: "32px", marginBottom: "16px", opacity: 0.8 }}
            >
              📊
            </div>
            <div
              style={{
                color: "var(--text-primary)",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              Upload Market Chart
            </div>
            <div
              style={{
                color: "var(--text-muted)",
                fontSize: "13px",
                marginTop: "12px",
                lineHeight: "1.6",
              }}
            >
              Drag and drop 1 to 3 charts (PNG, JPG, WEBP).<br />
              <strong style={{ color: "var(--accent-secondary)" }}>
                Tip: Prepare 2-3 pictures with different timeframes (e.g. H4, H1, M15) for Top-Down Analysis.
              </strong>
            </div>
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => onFilesSelect(e.target.files)}
      />

      {/* Detection Info */}
      {!detecting && detected && !confirmedPair && !showPicker && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.03)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "16px",
            animation: "slideUp 0.3s ease",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--accent-primary)",
              marginBottom: "16px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {detected.valid
              ? "Pattern Match Identified"
              : "Inconclusive Pattern Match"}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "36px", filter: "grayscale(0.2)" }}>
              {getPairFlags(detected.pair)}
            </span>
            <div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-1px",
                }}
              >
                {detected.pair}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                {detected.note || "Instrument detected via visual intelligence"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={onConfirmPair}
              style={{
                flex: 1,
                padding: "12px",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid var(--accent-primary)",
                color: "var(--accent-primary)",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              Confirm Instrument
            </button>
            <button
              onClick={() => setShowPicker(true)}
              style={{
                flex: 1,
                padding: "12px",
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
                fontWeight: 500,
                fontSize: "13px",
              }}
            >
              Manual Selection
            </button>
          </div>
        </div>
      )}

      {/* Manual Selection Fallback */}
      {!detecting && !detected && charts.length > 0 && !confirmedPair && !showPicker && (
        <div
          style={{
            background: "rgba(245, 158, 11, 0.03)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--accent-gold)",
              marginBottom: "16px",
            }}
          >
            Automated detection unavailable
          </div>
          <button
            onClick={() => setShowPicker(true)}
            style={{
              width: "100%",
              padding: "12px",
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid var(--accent-gold)",
              color: "var(--accent-gold)",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Select Instrument Manually
          </button>
        </div>
      )}

      {/* Confirmed Pair */}
      {confirmedPair && !showPicker && (
        <div
          className="success-glow"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(16, 185, 129, 0.05)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "12px",
            padding: "16px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "24px" }}>
              {getPairFlags(confirmedPair)}
            </span>
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                Selected Instrument
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--accent-primary)",
                }}
              >
                {confirmedPair}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowPicker(true)}
            style={{
              padding: "8px 16px",
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            Modify
          </button>
        </div>
      )}

      {/* Picker */}
      {showPicker && (
        <div style={{ animation: "slideUp 0.3s ease" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--text-primary)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Select Instrument
            </div>
            <button
              onClick={() => setShowPicker(false)}
              style={{ color: "var(--text-muted)", fontSize: "12px" }}
            >
              Cancel
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            {CURRENCY_PAIRS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  onPickPair(p);
                  setShowPicker(false);
                }}
                style={{
                  padding: "10px",
                  fontSize: "12px",
                  fontWeight: 500,
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                  background: "var(--bg-main)",
                  borderRadius: "8px",
                  textAlign: "left",
                }}
              >
                {getPairFlags(p)} {p}
              </button>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "20px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              Custom Identifier
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                placeholder="e.g. BTC/USD"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "var(--bg-main)",
                  color: "#fff",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={handleCustomApply}
                style={{
                  padding: "12px 24px",
                  background: "var(--accent-secondary)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "13px",
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
