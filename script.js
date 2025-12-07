const googleFonts = [
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Raleway",
    "Poppins",
    "Nunito",
    "Merriweather",
    "Playfair Display",
    "Lora",
    "Ubuntu",
    "Oswald",
    "Source Sans Pro",
    "Slabo 27px",
    "PT Sans",
    "Roboto Condensed",
    "Anton",
    "Mukta",
    "Bitter",
    "Dosis"
];

// State
let state = {
    colors: {
        primary: "#123456",
        secondary: "#abcdef",
        accent: "#789abc",
        background: "#ffffff",
        surface: "#f5f5f5",
        text: "#000000"
    },
    fonts: {
        headingFont: "Roboto",
        bodyFont: "Open Sans"
    }
};

let history = [];
let historyIndex = -1;
let isNavigatingHistory = false;

// DOM Elements
const previewFrame = document.getElementById('preview-frame');
const jsonOutput = document.getElementById('json-output');
const promptOutput = document.getElementById('prompt-output');
const shareLinkInput = document.getElementById('share-link');
const generateBtn = document.getElementById('generate-btn');
const copyJsonBtn = document.getElementById('copy-json-btn');
const copyPromptBtn = document.getElementById('copy-prompt-btn');
const copyLinkBtn = document.getElementById('copy-link-btn');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const contrastBadge = document.getElementById('contrast-badge');

// Initialization
function init() {
    if (window.location.hash) {
        loadFromHash();
    } else {
        generateTheme();
    }
    setupEventListeners();
}

function setupEventListeners() {
    generateBtn.addEventListener('click', () => generateTheme());
    copyJsonBtn.addEventListener('click', () => copyToClipboard(jsonOutput.value));
    copyPromptBtn.addEventListener('click', () => copyToClipboard(promptOutput.value));
    copyLinkBtn.addEventListener('click', () => copyToClipboard(shareLinkInput.value));
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
}

// Core Logic
function generateTheme() {
    const mode = document.getElementById('palette-mode').value;
    generateColors(mode);
    generateFonts();
    updateUI();
}

function generateColors(mode = 'random') {
    let baseHue = Math.floor(Math.random() * 360);
    let baseSat = Math.floor(Math.random() * 40) + 40; // 40-80%
    let baseLight = Math.floor(Math.random() * 40) + 30; // 30-70%

    let palette = {};

    switch (mode) {
        case 'monochromatic':
            palette = generateMonochromatic(baseHue, baseSat, baseLight);
            break;
        case 'complementary':
            palette = generateComplementary(baseHue, baseSat, baseLight);
            break;
        case 'triadic':
            palette = generateTriadic(baseHue, baseSat, baseLight);
            break;
        case 'random':
        default:
            palette = generateRandomPalette();
            break;
    }

    state.colors = palette;
}

function generateRandomPalette() {
    return {
        primary: getRandomHex(),
        secondary: getRandomHex(),
        accent: getRandomHex(),
        background: "#ffffff",
        surface: "#f5f5f5",
        text: "#000000"
    };
}

function generateMonochromatic(h, s, l) {
    return {
        primary: hslToHex(h, s, l),
        secondary: hslToHex(h, s, l + 20),
        accent: hslToHex(h, s, l - 20),
        background: "#ffffff",
        surface: hslToHex(h, 10, 95),
        text: "#000000"
    };
}

function generateComplementary(h, s, l) {
    let compH = (h + 180) % 360;
    return {
        primary: hslToHex(h, s, l),
        secondary: hslToHex(compH, s, l),
        accent: hslToHex(h, s, l - 20), // Darker primary
        background: "#ffffff",
        surface: hslToHex(h, 10, 95),
        text: "#000000"
    };
}

function generateTriadic(h, s, l) {
    let tri1 = (h + 120) % 360;
    let tri2 = (h + 240) % 360;
    return {
        primary: hslToHex(h, s, l),
        secondary: hslToHex(tri1, s, l),
        accent: hslToHex(tri2, s, l),
        background: "#ffffff",
        surface: hslToHex(h, 10, 95),
        text: "#000000"
    };
}

function generateFonts() {
    const heading = googleFonts[Math.floor(Math.random() * googleFonts.length)];
    const body = googleFonts[Math.floor(Math.random() * googleFonts.length)];
    state.fonts = { headingFont: heading, bodyFont: body };
}

function getRandomHex() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// UI Updates
function updateUI() {
    if (!isNavigatingHistory) {
        addToHistory();
    }
    updatePreview();
    updateOutputs();
    renderSwatches();
    updateHash();
    checkContrast();
    updateHistoryButtons();
}

