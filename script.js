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
    },
    locked: {},
    activeTab: 'json',
    darkMode: false,
    previewLayout: 'landing',
    visionFilter: 'normal',
    vibe: {
        saturation: 0,
        brightness: 0
    }
};

let history = [];
let historyIndex = -1;
let isNavigatingHistory = false;
let savedThemes = JSON.parse(localStorage.getItem('savedThemes')) || [];

// DOM Elements
const previewFrame = document.getElementById('preview-frame');
const codeOutput = document.getElementById('code-output');
const promptOutput = document.getElementById('prompt-output');
const gradientOutput = document.getElementById('gradient-output');
const gradientPreview = document.getElementById('gradient-preview');
const shareLinkInput = document.getElementById('share-link');
const generateBtn = document.getElementById('generate-btn');
const saveThemeBtn = document.getElementById('save-theme-btn');
const downloadBrandCardBtn = document.getElementById('download-brand-card-btn');
const copyCodeBtn = document.getElementById('copy-code-btn');
const copyPromptBtn = document.getElementById('copy-prompt-btn');
const copyGradientBtn = document.getElementById('copy-gradient-btn');
const copyLinkBtn = document.getElementById('copy-link-btn');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const contrastBadge = document.getElementById('contrast-badge');
const tabBtns = document.querySelectorAll('.tab-btn');
const previewLayoutSelect = document.getElementById('preview-layout');
const visionSimulatorSelect = document.getElementById('vision-simulator');
const savedThemesList = document.getElementById('saved-themes-list');
const satSlider = document.getElementById('sat-slider');
const brightSlider = document.getElementById('bright-slider');
const lockHeadingBtn = document.getElementById('lock-heading-btn');
const lockBodyBtn = document.getElementById('lock-body-btn');
const headingFontName = document.getElementById('heading-font-name');
const bodyFontName = document.getElementById('body-font-name');

// Initialization
function init() {
    if (window.location.hash) {
        loadFromHash();
    } else {
        generateTheme();
    }
    renderSavedThemes();
    setupEventListeners();
    updateFontUI();
}

function setupEventListeners() {
    generateBtn.addEventListener('click', () => generateTheme());
    saveThemeBtn.addEventListener('click', saveTheme);
    downloadBrandCardBtn.addEventListener('click', downloadBrandCard);
    copyCodeBtn.addEventListener('click', () => copyToClipboard(codeOutput.value));
    copyPromptBtn.addEventListener('click', () => copyToClipboard(promptOutput.value));
    copyGradientBtn.addEventListener('click', () => copyToClipboard(gradientOutput.value));
    copyLinkBtn.addEventListener('click', () => copyToClipboard(shareLinkInput.value));
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    themeToggleBtn.addEventListener('click', toggleDarkMode);
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            state.activeTab = e.target.dataset.tab;
            updateTabs();
            updateOutputs();
        });
    });

    previewLayoutSelect.addEventListener('change', (e) => {
        state.previewLayout = e.target.value;
        renderPreviewLayout();
    });

    visionSimulatorSelect.addEventListener('change', (e) => {
        state.visionFilter = e.target.value;
        updateVisionFilter();
    });

    satSlider.addEventListener('input', (e) => {
        state.vibe.saturation = parseInt(e.target.value);
        applyVibe();
    });

    brightSlider.addEventListener('input', (e) => {
        state.vibe.brightness = parseInt(e.target.value);
        applyVibe();
    });

    lockHeadingBtn.addEventListener('click', () => toggleLock('headingFont'));
    lockBodyBtn.addEventListener('click', () => toggleLock('bodyFont'));

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.code === 'Space') {
            e.preventDefault();
            generateTheme();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            undo();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
            e.preventDefault();
            redo();
        } else if (e.key === 'c') {
            copyToClipboard(codeOutput.value);
        }
    });
}

