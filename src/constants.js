export const CURRENCY_PAIRS = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "USD/CHF",
  "AUD/USD",
  "NZD/USD",
  "USD/CAD",
  "EUR/GBP",
  "EUR/JPY",
  "GBP/JPY",
  "XAU/USD",
  "BTC/USD",
  "ETH/USD",
  "USD/MYR",
  "USD/SGD",
  "EUR/MYR",
  "GBP/MYR",
  "USD/IDR",
  "USD/THB",
  "USD/PHP",
];

export const CURRENCY_FLAGS = {
  EUR: "🇪🇺",
  USD: "🇺🇸",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  CHF: "🇨🇭",
  AUD: "🇦🇺",
  NZD: "🇳🇿",
  CAD: "🇨🇦",
  XAU: "🥇",
  BTC: "₿",
  ETH: "⟠",
  MYR: "🇲🇾",
  SGD: "🇸🇬",
  IDR: "🇮🇩",
  THB: "🇹🇭",
  PHP: "🇵🇭",
};

export const getPairFlags = (p) => {
  const [a, b] = (p || "").split("/");
  return `${CURRENCY_FLAGS[a] || "💱"} ${CURRENCY_FLAGS[b] || "💱"}`;
};

export const STEP_INFO = [
  null,
  {
    label: "TECHNICAL ANALYSIS",
    sub: "Reading chart patterns, support & resistance...",
    icon: "📊",
    color: "#00ff88",
  },
  {
    label: "GEOPOLITICAL NEWS",
    sub: "Searching for the latest global news...",
    icon: "🌐",
    color: "#ffcc00",
  },
  {
    label: "INTELLIGENCE GENERATION",
    sub: "AI consolidating data & generating decisions...",
    icon: "🧠",
    color: "#888aff",
  },
];

export const LOG_LINES = [
  ["Initializing technical analysis module...", 1],
  ["Loading AI vision models...", 1],
  ["Analyzing chart structure...", 1],
  ["Detecting candlestick patterns...", 1],
  ["Calculating support & resistance levels...", 1],
  ["Technical analysis complete ✓", 1],
  ["Connecting to global news feeds...", 2],
  ["Scanning for recent central bank updates...", 2],
  ["Searching for latest geopolitical events...", 2],
  ["Filtering news by currency impact...", 2],
  ["Geopolitical news loaded ✓", 2],
  ["Preparing recommendation engine...", 3],
  ["Synthesizing technical & fundamental data...", 3],
  ["Calculating risk-reward & entry zones...", 3],
  ["Generating final trade verdict...", 3],
  ["Analysis complete ✓", 3],
];

export const COLORS = {
  BULLISH: "#00ff88",
  BEARISH: "#ff4466",
  NEUTRAL: "#ffcc00",
  BUY: "#00ff88",
  SELL: "#ff4466",
  HOLD: "#ffcc00",
  WAIT: "#888aff",
  LOW: "#00ff88",
  MEDIUM: "#ffcc00",
  HIGH: "#ff4466",
  POSITIVE: "0,255,136",
  NEGATIVE: "255,68,102",
  NEUTRAL_RGB: "255,204,0",
};
