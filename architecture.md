# Architecture - Random Theme Generator

## Overview
The Random Theme Generator is a client-side single-page application (SPA) built with Vanilla HTML, CSS, and JavaScript. It generates random color palettes and font pairings, previews them in a simulated webpage, and exports the data for use in LLM prompts.

## Tech Stack
- **HTML5**: Semantic structure.
- **CSS3**: Styling, Flexbox/Grid layout, CSS Variables for dynamic theming.
- **JavaScript (ES6+)**: Application logic, state management, DOM manipulation.
- **Google Fonts API**: Dynamic font loading.

## File Structure
- `index.html`: Main entry point. Contains the UI structure (Header, Control Panel, Preview, Output).
- `styles.css`: Global styles and specific styles for the preview simulation.
- `script.js`: Core application logic.
- `fonts.js`: Contains a curated list of Google Fonts.

## Core Components

### State Management
The application state is managed by a central `state` object in `script.js`:
```javascript
let state = {
    colors: { ... },
    fonts: { ... }
};
```
Changes to this state trigger UI updates.

### Color Generation
The app supports multiple generation modes:
- **Random**: Completely random hex codes.
- **Monochromatic**: Variations of a single hue.
- **Complementary**: Base hue + opposite hue (180deg).
- **Triadic**: Three hues spaced 120deg apart.

Color logic uses HSL math for relationships and converts to Hex for output.

### Font Pairing
Randomly selects a Heading and Body font from the `googleFonts` array in `fonts.js`.

### Preview System
The preview area uses CSS Variables (`--primary`, `--heading-font`, etc.) that are updated in real-time by JavaScript. This allows the preview to reflect the state instantly without reloading.

### History System
A stack-based history system (`history` array + `historyIndex`) enables Undo/Redo functionality. Every state change (generation or manual tweak) pushes a snapshot to the history stack.

### Deep Linking
The application state is serialized into the URL hash (e.g., `#primary=...&secondary=...`). On load, the app checks for a hash and hydrates the state if present, allowing for shareable links.

### Accessibility
A contrast checker calculates the WCAG contrast ratio between the background and text colors, displaying a Pass/Fail badge.
