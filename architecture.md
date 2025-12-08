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

Color logic uses HSL math for relationships and converts to Hex for output. Users can **Lock** specific colors to prevent them from changing during generation.

**Vibe Sliders** allow real-time adjustment of Saturation and Brightness for the entire palette.

### Export System
The output panel supports multiple formats:
- **JSON**: Raw data for LLMs.
- **CSS**: `:root` variables.
- **SCSS**: SASS variables.
- **Tailwind**: Configuration object.
- **Brand Card**: Downloadable PNG image via Canvas API.

### Keyboard Shortcuts
- `Space`: Generate new theme.
- `Ctrl/Cmd + Z`: Undo.
- `Ctrl/Cmd + Y`: Redo.
- `C`: Copy current code output.

### Notifications
A custom Toast notification system replaces browser alerts for non-intrusive feedback.

### Font Pairing
Randomly selects a Heading and Body font from the `googleFonts` array in `fonts.js`. Users can **Lock** fonts independently.

### Typography Scale
Users can select a modular scale (e.g., Major Third, Golden Ratio) which updates CSS variables (`--text-sm` to `--text-4xl`) to ensure harmonious font sizing.

### Preview System
The preview area uses CSS Variables (`--primary`, `--heading-font`, etc.) that are updated in real-time by JavaScript. It supports multiple layouts:
- **Landing Page**: Standard hero + content.
- **Dashboard**: Sidebar + data widgets.
- **Blog**: Typography focused.
- **E-commerce**: Product grid.

**Smooth Transitions** are applied to CSS variables for a polished feel when changing themes.

**Interactive Snippets**: Clicking on components in the preview (e.g., buttons, cards) opens a modal with the HTML code for that specific element.

### Image to Theme
Uses the Canvas API to analyze an uploaded image. It samples pixels, calculates frequency, and uses a simple clustering algorithm (based on Euclidean distance in RGB space) to extract 6 distinct dominant colors, which are then mapped to the theme palette based on luminance.

### Zen Mode
Toggles a class on the `<body>` that hides all panels except the preview area, allowing for distraction-free viewing.

### Accessibility Tools
- **Contrast Checker**: WCAG ratio calculation.
- **Color Blindness Simulator**: SVG filters to simulate Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.

### Persistence
- **History**: Stack-based Undo/Redo.
- **Saved Themes**: `localStorage` persistence for a personal library of themes.
- **Deep Linking**: URL hash state.

### Utilities
- **Gradient Generator**: Creates CSS gradients from the current palette.
- **App Dark Mode**: Toggles the generator's UI theme.
