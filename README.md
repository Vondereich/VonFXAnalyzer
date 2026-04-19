# GeoFX Analyst v0.1.2 🚀

**Advanced AI-driven Market Analysis Terminal**

![GeoFX Analyst Terminal Interface](./public/screenshot.png)

GeoFX Analyst is a high-performance, premium dashboard designed for forex traders and market analysts. It combines state-of-the-art visual intelligence (Gemini 3.1) with real-time geopolitical grounding to provide professional-grade trading insights.

## ✨ Key Features

- **Deep Chart Vision**: Automated instrument detection using Chain-of-Thought OCR logic.

* **Intelligence Engine**: Powered by the latest Gemini 3.1 & 2.5 families (April 2026 specs).
* **Geopolitical Grounding**: Real-time analysis of news affecting specific currency pairs.
* **Premium Aesthetic**: Sophisticated dark-mode dashboard with golden accents and glassmorphism.
* **Security Focused**: Implements Content Security Policy (CSP) and local-first data persistence.

## 🛠 Tech Stack

- **Core**: React 19 + Vite 8
- **AI Integration**: Google Gemini API (v1beta)
- **Styling**: Modern CSS with CSS Variables & Glassmorphism
- **Deployment**: Automated release workflow for optimized builds.

## 🚀 Getting Started

1.  **Installation**: `npm install`
2.  **Development**: `npm run dev`
3.  **Build**: `npm run build`
4.  **Release**: `npm run release` (Generates a clean `VonAnalyzer.zip`)

## ⚙️ Configuration

Open the **Terminal Settings** (⚙) within the app to:

- Provide your **Gemini API Key**.
- Set an optional **Proxy Endpoint** (for shared hosting compatibility).
- Select your preferred **Intelligence Engine** (Gemini 3.1 Flash/Pro).

## 🔒 Security

This application is designed to be client-side only. Your API keys are stored in your browser's local storage and are never sent to any server other than the Google AI API (or your configured proxy).

---

_Created with ❤️ for professional traders._
