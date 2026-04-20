# Changelog

All notable changes to this project will be documented in this file.

## [0.1.4] - 2026-04-20

### 🚀 Added

- **News Timeframe Filtering**: Optimized news search engine to focus on the latest events within a 48-hour window for better trading relevance.

### 🔧 Fixed

- **Subdirectory Deployment**: Switched to relative asset paths in `vite.config.js` to support Laragon/XAMPP subfolders and traditional shared hosting.

## [0.1.3] - 2026-04-19

### 🚀 Added

- **Multi-Timeframe Synthesis**: Support for uploading and analyzing up to 3 charts simultaneously (Top-Down Analysis).
- **Internationalization**: Translated the entire UI, system logs, and error messages from Malay to English for global reach.

### 🔧 Changed

- **Upload UX Enhancement**: Clarified drag-and-drop instructions with tooltips for multi-timeframe capability.
- **Navigation UI**: Upgraded the small Home and Settings icons to larger, text-labeled pill buttons for better accessibility.
- **Repository Cleanup**: Removed tracked build artifacts (`*.zip`) and optimized `.gitignore` for a cleaner GitHub presence.
- **Documentation**: Expanded README.md with detailed local setup and traditional hosting instructions (XAMPP/Laragon).

---

## [0.1.2] - 2026-04-17

### 🚀 Added

- **Premium Redesign**: Complete UI transformation to a modern financial dashboard with golden accents.
- **Home/Reset Functionality**: Added a dedicated Home button to clear analysis state instantly.
- **Chain-of-Thought OCR**: Improved pair detection by asking the AI to extract all text before identifying the instrument.
- **Deep Scan Retry**: Automated fallback logic for chart recognition failures.
- **Security Headers**: Implemented Content Security Policy (CSP) in `index.html`.
- **Security Notice**: Added persistent security warnings in Settings for API key safety.
- **Automated Release Workflow**: Added `npm run release` script for build, BOM removal, and ZIP generation.

### 🔧 Changed

- **AI Model Migration**: Updated to Gemini 3.1 & 2.5 families (April 2026 compatibility).
- **Corrected Model Identifiers**: Fixed `v1beta` model names (e.g., `gemini-3.1-flash-lite-preview`).
- **Layout Optimization**: Relocated navigation buttons to prevent overlapping with the main title.
- **Sync Lockfile**: Updated `package-lock.json` to reflect current dependencies and versioning.

### 🛡 Security

- Added CSP to restrict script/style execution.
- Added sanitization for manual pair input.

---

## [0.1.1] - 2026-04-17

- Initial baseline for the 2026 modernization efforts.
- Added support for Gemini 3.1 series.

## [0.0.0] - Prior

- Legacy "Retro Terminal" design.
- Gemini 1.5/2.0 experimental support.
