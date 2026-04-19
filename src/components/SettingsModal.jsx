import { useState } from "react";

export default function SettingsModal({ settings, onSave, onClose }) {
  const [apiKey, setApiKey] = useState(settings.apiKey || "");
  const [proxyUrl, setProxyUrl] = useState(settings.proxyUrl || "");
  const [model, setModel] = useState(settings.model || "gemini-3.1-flash");

  const handleSave = () => {
    onSave({ apiKey, proxyUrl, model });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(6, 8, 12, 0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "440px",
          animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            Terminal Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              color: "var(--text-muted)",
              fontSize: "20px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API Key"
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "var(--bg-main)",
              color: "#fff",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              marginTop: "8px",
            }}
          >
            Keys are stored locally in your browser's storage.
          </p>
          <div
            style={{
              marginTop: "12px",
              padding: "10px",
              background: "rgba(245, 158, 11, 0.05)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              borderRadius: "6px",
              fontSize: "11px",
              color: "var(--accent-gold)",
            }}
          >
            <span style={{ fontWeight: 700 }}>SECURITY NOTICE:</span> Never
            share your terminal URL or local storage data if you are using a
            public machine. Your API keys are sensitive.
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Proxy Endpoint (Optional)
          </label>
          <input
            type="text"
            value={proxyUrl}
            onChange={(e) => setProxyUrl(e.target.value)}
            placeholder="https://api.yourproxy.com"
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "var(--bg-main)",
              color: "#fff",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "32px" }}>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Intelligence Engine
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "var(--bg-main)",
              color: "#fff",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            <option value="gemini-3.1-flash-lite-preview">
              Gemini 3.1 Flash (Lite Preview)
            </option>
            <option value="gemini-3.1-pro-preview">
              Gemini 3.1 Pro (Preview)
            </option>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Stable)</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro (Stable)</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleSave}
            style={{
              flex: 2,
              padding: "14px",
              background: "var(--accent-secondary)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "14px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Apply Changes
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "14px",
              border: "1px solid var(--border-color)",
              background: "transparent",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "14px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
