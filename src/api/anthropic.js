/**
 * Anthropic API Wrapper
 * Supports direct calls (with CORS caveats) and proxy calls.
 */

export async function callAnthropicAPI(body, config, onMessage) {
  const { apiKey, proxyUrl, maxRounds = 8 } = config;

  let messages = [...body.messages];
  let lastContent = [];

  for (let i = 0; i < maxRounds; i++) {
    const url = proxyUrl || "https://api.anthropic.com/v1/messages";

    const headers = {
      "Content-Type": "application/json",
    };

    // Only add headers if not using a proxy (or if proxy expects them)
    // Most browser-based proxies handle the API key inclusion to avoid CORS issues
    if (!proxyUrl) {
      headers["x-api-key"] = apiKey;
      headers["anthropic-version"] = "2023-06-01";
      headers["dangerously-allow-browser"] = "true";
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...body,
        messages,
        // If using proxy, we might need to pass the apiKey in the body if the proxy is generic
        ...(proxyUrl ? { metadata: { apiKey } } : {}),
      }),
    });

    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    lastContent = data.content || [];

    if (data.stop_reason === "end_turn") break;

    if (data.stop_reason === "tool_use") {
      const toolResults = lastContent
        .filter((b) => b.type === "tool_use")
        .map((b) => ({
          type: "tool_result",
          tool_use_id: b.id,
          content: JSON.stringify(b.input || {}),
        }));

      messages = [
        ...messages,
        { role: "assistant", content: lastContent },
        { role: "user", content: toolResults },
      ];
    } else {
      break;
    }
  }

  return lastContent;
}

export const getText = (blocks) =>
  (blocks || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

export function extractJSON(raw = "") {
  const s = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const start = s.indexOf("{");
  if (start === -1) return null;
  let d = 0,
    end = -1;
  for (let i = start; i < s.length; i++) {
    if (s[i] === "{") d++;
    else if (s[i] === "}") {
      d--;
      if (d === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) return null;
  try {
    return JSON.parse(s.slice(start, end + 1));
  } catch {
    return null;
  }
}

export function extractArray(raw = "") {
  const s = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const start = s.indexOf("[");
  if (start === -1) return null;
  let d = 0,
    end = -1;
  for (let i = start; i < s.length; i++) {
    if (s[i] === "[") d++;
    else if (s[i] === "]") {
      d--;
      if (d === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) return null;
  try {
    return JSON.parse(s.slice(start, end + 1));
  } catch {
    return null;
  }
}
