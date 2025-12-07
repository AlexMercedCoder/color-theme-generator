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
const state = {
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

// DOM Elements
const previewFrame = document.getElementById('preview-frame');
const jsonOutput = document.getElementById('json-output');
const promptOutput = document.getElementById('prompt-output');
const generateBtn = document.getElementById('generate-btn');
const copyJsonBtn = document.getElementById('copy-json-btn');
const copyPromptBtn = document.getElementById('copy-prompt-btn');

// Initialization
function init() {
    generateTheme();
    setupEventListeners();
}

function setupEventListeners() {
    generateBtn.addEventListener('click', generateTheme);
    copyJsonBtn.addEventListener('click', () => copyToClipboard(jsonOutput.value));
    copyPromptBtn.addEventListener('click', () => copyToClipboard(promptOutput.value));
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
    updatePreview();
    updateOutputs();
    renderSwatches();
}

function renderSwatches() {
    const container = document.getElementById('color-swatches');
    container.innerHTML = '';
    
    for (const [key, value] of Object.entries(state.colors)) {
        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = value;
        swatch.innerHTML = `<span>${key}</span><span>${value}</span>`;
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

// Start
init();