// Core Logic
function generateTheme() {
    const mode = document.getElementById('palette-mode').value;
    generateColors(mode);
    generateFonts();
    
    // Reset vibe sliders on new generation
    state.vibe.saturation = 0;
    state.vibe.brightness = 0;
    satSlider.value = 0;
    brightSlider.value = 0;

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

    // Apply only to unlocked colors
    for (const key in palette) {
        if (!state.locked[key]) {
            state.colors[key] = palette[key];
        }
    }
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
    if (!state.locked.headingFont) {
        state.fonts.headingFont = googleFonts[Math.floor(Math.random() * googleFonts.length)];
    }
    if (!state.locked.bodyFont) {
        state.fonts.bodyFont = googleFonts[Math.floor(Math.random() * googleFonts.length)];
    }
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

function hexToHsl(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length == 4) {
        r = "0x" + hex[1] + hex[1];
        g = "0x" + hex[2] + hex[2];
        b = "0x" + hex[3] + hex[3];
    } else if (hex.length == 7) {
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
}

// Vibe Sliders
function applyVibe() {
    // This function modifies the current colors based on sliders
    // Note: This is a destructive operation on the current state for simplicity,
    // but in a real app you might want to store base colors separate from display colors.
    // Here we will just regenerate from current hexes but shifted.
    
    // Actually, to make it non-destructive and smooth, we should probably apply it to the CSS variables
    // and only commit to state when the slider is released? 
    // For simplicity in this vanilla app, we'll update state directly but maybe we need a 'baseColors' state?
    // Let's keep it simple: The sliders adjust the *current* colors. 
    // But if you slide back and forth, you might lose precision.
    // A better approach for this scope:
    // When sliders move, we don't change state.colors, we just update the preview variables.
    // But then the hex codes in UI won't match.
    // Let's just update state.colors and accept some lossiness, or better:
    // Re-generate the theme with new saturation/lightness offsets if we had the seed.
    
    // Alternative: The sliders are just for "tweaking" the current set.
    // We will iterate over all unlocked colors, convert to HSL, add offset, convert back.
    // To prevent drift, we should ideally store the "original" colors before sliding started.
    // But that adds complexity. Let's try direct modification for now.
    
    // Wait, if I slide +10 then -10, I want to be back at 0.
    // So I need a reference point.
    // Let's assume the current state.colors IS the reference when generation happens.
    // But if I slide, I need to know the base.
    // Let's add `baseColors` to state.
    
    if (!state.baseColors) {
        state.baseColors = { ...state.colors };
    }

    const sOffset = state.vibe.saturation;
    const lOffset = state.vibe.brightness;

    for (const key in state.baseColors) {
        if (!state.locked[key]) {
            const hsl = hexToHsl(state.baseColors[key]);
            let newS = Math.min(100, Math.max(0, hsl.s + sOffset));
            let newL = Math.min(100, Math.max(0, hsl.l + lOffset));
            state.colors[key] = hslToHex(hsl.h, newS, newL);
        }
    }
    
    updateUI(true); // true = skip adding to history to avoid spamming stack while sliding
}

// UI Updates
function updateUI(skipHistory = false) {
    if (!skipHistory && !isNavigatingHistory) {
        addToHistory();
        // Update base colors for vibe check whenever we commit a new state
        state.baseColors = { ...state.colors };
    }
    updatePreview();
    updateOutputs();
    renderSwatches();
    updateHash();
    checkContrast();
    updateHistoryButtons();
    updateTabs();
    updateGradient();
    updateFontUI();
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
        
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        controls.style.gap = '0.5rem';

        // Lock Button
        const lockBtn = document.createElement('button');
        lockBtn.className = `lock-btn ${state.locked[key] ? 'locked' : ''}`;
        lockBtn.innerHTML = state.locked[key] ? '🔒' : '🔓';
        lockBtn.title = state.locked[key] ? 'Unlock Color' : 'Lock Color';
        lockBtn.onclick = () => {
            state.locked[key] = !state.locked[key];
            renderSwatches(); // Re-render to update icon
        };

        const input = document.createElement('input');
        input.type = 'color';
        input.value = value;
        input.addEventListener('input', (e) => {
            state.colors[key] = e.target.value;
            // Update base color too so vibe check doesn't revert it
            if(state.baseColors) state.baseColors[key] = e.target.value;
            
            updatePreview();
            updateHash();
            checkContrast();
            updateGradient();
        });
        input.addEventListener('change', () => {
             addToHistory();
             updateOutputs();
        });

        controls.appendChild(lockBtn);
        controls.appendChild(input);
        swatch.appendChild(label);
        swatch.appendChild(controls);
        container.appendChild(swatch);
    }
}

function updateFontUI() {
    headingFontName.innerText = state.fonts.headingFont;
    bodyFontName.innerText = state.fonts.bodyFont;
    
    lockHeadingBtn.innerHTML = state.locked.headingFont ? '🔒' : '🔓';
    lockHeadingBtn.className = `lock-btn ${state.locked.headingFont ? 'locked' : ''}`;
    
    lockBodyBtn.innerHTML = state.locked.bodyFont ? '🔒' : '🔓';
    lockBodyBtn.className = `lock-btn ${state.locked.bodyFont ? 'locked' : ''}`;
}

function toggleLock(key) {
    state.locked[key] = !state.locked[key];
    updateFontUI();
}

