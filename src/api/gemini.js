/**
 * Gemini API Wrapper
 */

export async function callGeminiAPI(payload, config, retryCount = 0) {
  const { apiKey, proxyUrl, model = "gemini-3.1-flash" } = config;
  const MAX_RETRIES = 3;

  let url = "";
  let body = {};

  if (proxyUrl) {
    url = proxyUrl;
    body = {
      ...payload,
      model: model,
      metadata: { apiKey },
    };
  } else {
    url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    body = payload;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      const errMsg = e?.error?.message || "";

      const isOverloaded =
        errMsg.toLowerCase().includes("high demand") ||
        errMsg.toLowerCase().includes("overloaded") ||
        res.status === 503 ||
        res.status === 429;

      if (isOverloaded && retryCount < MAX_RETRIES) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, retryCount) * 1000;
        console.warn(
          `Model busy (${model}). Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`,
        );
        await new Promise((r) => setTimeout(r, delay));

        // On attempt 2, if using 3.1, try switching to 2.5
        let nextConfig = config;
        if (retryCount >= 1 && model.includes("3.1")) {
          console.info("Switching to fallback model: gemini-2.5-flash");
          nextConfig = { ...config, model: "gemini-2.5-flash" };
        }

        return callGeminiAPI(payload, nextConfig, retryCount + 1);
      }
      throw new Error(errMsg || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("API returned empty response.");
    return text;
  } catch (err) {
    // Handle network interruptions or fetch failures
    const isNetworkError =
      err.message.includes("Failed to fetch") ||
      err.message.includes("network") ||
      err.message.includes("aborted");

    if (isNetworkError && retryCount < MAX_RETRIES) {
      const delay = Math.pow(2, retryCount) * 1000;
      console.warn(
        `Network error. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`,
      );
      await new Promise((r) => setTimeout(r, delay));
      return callGeminiAPI(payload, config, retryCount + 1);
    }

    if (err.message.includes("Failed to fetch") && proxyUrl) {
      throw new Error("Proxy connection failed. Sila semak Proxy URL anda.");
    }
    throw err;
  }
}

// Helper to format images for Gemini
export const formatGeminiImage = (base64, mimeType) => ({
  inline_data: {
    mime_type: mimeType,
    data: base64,
  },
});

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