function renderSwatches() {
    const container = document.getElementById('color-swatches');
    container.innerHTML = '';
    
    for (const [key, value] of Object.entries(state.colors)) {
        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = value;
        
        const label = document.createElement('span');
        label.innerText = key;
        
        const input = document.createElement('input');
        input.type = 'color';
        input.value = value;
        input.addEventListener('input', (e) => {
            state.colors[key] = e.target.value;
            // Don't add to history on every drag, maybe debounce or just update preview
            // For simplicity, just update preview and hash, add to history on change (blur)
            updatePreview();
            updateHash();
            checkContrast();
        });
        input.addEventListener('change', () => {
             addToHistory(); // Add to history when user finishes picking
             updateOutputs();
        });

        swatch.appendChild(label);
        swatch.appendChild(input);
        container.appendChild(swatch);
    }
}

function updatePreview() {
    // Update CSS Variables in the Preview
    const root = document.documentElement;
    root.style.setProperty('--primary', state.colors.primary);
    root.style.setProperty('--secondary', state.colors.secondary);
    root.style.setProperty('--accent', state.colors.accent);
    root.style.setProperty('--background', state.colors.background);
    root.style.setProperty('--surface', state.colors.surface);
    root.style.setProperty('--text', state.colors.text);
    
    root.style.setProperty('--heading-font', state.fonts.headingFont);
    root.style.setProperty('--body-font', state.fonts.bodyFont);

    // Load Fonts
    loadFonts([state.fonts.headingFont, state.fonts.bodyFont]);
}

function loadFonts(fonts) {
    const linkId = 'dynamic-fonts';
    let link = document.getElementById(linkId);
    if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    
    const fontQuery = fonts.map(f => f.replace(/ /g, '+')).join('|');
    link.href = `https://fonts.googleapis.com/css?family=${fontQuery}&display=swap`;
}

function updateOutputs() {
    const json = JSON.stringify(state, null, 2);
    jsonOutput.value = json;

    const prompt = `Build a responsive website using this theme. Follow these design guidelines:

Color Palette:
Primary: ${state.colors.primary}
Secondary: ${state.colors.secondary}
Accent: ${state.colors.accent}
Background: ${state.colors.background}
Surface: ${state.colors.surface}
Text: ${state.colors.text}

Fonts:
Heading font: ${state.fonts.headingFont}
Body font: ${state.fonts.bodyFont}

Requirements:
- Use the heading font for all titles and hero text.
- Use the body font for paragraphs, UI labels, and navigation.
- Use the primary color for buttons and the header.
- Use the background color for the page background.
- Use the surface color for cards and UI containers.

Return clean semantic HTML, modern CSS, and sample content.`;
    promptOutput.value = prompt;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

// History
function addToHistory() {
    // Remove future history if we were in the middle
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    history.push(JSON.parse(JSON.stringify(state)));
    historyIndex++;
    updateHistoryButtons();
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        state = JSON.parse(JSON.stringify(history[historyIndex]));
        isNavigatingHistory = true;
        updateUI();
        isNavigatingHistory = false;
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        state = JSON.parse(JSON.stringify(history[historyIndex]));
        isNavigatingHistory = true;
        updateUI();
        isNavigatingHistory = false;
    }
}

function updateHistoryButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
}

// URL Hash / Deep Linking
function updateHash() {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(state.colors)) {
        params.set(k, v);
    }
    params.set('heading', state.fonts.headingFont);
    params.set('body', state.fonts.bodyFont);
    
    const hash = params.toString();
    window.location.hash = hash;
    shareLinkInput.value = window.location.href;
}

function loadFromHash() {
    const params = new URLSearchParams(window.location.hash.substring(1));
    if (params.has('primary')) {
        state.colors.primary = params.get('primary');
        state.colors.secondary = params.get('secondary');
        state.colors.accent = params.get('accent');
        state.colors.background = params.get('background');
        state.colors.surface = params.get('surface');
        state.colors.text = params.get('text');
        state.fonts.headingFont = params.get('heading');
        state.fonts.bodyFont = params.get('body');
    }
}

// Accessibility
function checkContrast() {
    const bg = state.colors.background;
    const txt = state.colors.text;
    const ratio = getContrastRatio(bg, txt);
    
    contrastBadge.innerText = `Contrast: ${ratio.toFixed(2)}`;
    contrastBadge.className = 'badge ' + (ratio >= 4.5 ? 'pass' : 'fail');
}

function getContrastRatio(c1, c2) {
    const lum1 = getLuminance(c1);
    const lum2 = getLuminance(c2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

function getLuminance(hex) {
    const rgb = hexToRgb(hex);
    const a = rgb.map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}

// Start
init();
