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
    label: "ANALISIS TEKNIKAL",
    sub: "Membaca corak carta, sokongan & rintangan…",
    icon: "📊",
    color: "#00ff88",
  },
  {
    label: "BERITA GEOPOLITIK",
    sub: "Mencari berita terkini dari seluruh dunia…",
    icon: "🌐",
    color: "#ffcc00",
  },
  {
    label: "JANAAN CADANGAN",
    sub: "AI menyatukan data & menjana keputusan…",
    icon: "🧠",
    color: "#888aff",
  },
];

export const LOG_LINES = [
  ["Menginisialisasi modul analisis teknikal…", 1],
  ["Memuatkan model visi AI…", 1],
  ["Menganalisa struktur carta…", 1],
  ["Mengesan corak candlestick…", 1],
  ["Mengira paras sokongan & rintangan…", 1],
  ["Analisis teknikal selesai ✓", 1],
  ["Menyambung ke feed berita global…", 2],
  ["Mencari berita bank pusat terkini…", 2],
  ["Mencari peristiwa geopolitik terbaru…", 2],
  ["Menapis berita mengikut mata wang…", 2],
  ["Berita geopolitik dimuatkan ✓", 2],
  ["Menyediakan model cadangan…", 3],
  ["Menggabungkan data teknikal & fundamental…", 3],
  ["Mengira risiko & peluang masuk…", 3],
  ["Menjana cadangan akhir…", 3],
  ["Analisis lengkap ✓", 3],
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