function updatePreview() {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(state.colors)) {
        root.style.setProperty(`--${key}`, value);
    }
    root.style.setProperty('--heading-font', state.fonts.headingFont);
    root.style.setProperty('--body-font', state.fonts.bodyFont);

    loadFonts([state.fonts.headingFont, state.fonts.bodyFont]);
}

function renderPreviewLayout() {
    const layout = state.previewLayout;
    previewFrame.className = `layout-${layout}`;
    previewFrame.innerHTML = '';

    if (layout === 'landing') {
        previewFrame.innerHTML = `
            <div id="preview-header">
                <h3>Brand</h3>
                <nav class="preview-nav">
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                </nav>
            </div>
            <div id="preview-hero">
                <h2>Build Something Amazing</h2>
                <p>This is how your typography and colors will look in a real layout.</p>
                <div style="margin-top: 2rem;">
                    <button class="preview-btn preview-btn-primary">Get Started</button>
                    <button class="preview-btn preview-btn-secondary">Learn More</button>
                </div>
            </div>
            <div id="preview-content">
                <div class="preview-card">
                    <h4>Content Section</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
            </div>
        `;
    } else if (layout === 'dashboard') {
        previewFrame.innerHTML = `
            <div class="layout-dashboard">
                <div class="dashboard-sidebar">
                    <h3>Dash</h3>
                    <ul style="list-style:none; margin-top:2rem; line-height:2;">
                        <li>Overview</li>
                        <li>Analytics</li>
                        <li>Settings</li>
                    </ul>
                </div>
                <div class="dashboard-main">
                    <div class="dashboard-header">
                        <h4>Dashboard Overview</h4>
                    </div>
                    <div class="dashboard-content">
                        <div class="preview-card">
                            <h4>Recent Activity</h4>
                            <p>User registration +20%</p>
                        </div>
                        <div class="preview-card" style="margin-top:1rem;">
                            <h4>Sales</h4>
                            <p>Revenue: $12,450</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (layout === 'blog') {
        previewFrame.innerHTML = `
             <div id="preview-header">
                <h3>My Blog</h3>
            </div>
            <div id="preview-content">
                <h1>The Future of Web Design</h1>
                <p style="color:var(--accent); font-weight:bold;">Published on Dec 7, 2025</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <blockquote>"Design is not just what it looks like and feels like. Design is how it works."</blockquote>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
        `;
    } else if (layout === 'ecommerce') {
        previewFrame.innerHTML = `
             <div id="preview-header">
                <h3>Shop</h3>
                <div>🛒 3</div>
            </div>
            <div class="product-grid">
                <div class="product-card">
                    <div class="product-img"></div>
                    <div class="product-info">
                        <h4>Cool Product</h4>
                        <p style="color:var(--primary); font-weight:bold;">$99.00</p>
                        <button class="preview-btn preview-btn-primary" style="width:100%; margin:0.5rem 0 0 0;">Add to Cart</button>
                    </div>
                </div>
                <div class="product-card">
                    <div class="product-img"></div>
                    <div class="product-info">
                        <h4>Awesome Item</h4>
                        <p style="color:var(--primary); font-weight:bold;">$49.00</p>
                        <button class="preview-btn preview-btn-primary" style="width:100%; margin:0.5rem 0 0 0;">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    }
}

