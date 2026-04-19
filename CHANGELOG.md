# Changelog

All notable changes to this project will be documented in this file.

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
