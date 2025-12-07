# Project Specification Sheet  
## One-Page Website: Random Color + Font Theme Generator with JSON + LLM Prompt Output

## 1. Project Overview
Build a one-page web application that generates random website themes that include color palettes and font pairings. The site displays a realistic mini-webpage preview, outputs JSON for easy LLM consumption, and provides a ready-to-use prompt for generating a website using the selected theme. The app runs fully client-side using HTML, CSS, and JavaScript.

---

## 2. Core Features

### 2.1 Random Color Scheme Generator
- Generates a structured palette of 4–6 HEX colors:
  - `primary`
  - `secondary`
  - `accent`
  - `background`
  - `surface`
  - `text`
- Modes:
  - Fully random
  - Monochromatic
  - Complementary
  - Triadic

### 2.2 Font Pairing Generator
- Randomly selects or intelligently suggests a pair of fonts:
  - `headingFont`
  - `bodyFont`
- Fonts drawn from Google Fonts (pre-defined list for offline compatibility).
- Users can preview fonts directly in the mini webpage preview.
- Selected fonts also appear in JSON output.

### 2.3 Mini Webpage Preview (Interactive Mock Webpage)
The preview window should look like a simplified real webpage, including:

**Header**
- Uses `primary` and `text` colors.
- Heading text uses `headingFont`.

**Hero Section**
- Large title using `headingFont`.
- Supporting text using `bodyFont`.

**Button Examples**
- Primary button (uses `primary` or `accent` colors).
- Secondary button (uses `secondary` or `surface` colors).

**Content Block**
- White or `surface` background with body text.
- Optional card UI.

**Footer**
- Small text using `bodyFont`.

Preview updates instantly with new color and font selections.

### 2.4 JSON Output Panel
Displays theme data in clean, formatted JSON for easy use in LLM prompts.

```json
{
  "colors": {
    "primary": "#123456",
    "secondary": "#abcdef",
    "accent": "#789abc",
    "background": "#ffffff",
    "surface": "#f5f5f5",
    "text": "#000000"
  },
  "fonts": {
    "headingFont": "Poppins",
    "bodyFont": "Inter"
  }
}
```

### 2.5 Copy JSON to Clipboard
One-click copying with “Copied!” feedback.

JSON always valid and auto-updated.

### 2.6 LLM Prompt Generator Output
The site should produce a second output panel that contains a pre-built prompt users can paste into an LLM.

Example format:

```text
Build a responsive website using this theme. Follow these design guidelines:

Color Palette:
Primary: #123456
Secondary: #abcdef
Accent: #789abc
Background: #ffffff
Surface: #f5f5f5
Text: #000000

Fonts:
Heading font: Poppins
Body font: Inter

Requirements:
- Use the heading font for all titles and hero text.
- Use the body font for paragraphs, UI labels, and navigation.
- Use the primary color for buttons and the header.
- Use the background color for the page background.
- Use the surface color for cards and UI containers.

Return clean semantic HTML, modern CSS, and sample content.
Prompt should update dynamically each time a new theme is generated.
```

## 4. User Interface Requirements
### 4.1 Layout
Three main sections:

- Theme Preview Window (mini webpage)

- Control Panel

- Output Panel (JSON + Prompt)

### 4.2 Controls
Buttons:

- Generate Theme

- Copy JSON

- Copy Prompt

Optional:

- Download JSON

- Lock Color

- Lock Font

Palette mode dropdown (Random, Complementary, etc.)

## 5. JavaScript Functional Requirements
### 5.1 Functions
**Color Generation**
- generateRandomColor()
- generatePalette(mode)

**Font Handling**
- generateFontPair()
- Returns a heading/body pairing.

- applyFontsToPreview(fonts)
- Injects Google Fonts <link> dynamically or uses fallback stacks.

**UI Updates**
- updatePreview(theme)
- Applies colors + fonts to preview webpage.

**JSON Output**
- updateJSONPanel(theme)
- copyJSON()

**Prompt Output**
- buildLLMPrompt(theme)
- copyPrompt()

### 5.2 Data Structure
```js
{
  colors: {
    primary: "",
    secondary: "",
    accent: "",
    background: "",
    surface: "",
    text: ""
  },
  fonts: {
    headingFont: "",
    bodyFont: ""
  }
}
```

## 6. Technical Requirements
### 6.1 Dependencies
- Vanilla HTML/CSS/JS

- Google Fonts API (optional but recommended)

### 6.2 Browser Compatibility
- Chrome, Firefox, Safari, Edge

- Desktop + mobile

### 6.3 Performance
- All theme building must be instant.

- No backend required.

## 7. Future Enhancements
- Save/share theme via URL encoding.

- Theme history panel.

- Manual font selection UI.

- AI-generated color palettes and font pairings.

## 8. Deliverables
- index.html
- styles.css
- script.js

Optional: fonts.js list for curated font pairings.

## 9. Success Criteria
- The preview resembles a real webpage.

- Color and font updates apply instantly.

- JSON output is always valid and complete.

- Prompt is well-structured, descriptive, and LLM-ready.

- Users can copy all outputs with one click.