function updateVisionFilter() {
    const filter = state.visionFilter;
    if (filter === 'normal') {
        previewFrame.style.filter = 'none';
    } else {
        previewFrame.style.filter = `url(#${filter})`;
    }
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

function updateTabs() {
    tabBtns.forEach(btn => {
        if (btn.dataset.tab === state.activeTab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateOutputs() {
    let output = '';
    
    if (state.activeTab === 'json') {
        output = JSON.stringify(state.colors, null, 2);
    } else if (state.activeTab === 'css') {
        output = `:root {\n`;
        for (const [key, value] of Object.entries(state.colors)) {
            output += `  --${key}: ${value};\n`;
        }
        output += `  --heading-font: '${state.fonts.headingFont}', sans-serif;\n`;
        output += `  --body-font: '${state.fonts.bodyFont}', sans-serif;\n`;
        output += `}`;
    } else if (state.activeTab === 'scss') {
        output = `// Variables\n`;
        for (const [key, value] of Object.entries(state.colors)) {
            output += `$${key}: ${value};\n`;
        }
        output += `$heading-font: '${state.fonts.headingFont}', sans-serif;\n`;
        output += `$body-font: '${state.fonts.bodyFont}', sans-serif;\n`;
    } else if (state.activeTab === 'tailwind') {
        output = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n`;
        for (const [key, value] of Object.entries(state.colors)) {
            output += `        ${key}: '${value}',\n`;
        }
        output += `      },\n      fontFamily: {\n`;
        output += `        heading: ['${state.fonts.headingFont}', 'sans-serif'],\n`;
        output += `        body: ['${state.fonts.bodyFont}', 'sans-serif'],\n`;
        output += `      }\n    }\n  }\n}`;
    }

    codeOutput.value = output;

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

function updateGradient() {
    const gradient = `linear-gradient(135deg, ${state.colors.primary}, ${state.colors.secondary})`;
    gradientPreview.style.background = gradient;
    gradientOutput.value = `background: ${gradient};`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    });
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Brand Card Export
function downloadBrandCard() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = state.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = state.colors.text;
    ctx.font = `bold 40px sans-serif`;
    ctx.fillText("Brand Theme", 50, 80);

    // Fonts
    ctx.font = `24px sans-serif`;
    ctx.fillText(`Heading: ${state.fonts.headingFont}`, 50, 140);
    ctx.fillText(`Body: ${state.fonts.bodyFont}`, 50, 180);

    // Swatches
    const colors = Object.entries(state.colors);
    const swatchWidth = 100;
    const swatchHeight = 100;
    const startX = 50;
    const startY = 250;

    colors.forEach((color, index) => {
        const [name, hex] = color;
        const x = startX + (index % 3) * 220;
        const y = startY + Math.floor(index / 3) * 150;

        // Swatch Rect
        ctx.fillStyle = hex;
        ctx.fillRect(x, y, swatchWidth, swatchHeight);
        
        // Label
        ctx.fillStyle = state.colors.text;
        ctx.font = "16px sans-serif";
        ctx.fillText(name, x, y + swatchHeight + 25);
        ctx.fillText(hex, x, y + swatchHeight + 45);
    });

    // Footer
    ctx.fillStyle = state.colors.text;
    ctx.font = "14px sans-serif";
    ctx.globalAlpha = 0.5;
    ctx.fillText("Generated by ThemeGen", 50, 550);

    // Download
    const link = document.createElement('a');
    link.download = 'brand-card.png';
    link.href = canvas.toDataURL();
    link.click();
}

// History
function addToHistory() {
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    // Deep copy state including locks
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
        renderPreviewLayout(); // Ensure layout updates on undo
        isNavigatingHistory = false;
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        state = JSON.parse(JSON.stringify(history[historyIndex]));
        isNavigatingHistory = true;
        updateUI();
        renderPreviewLayout();
        isNavigatingHistory = false;
    }
}

function updateHistoryButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
}

// Saved Themes
function saveTheme() {
    const theme = {
        id: Date.now(),
        colors: { ...state.colors },
        fonts: { ...state.fonts },
        date: new Date().toLocaleDateString()
    };
    savedThemes.unshift(theme);
    localStorage.setItem('savedThemes', JSON.stringify(savedThemes));
    renderSavedThemes();
    showToast('Theme saved!');
}

function renderSavedThemes() {
    savedThemesList.innerHTML = '';
    if (savedThemes.length === 0) {
        savedThemesList.innerHTML = '<div class="empty-state">No saved themes yet.</div>';
        return;
    }

    savedThemes.forEach(theme => {
        const item = document.createElement('div');
        item.className = 'saved-theme-item';
        
        const preview = document.createElement('div');
        preview.className = 'saved-theme-preview';
        Object.values(theme.colors).forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'mini-swatch';
            swatch.style.backgroundColor = color;
            preview.appendChild(swatch);
        });

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '0.5rem';

        const loadBtn = document.createElement('button');
        loadBtn.innerText = 'Load';
        loadBtn.className = 'secondary-btn';
        loadBtn.style.padding = '0.2rem 0.5rem';
        loadBtn.style.fontSize = '0.8rem';
        loadBtn.onclick = () => loadTheme(theme);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.className = 'delete-theme-btn';
        deleteBtn.onclick = () => deleteTheme(theme.id);

        actions.appendChild(loadBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(preview);
        item.appendChild(actions);
        savedThemesList.appendChild(item);
    });
}

function loadTheme(theme) {
    state.colors = { ...theme.colors };
    state.fonts = { ...theme.fonts };
    // Reset vibe
    state.vibe.saturation = 0;
    state.vibe.brightness = 0;
    satSlider.value = 0;
    brightSlider.value = 0;
    
    updateUI();
    showToast('Theme loaded!');
}

function deleteTheme(id) {
    savedThemes = savedThemes.filter(t => t.id !== id);
    localStorage.setItem('savedThemes', JSON.stringify(savedThemes));
    renderSavedThemes();
}

// App Dark Mode
function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('dark-mode', state.darkMode);
    themeToggleBtn.innerText = state.darkMode ? '☀️' : '🌙';
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
