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
  imgPrev,
  detecting,
  detected,
  confirmedPair,
  onFileSelect,
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
          onFileSelect(e.dataTransfer.files[0]);
        }}
        onClick={() => !detecting && fileRef.current.click()}
        style={{
          border: `1px dashed ${drag ? "var(--accent-secondary)" : "var(--border-color)"}`,
          background: drag
            ? "rgba(59, 130, 246, 0.05)"
            : "rgba(255, 255, 255, 0.02)",
          borderRadius: "12px",
          padding: imgPrev ? 0 : "48px 20px",
          textAlign: "center",
          cursor: detecting ? "wait" : "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          position: "relative",
          marginBottom: "24px",
        }}
      >
        {imgPrev ? (
          <div style={{ position: "relative" }}>
            <img
              src={imgPrev}
              alt="chart"
              style={{
                width: "100%",
                maxHeight: "350px",
                objectFit: "contain",
                display: "block",
                background: "#000",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(6, 8, 12, 0.9) 0%, transparent 60%)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              {detecting ? (
                <span
                  style={{
                    color: "var(--accent-gold)",
                    fontSize: "13px",
                    fontWeight: 600,
                    animation: "pulse 1.5s infinite",
                  }}
                >
                  System processing visual data...
                </span>
              ) : (
                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  Click or drag to replace analysis source
                </span>
              )}
            </div>
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
                fontSize: "12px",
                marginTop: "8px",
              }}
            >
              Drag and drop PNG, JPG or WEBP analysis
            </div>
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => onFileSelect(e.target.files[0])}
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
      {!detecting && !detected && imgPrev && !confirmedPair && !showPicker && (
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
