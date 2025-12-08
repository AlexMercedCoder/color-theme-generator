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
    focusRing: {
        color: '#3b82f6',
        style: 'solid'
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
let savedThemes = [];
try {
    savedThemes = JSON.parse(localStorage.getItem('savedThemes')) || [];
} catch (e) {
    console.warn('LocalStorage not available:', e);
}

// DOM Elements
// DOM Elements
let previewFrame, codeOutput, promptOutput, gradientOutput, gradientPreview, shareLinkInput;
let generateBtn, saveThemeBtn, downloadBrandCardBtn, copyCodeBtn, copyPromptBtn, copyGradientBtn, copyLinkBtn;
let undoBtn, redoBtn, themeToggleBtn, contrastBadge, tabBtns, previewLayoutSelect, visionSimulatorSelect;
let savedThemesList, satSlider, brightSlider, lockHeadingBtn, lockBodyBtn, headingFontName, bodyFontName;
let tourBtn, tourNextBtn, tourSkipBtn, fixContrastBtn, zenModeBtn, exitZenBtn, imageUpload, magicKeyword, typeScale;
let focusColorInput, focusStyleSelect;
let brandCardSizeSelect;
let fontUpload;

// Initialization
// Initialization
function init() {
    initializeGlobals();
    if (window.location.hash) {
        loadFromHash();
        updateUI(); // Fix: Ensure UI updates when loading from hash
    } else {
        generateTheme();
    }
    renderSavedThemes();
    setupEventListeners();
    updateFontUI();
}

function initializeGlobals() {
    previewFrame = document.getElementById('preview-frame');
    codeOutput = document.getElementById('code-output');
    promptOutput = document.getElementById('prompt-output');
    gradientOutput = document.getElementById('gradient-output');
    gradientPreview = document.getElementById('gradient-preview');
    shareLinkInput = document.getElementById('share-link');
    generateBtn = document.getElementById('generate-btn');
    saveThemeBtn = document.getElementById('save-theme-btn');
    downloadBrandCardBtn = document.getElementById('download-brand-card-btn');
    copyCodeBtn = document.getElementById('copy-code-btn');
    copyPromptBtn = document.getElementById('copy-prompt-btn');
    copyGradientBtn = document.getElementById('copy-gradient-btn');
    copyLinkBtn = document.getElementById('copy-link-btn');
    undoBtn = document.getElementById('undo-btn');
    redoBtn = document.getElementById('redo-btn');
    themeToggleBtn = document.getElementById('theme-toggle');
    contrastBadge = document.getElementById('contrast-badge');
    tabBtns = document.querySelectorAll('.tab-btn');
    previewLayoutSelect = document.getElementById('preview-layout');
    visionSimulatorSelect = document.getElementById('vision-simulator');
    savedThemesList = document.getElementById('saved-themes-list');
    satSlider = document.getElementById('sat-slider');
    brightSlider = document.getElementById('bright-slider');
    lockHeadingBtn = document.getElementById('lock-heading-btn');
    lockBodyBtn = document.getElementById('lock-body-btn');
    headingFontName = document.getElementById('heading-font-name');
    bodyFontName = document.getElementById('body-font-name');

    // New elements
    tourBtn = document.getElementById('tour-btn');
    tourNextBtn = document.getElementById('tour-next');
    tourSkipBtn = document.getElementById('tour-skip');
    fixContrastBtn = document.getElementById('fix-contrast-btn');
    zenModeBtn = document.getElementById('zen-mode-btn');
    exitZenBtn = document.getElementById('exit-zen-btn');
    imageUpload = document.getElementById('image-upload');
    magicKeyword = document.getElementById('magic-keyword');
    typeScale = document.getElementById('type-scale');
    focusColorInput = document.getElementById('focus-color');
    focusStyleSelect = document.getElementById('focus-style');
    focusStyleSelect = document.getElementById('focus-style');
    brandCardSizeSelect = document.getElementById('brand-card-size');
    fontUpload = document.getElementById('font-upload');
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

    // Phase 5 Listeners
    imageUpload.addEventListener('change', handleImageUpload);
    typeScale.addEventListener('change', updateTypeScale);
    zenModeBtn.addEventListener('click', toggleZenMode);

    // Phase 6 Listeners
    magicKeyword.addEventListener('change', generateFromKeyword);

    // Phase 7 Listeners
    tourBtn.addEventListener('click', startTour);
    tourNextBtn.addEventListener('click', nextTourStep);
    tourSkipBtn.addEventListener('click', endTour);
    fixContrastBtn.addEventListener('click', fixContrast);
    exitZenBtn.addEventListener('click', toggleZenMode);

    focusColorInput.addEventListener('input', updateFocusRing);
    focusStyleSelect.addEventListener('change', updateFocusRing);
    fontUpload.addEventListener('change', handleFontUpload);

    // Spec Sheet Listeners
    const generateSpecBtn = document.getElementById('generate-spec-btn');
    const copySpecBtn = document.getElementById('copy-spec-btn');
    const downloadSpecBtn = document.getElementById('download-spec-btn');

    if (generateSpecBtn) generateSpecBtn.addEventListener('click', showSpecModal);
    if (copySpecBtn) copySpecBtn.addEventListener('click', copySpecSheet);
    if (downloadSpecBtn) downloadSpecBtn.addEventListener('click', downloadSpecSheet);

    setupSnippetInteractions();
    renderPreviewLayout(); // Fix: Ensure preview is rendered on load

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
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
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
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
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
    if (!document.startViewTransition) {
        performUIUpdate(skipHistory);
        return;
    }
    document.startViewTransition(() => {
        performUIUpdate(skipHistory);
    });
}

function performUIUpdate(skipHistory) {
    if (!skipHistory && !isNavigatingHistory) {
        addToHistory();
        // Update base colors for vibe check whenever we commit a new state
        state.baseColors = { ...state.colors };
    }
    updatePreview();
    updateOutputs(); // Consolidated function
    renderSwatches();
    // updatePreview(); // Removed duplicate call
    updateHistoryButtons();
    updateThemeName(); // Phase 7

    // Accessibility Check
    const ratio = checkContrast(state.colors.background, state.colors.text);
    const badge = document.getElementById('contrast-badge');
    const ratioText = document.getElementById('contrast-ratio');
    const fixBtn = document.getElementById('fix-contrast-btn'); // Phase 7

    if (ratioText) ratioText.textContent = ratio.toFixed(2);
    if (badge && fixBtn) {
        if (ratio >= 4.5) {
            badge.textContent = 'Pass (AA)';
            badge.className = 'badge pass';
            fixBtn.style.display = 'none';
        } else {
            badge.textContent = 'Fail';
            badge.className = 'badge fail';
            fixBtn.style.display = 'inline-block';
        }
    }
    // updateHash(); // Moved to updateOutputs
    updateTabs();
    // updateGradient(); // Moved to updateOutputs
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
            if (state.baseColors) state.baseColors[key] = e.target.value;

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
    if (!headingFontName || !bodyFontName) return; // Safety check
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
    } else if (layout === 'components') {
        previewFrame.innerHTML = `
            <div class="component-showcase">
                <h4>Buttons</h4>
                <div class="button-group">
                    <button class="preview-btn preview-btn-primary">Primary Button</button>
                    <button class="preview-btn preview-btn-secondary">Secondary Button</button>
                    <button class="preview-btn" style="background:var(--accent); color:white;">Accent Button</button>
                </div>
            </div>
            <div class="component-showcase">
                <h4>Alerts</h4>
                <div class="alert-box">
                    <strong>Info:</strong> This is an informational alert message.
                </div>
            </div>
            <div class="component-showcase">
                <h4>Badges</h4>
                <div>
                    <span class="badge-demo">New</span>
                    <span class="badge-demo" style="background:var(--secondary);">Featured</span>
                    <span class="badge-demo" style="background:var(--accent);">Sale</span>
                </div>
            </div>
            <div class="component-showcase">
                <h4>Form Inputs</h4>
                <div class="form-demo">
                    <input type="text" placeholder="Enter your name">
                    <input type="email" placeholder="Enter your email">
                    <button class="preview-btn preview-btn-primary">Submit</button>
                </div>
            </div>
            <div class="component-showcase">
                <h4>Cards</h4>
                <div class="preview-card">
                    <h4>Card Title</h4>
                    <p>This is a card component with surface background and rounded corners.</p>
                </div>
            </div>
        `;
    } else if (layout === 'admin') {
        previewFrame.innerHTML = `
            <div class="admin-sidebar">
                <h3>Admin Panel</h3>
                <ul class="admin-nav">
                    <li>Dashboard</li>
                    <li>Users</li>
                    <li>Analytics</li>
                    <li>Settings</li>
                </ul>
            </div>
            <div class="admin-main">
                <div class="admin-header">
                    <h2>Dashboard Overview</h2>
                    <button class="preview-btn preview-btn-primary">New Report</button>
                </div>
                <div class="stat-cards">
                    <div class="stat-card">
                        <h4>Total Users</h4>
                        <div class="stat-value">1,234</div>
                    </div>
                    <div class="stat-card">
                        <h4>Revenue</h4>
                        <div class="stat-value">$45.2K</div>
                    </div>
                    <div class="stat-card">
                        <h4>Active Sessions</h4>
                        <div class="stat-value">89</div>
                    </div>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John Doe</td>
                            <td>john@example.com</td>
                            <td>Active</td>
                        </tr>
                        <tr>
                            <td>Jane Smith</td>
                            <td>jane@example.com</td>
                            <td>Active</td>
                        </tr>
                        <tr>
                            <td>Bob Johnson</td>
                            <td>bob@example.com</td>
                            <td>Inactive</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else if (layout === 'marketing') {
        previewFrame.innerHTML = `
            <div class="marketing-hero">
                <h1>Transform Your Business</h1>
                <p>The ultimate solution for modern companies</p>
                <div class="cta-buttons">
                    <button class="preview-btn" style="background:white; color:var(--primary); font-weight:bold;">Get Started Free</button>
                    <button class="preview-btn" style="background:rgba(255,255,255,0.2); color:white; border:2px solid white;">Learn More</button>
                </div>
            </div>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Fast Performance</h3>
                    <p>Lightning-fast load times and optimized for speed</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3>Secure & Reliable</h3>
                    <p>Enterprise-grade security and 99.9% uptime</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>Mobile Ready</h3>
                    <p>Fully responsive design for all devices</p>
                </div>
            </div>
            <div class="testimonials">
                <h2>What Our Customers Say</h2>
                <div class="testimonial-grid">
                    <div class="testimonial-card">
                        <p>"This product has completely transformed how we work. Highly recommended!"</p>
                        <div class="testimonial-author">- Sarah Johnson, CEO</div>
                    </div>
                    <div class="testimonial-card">
                        <p>"The best investment we've made this year. Amazing results!"</p>
                        <div class="testimonial-author">- Mike Chen, Founder</div>
                    </div>
                </div>
            </div>
        `;
    } else if (layout === 'app') {
        previewFrame.innerHTML = `
            <div class="app-header">
                <h3>MyApp Dashboard</h3>
                <div class="app-header-actions">
                    <button class="preview-btn" style="background:rgba(255,255,255,0.2); color:white; padding:0.5rem 1rem;">Notifications</button>
                    <button class="preview-btn" style="background:rgba(255,255,255,0.2); color:white; padding:0.5rem 1rem;">Profile</button>
                </div>
            </div>
            <div class="app-body">
                <div class="app-sidebar">
                    <ul>
                        <li class="active">Home</li>
                        <li>Projects</li>
                        <li>Tasks</li>
                        <li>Team</li>
                        <li>Settings</li>
                    </ul>
                </div>
                <div class="app-content">
                    <h2>Welcome Back!</h2>
                    <div class="app-card">
                        <h4>Recent Activity</h4>
                        <p>You have 3 new notifications and 5 pending tasks.</p>
                        <div class="app-actions">
                            <button class="preview-btn preview-btn-primary">View Tasks</button>
                            <button class="preview-btn preview-btn-secondary">View Notifications</button>
                        </div>
                    </div>
                    <div class="app-card">
                        <h4>Quick Stats</h4>
                        <p>Projects: 12 | Completed: 8 | In Progress: 4</p>
                    </div>
                </div>
            </div>
        `;
    }
}


function updateVisionFilter() {
    const filter = state.visionFilter;
    if (filter === 'normal') {
        document.body.style.filter = 'none';
    } else if (filter === 'protanopia') {
        document.body.style.filter = 'url(#protanopia)'; // We would need SVG filters for this
        // For now, let's just simulate with CSS if possible, or skip.
        // A simple approximation for red-green blindness:
        // This is hard to do with just CSS filters without SVG.
        // Let's leave it as a placeholder or implement SVG filters later.
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
    if (!tabBtns) return; // Safety check
    tabBtns.forEach(btn => {
        if (btn.dataset.tab === state.activeTab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateOutputs() {
    // 1. Update Code Output
    const output = document.getElementById('code-output');
    const tab = state.activeTab;

    if (tab === 'json') {
        output.value = JSON.stringify(state.colors, null, 4);
    } else if (tab === 'css') {
        let css = ':root {\n';
        for (const [key, value] of Object.entries(state.colors)) {
            css += `    --${key}: ${value};\n`;
        }
        css += `    --heading-font: "${state.fonts.headingFont}", sans-serif;\n`;
        css += `    --body-font: "${state.fonts.bodyFont}", sans-serif;\n`;
        css += '}';
        output.value = css;
    } else if (tab === 'scss') {
        let scss = '';
        for (const [key, value] of Object.entries(state.colors)) {
            scss += `$${key}: ${value};\n`;
        }
        scss += `$heading-font: "${state.fonts.headingFont}", sans-serif;\n`;
        scss += `$body-font: "${state.fonts.bodyFont}", sans-serif;`;
        output.value = scss;
    } else if (tab === 'tailwind') {
        output.value = `module.exports = {
  theme: {
    extend: {
      colors: {
${Object.entries(state.colors).map(([k, v]) => `        ${k}: '${v}'`).join(',\n')}
      },
      fontFamily: {
        heading: ['"${state.fonts.headingFont}"', 'sans-serif'],
        body: ['"${state.fonts.bodyFont}"', 'sans-serif'],
      }
    }
  }
}`;
    } else if (tab === 'figma') {
        // Figma Tokens (Simplified)
        const tokens = {};
        for (const [key, value] of Object.entries(state.colors)) {
            tokens[key] = { value: value, type: 'color' };
        }
        tokens['font-heading'] = { value: state.fonts.headingFont, type: 'fontFamilies' };
        tokens['font-body'] = { value: state.fonts.bodyFont, type: 'fontFamilies' };
        output.value = JSON.stringify(tokens, null, 4);
    } else if (tab === 'react') {
        // React Theme Object
        const theme = {
            colors: state.colors,
            fonts: {
                heading: state.fonts.headingFont,
                body: state.fonts.bodyFont
            }
        };
        output.value = `export const theme = ${JSON.stringify(theme, null, 4)};`;
    } else if (tab === 'tokens') {
        const tokens = {
            color: {},
            font: {
                family: {
                    heading: { value: state.fonts.headingFont, type: "fontFamily" },
                    body: { value: state.fonts.bodyFont, type: "fontFamily" }
                }
            }
        };
        for (const [key, value] of Object.entries(state.colors)) {
            tokens.color[key] = { value: value, type: "color" };
        }
        output.value = JSON.stringify(tokens, null, 4);
    }

    // 2. Update Prompt Output
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
    document.getElementById('prompt-output').value = prompt;

    // 3. Update Gradient Output
    updateGradient();

    // 4. Update Hash/Share Link
    updateHash();
}

function updateGradient() {
    if (!gradientPreview || !gradientOutput) return; // Safety check
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
    const select = brandCardSizeSelect || document.getElementById('brand-card-size');
    const size = select ? select.value : 'standard';
    const canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    // Dimensions
    if (size === 'story') {
        canvas.width = 1080;
        canvas.height = 1920;
    } else if (size === 'post') {
        canvas.width = 1080;
        canvas.height = 1080;
    } else {
        canvas.width = 800;
        canvas.height = 600;
    }

    // Background
    ctx.fillStyle = state.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = state.colors.text;
    ctx.textAlign = 'center';
    ctx.font = `bold ${canvas.width * 0.05}px sans-serif`;
    ctx.fillText("Brand Theme", canvas.width / 2, canvas.height * 0.1);

    // Fonts
    ctx.font = `${canvas.width * 0.03}px sans-serif`;
    ctx.fillText(`Heading: ${state.fonts.headingFont}`, canvas.width / 2, canvas.height * 0.15);
    ctx.fillText(`Body: ${state.fonts.bodyFont}`, canvas.width / 2, canvas.height * 0.19);

    // Swatches
    const colors = Object.entries(state.colors);
    const swatchSize = canvas.width * 0.15;
    const gap = canvas.width * 0.05;

    // Calculate Grid
    let cols = 3;
    if (size === 'story') cols = 2;

    const totalWidth = cols * swatchSize + (cols - 1) * gap;
    const startX = (canvas.width - totalWidth) / 2;
    const startY = canvas.height * 0.3;

    colors.forEach((color, index) => {
        const [name, hex] = color;
        const col = index % cols;
        const row = Math.floor(index / cols);

        const x = startX + col * (swatchSize + gap);
        const y = startY + row * (swatchSize + gap + 60);

        // Swatch Rect
        ctx.fillStyle = hex;
        ctx.fillRect(x, y, swatchSize, swatchSize);

        // Label
        ctx.fillStyle = state.colors.text;
        ctx.textAlign = 'center';
        ctx.font = `${canvas.width * 0.025}px sans-serif`;
        ctx.fillText(name, x + swatchSize / 2, y + swatchSize + 25);
        ctx.fillText(hex, x + swatchSize / 2, y + swatchSize + 50);
    });

    // Footer
    ctx.fillStyle = state.colors.text;
    ctx.font = `${canvas.width * 0.02}px sans-serif`;
    ctx.globalAlpha = 0.5;
    ctx.fillText("Generated by ThemeGen", canvas.width / 2, canvas.height * 0.95);

    // Download
    const link = document.createElement('a');
    link.download = `brand-card-${size}.png`;
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
    if (!undoBtn || !redoBtn) return; // Safety check
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



// Zen Mode
function toggleZenMode() {
    document.body.classList.toggle('zen-mode');
    const isZen = document.body.classList.contains('zen-mode');
    document.getElementById('exit-zen-btn').style.display = isZen ? 'block' : 'none';
}



// Type Scale
function updateTypeScale() {
    const scale = document.getElementById('type-scale').value;
    document.documentElement.style.setProperty('--scale-ratio', scale);
}

// Focus Ring
function updateFocusRing() {
    state.focusRing.color = focusColorInput.value;
    state.focusRing.style = focusStyleSelect.value;

    document.documentElement.style.setProperty('--focus-ring-color', state.focusRing.color);
    document.documentElement.style.setProperty('--focus-ring-style', state.focusRing.style);
}

// Image to Theme
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            const colors = extractColors(imageData);

            if (colors.length >= 6) {
                // Map extracted colors to state
                // We'll try to map them somewhat intelligently based on brightness
                colors.sort((a, b) => getLuminance(b) - getLuminance(a)); // Lightest to Darkest

                // Assign based on typical usage
                state.colors.background = colors[0]; // Lightest
                state.colors.surface = colors[1];
                state.colors.secondary = colors[2];
                state.colors.primary = colors[3];
                state.colors.accent = colors[4];
                state.colors.text = colors[5]; // Darkest

                updateUI();
                showToast('Theme generated from image!');
            } else {
                showToast('Could not extract enough colors.');
            }
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
}

// Custom Font Upload
async function handleFontUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const fontName = 'CustomFont';
    const reader = new FileReader();

    reader.onload = async (event) => {
        try {
            const fontData = event.target.result;
            const fontFace = new FontFace(fontName, `url(${fontData})`);
            await fontFace.load();
            document.fonts.add(fontFace);

            // Update State
            state.fonts.headingFont = fontName;
            state.fonts.bodyFont = fontName;

            updateUI();
            showToast('Custom font loaded!');
        } catch (err) {
            console.error(err);
            showToast('Error loading font.');
        }
    };
    reader.readAsDataURL(file);
}

function extractColors(data) {
    const colorMap = {};
    for (let i = 0; i < data.length; i += 4 * 100) { // Sample every 100th pixel for performance
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue; // Skip transparent

        const hex = rgbToHex(r, g, b);
        if (!colorMap[hex]) colorMap[hex] = 0;
        colorMap[hex]++;
    }

    // Sort by frequency
    const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);

    // Filter similar colors to get distinct palette
    const distinctColors = [];
    for (const color of sortedColors) {
        if (distinctColors.length >= 6) break;
        let isDistinct = true;
        for (const existing of distinctColors) {
            if (getColorDifference(color, existing) < 50) { // Threshold for difference
                isDistinct = false;
                break;
            }
        }
        if (isDistinct) distinctColors.push(color);
    }

    // Fill if not enough
    while (distinctColors.length < 6) {
        distinctColors.push(getRandomHex());
    }

    return distinctColors;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getColorDifference(hex1, hex2) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    return Math.sqrt(
        Math.pow(rgb1[0] - rgb2[0], 2) +
        Math.pow(rgb1[1] - rgb2[1], 2) +
        Math.pow(rgb1[2] - rgb2[2], 2)
    );
}

// Component Snippets
function setupSnippetInteractions() {
    // Delegate click events on preview frame
    previewFrame.addEventListener('click', (e) => {
        // Find closest interactive element or container
        // For simplicity, let's target specific classes we know exist in our layouts
        const target = e.target.closest('.preview-btn, .preview-card, .product-card, nav, header, footer, .dashboard-sidebar');

        if (target) {
            e.stopPropagation();
            showSnippetModal(target);
        }
    });

    // Add hover effect class
    previewFrame.addEventListener('mouseover', (e) => {
        const target = e.target.closest('.preview-btn, .preview-card, .product-card, nav, header, footer, .dashboard-sidebar');
        if (target) {
            target.classList.add('interactive-element');
        }
    });

    previewFrame.addEventListener('mouseout', (e) => {
        const target = e.target.closest('.interactive-element');
        if (target) {
            target.classList.remove('interactive-element');
        }
    });
}

function showSnippetModal(element) {
    const modal = document.getElementById('snippet-modal');
    const codeArea = document.getElementById('snippet-code');

    // Clone to clean up for display
    const clone = element.cloneNode(true);
    clone.classList.remove('interactive-element');

    // Add ARIA attributes
    if (clone.tagName === 'BUTTON' || clone.classList.contains('preview-btn')) {
        if (!clone.hasAttribute('aria-label')) {
            clone.setAttribute('aria-label', clone.innerText.trim() || 'Button');
        }
    }
    if (clone.tagName === 'NAV') {
        clone.setAttribute('role', 'navigation');
        clone.setAttribute('aria-label', 'Main');
    }
    if (clone.classList.contains('preview-card') || clone.classList.contains('product-card')) {
        clone.setAttribute('role', 'article');
    }
    if (clone.tagName === 'HEADER') {
        clone.setAttribute('role', 'banner');
    }
    if (clone.tagName === 'FOOTER') {
        clone.setAttribute('role', 'contentinfo');
    }
    if (clone.classList.contains('dashboard-sidebar')) {
        clone.setAttribute('role', 'complementary');
        clone.setAttribute('aria-label', 'Sidebar');
    }

    // Get computed styles that are relevant (simplified)
    // In a real app, we might have pre-defined snippets. 
    // Here we will just show the HTML structure.

    let snippet = clone.outerHTML;

    // Prettify simple
    snippet = snippet.replace(/>\s*</g, '>\n<');

    codeArea.value = snippet;
    modal.style.display = 'block';
}

// Modal Logic
const modal = document.getElementById('snippet-modal');
const closeModal = document.querySelector('.close-modal');
const copySnippetBtn = document.getElementById('copy-snippet-btn');

if (closeModal) {
    closeModal.onclick = function () {
        modal.style.display = "none";
    }
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

if (copySnippetBtn) {
    copySnippetBtn.onclick = function () {
        copyToClipboard(document.getElementById('snippet-code').value);
    }
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
    if (shareLinkInput) shareLinkInput.value = window.location.href;
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
function checkContrast(c1, c2) {
    return getContrastRatio(c1, c2);
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

// Text-to-Theme
function generateFromKeyword() {
    const keyword = document.getElementById('magic-keyword').value.toLowerCase();
    if (!keyword) return;

    // Simple mapping logic
    let hue = Math.random() * 360;

    if (['fire', 'red', 'hot', 'love', 'passion'].some(k => keyword.includes(k))) hue = 0; // Red
    else if (['orange', 'sunset', 'autumn'].some(k => keyword.includes(k))) hue = 30; // Orange
    else if (['gold', 'yellow', 'sun', 'happy'].some(k => keyword.includes(k))) hue = 50; // Yellow
    else if (['forest', 'green', 'nature', 'lime'].some(k => keyword.includes(k))) hue = 120; // Green
    else if (['ocean', 'blue', 'sky', 'water', 'tech'].some(k => keyword.includes(k))) hue = 210; // Blue
    else if (['purple', 'royal', 'magic', 'mystery'].some(k => keyword.includes(k))) hue = 270; // Purple
    else if (['pink', 'rose', 'candy'].some(k => keyword.includes(k))) hue = 330; // Pink
    else if (['dark', 'night', 'black'].some(k => keyword.includes(k))) {
        // Special case for dark
        state.colors.background = '#1a1a1a';
        state.colors.surface = '#2d2d2d';
        state.colors.text = '#f0f0f0';
        state.colors.primary = hslToHex(Math.random() * 360, 70, 60);
        state.colors.secondary = hslToHex(Math.random() * 360, 60, 50);
        state.colors.accent = hslToHex(Math.random() * 360, 80, 70);
        updateUI();
        return;
    }

    // Generate monochromatic-ish based on hue
    state.colors.primary = hslToHex(hue, 70, 50);
    state.colors.secondary = hslToHex((hue + 30) % 360, 60, 60);
    state.colors.accent = hslToHex((hue + 180) % 360, 80, 60); // Complementary accent

    // Reset background for non-dark keywords
    state.colors.background = '#ffffff';
    state.colors.surface = '#f5f5f5';
    state.colors.text = '#000000';

    updateUI();
    showToast(`Theme generated for "${keyword}"!`);
}

// PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        try {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        } catch (e) {
            console.warn('ServiceWorker not supported in this context:', e);
        }
    });
}

// Theme Naming Logic
function generateThemeName(colors) {
    const primary = colors.primary;
    const hsl = hexToHsl(primary);
    const h = hsl.h;
    const s = hsl.s;
    const l = hsl.l;

    let hueName = '';
    if (h >= 350 || h < 10) hueName = 'Red';
    else if (h >= 10 && h < 45) hueName = 'Orange';
    else if (h >= 45 && h < 70) hueName = 'Yellow';
    else if (h >= 70 && h < 150) hueName = 'Green';
    else if (h >= 150 && h < 190) hueName = 'Cyan';
    else if (h >= 190 && h < 250) hueName = 'Blue';
    else if (h >= 250 && h < 290) hueName = 'Purple';
    else if (h >= 290 && h < 350) hueName = 'Pink';

    let adj = '';
    if (l < 20) adj = 'Midnight';
    else if (l < 40) adj = 'Deep';
    else if (l > 80) adj = 'Pale';
    else if (s < 20) adj = 'Muted';
    else if (s > 80) adj = 'Vibrant';
    else adj = 'Classic';

    // Random noun for flair
    const nouns = ['Essence', 'Vibe', 'Flow', 'Spark', 'Wave', 'Glow', 'Aura', 'Spirit'];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adj} ${hueName} ${noun}`;
}

function updateThemeName() {
    const name = generateThemeName(state.colors);
    document.getElementById('theme-name').textContent = name;
}

// Fix Contrast Logic
function getContrastFix(bg, text) {
    let ratio = checkContrast(bg, text);
    if (ratio >= 4.5) return text;

    let hsl = hexToHsl(text);
    const bgHsl = hexToHsl(bg);
    const step = bgHsl.l < 50 ? 5 : -5;
    let safety = 0;

    while (ratio < 4.5 && safety < 20) {
        hsl.l += step;
        if (hsl.l < 0) hsl.l = 0;
        if (hsl.l > 100) hsl.l = 100;

        text = hslToHex(hsl.h, hsl.s, hsl.l);
        ratio = checkContrast(bg, text);
        safety++;
    }
    return text;
}

function fixContrast() {
    const bg = state.colors.background;
    const text = state.colors.text;
    const newText = getContrastFix(bg, text);

    if (newText !== text) {
        state.colors.text = newText;
        if (state.baseColors) state.baseColors.text = newText;
        updateUI();
        showToast('Contrast fixed!');
    } else {
        showToast('Contrast is already good or could not be fixed.');
    }
}

// Tour Logic
const tourSteps = [
    { id: 'palette-mode', title: 'Palette Mode', desc: 'Choose a color harmony rule or keep it random.' },
    { id: 'generate-btn', title: 'Generate', desc: 'Click here (or press Space) to create a new theme.' },
    { id: 'color-swatches', title: 'Colors', desc: 'Click the lock icon to keep a color. Use sliders to tweak.' },
    { id: 'vibe-sliders', title: 'Vibe Check', desc: 'Adjust the global saturation and brightness.' },
    { id: 'preview-frame', title: 'Preview', desc: 'See your theme in action. Click elements to get code snippets!' },
    { id: 'export-btn', title: 'Export', desc: 'Download your theme as a Brand Card or copy the code.' }
];

let currentTourStep = 0;

function startTour() {
    currentTourStep = 0;
    document.getElementById('tour-overlay').style.display = 'block';
    showTourStep();
}

function showTourStep() {
    const step = tourSteps[currentTourStep];
    const el = document.getElementById(step.id);

    // Highlight element
    document.querySelectorAll('.tour-highlight').forEach(e => e.classList.remove('tour-highlight'));
    if (el) el.classList.add('tour-highlight');

    // Position box
    const box = document.getElementById('tour-box');
    box.style.display = 'block'; // Fix: Ensure box is visible
    const rect = el ? el.getBoundingClientRect() : { top: 100, left: 100, height: 0 };

    // Simple positioning logic (can be improved)
    let top = rect.top + rect.height + 10;
    let left = rect.left;

    if (top + 200 > window.innerHeight) top = rect.top - 220; // Flip up if too low
    if (left + 300 > window.innerWidth) left = window.innerWidth - 320; // Shift left if too far right

    box.style.top = `${top}px`;
    box.style.left = `${left}px`;

    document.getElementById('tour-title').textContent = step.title;
    document.getElementById('tour-desc').textContent = step.desc;
}

function nextTourStep() {
    currentTourStep++;
    if (currentTourStep >= tourSteps.length) {
        endTour();
    } else {
        showTourStep();
    }
}

function endTour() {
    document.getElementById('tour-overlay').style.display = 'none';
    document.getElementById('tour-box').style.display = 'none'; // Fix: Hide box
    document.querySelectorAll('.tour-highlight').forEach(e => e.classList.remove('tour-highlight'));
}



// === Markdown Spec Sheet Generator ===

function generateMarkdownSpec(type = 'generic') {
    const themeName = state.themeName || 'Custom Theme';
    const date = new Date().toLocaleDateString();

    // Get the selected type from dropdown if not provided
    if (!type || type === 'generic') {
        const specTypeSelect = document.getElementById('spec-type');
        if (specTypeSelect) {
            type = specTypeSelect.value;
        }
    }

    const colorTable = `| Color Role | Hex Code | Usage |
|------------|----------|-------|
| Primary | \`${state.colors.primary}\` | Main brand color, primary buttons, headers |
| Secondary | \`${state.colors.secondary}\` | Secondary actions, accents |
| Accent | \`${state.colors.accent}\` | Highlights, call-to-action elements |
| Background | \`${state.colors.background}\` | Page background |
| Surface | \`${state.colors.surface}\` | Cards, containers, elevated surfaces |
| Text | \`${state.colors.text}\` | Body text, headings |`;

    const typographySection = `**Heading Font:** ${state.fonts.headingFont}
- Usage: All headings (H1-H6), hero text, section titles

**Body Font:** ${state.fonts.bodyFont}
- Usage: Paragraphs, UI labels, navigation, buttons`;

    if (type === 'marketing') {
        return `# Marketing One-Page Website Specification
**Generated by ThemeGen** | ${date}  
**Theme Name:** ${themeName}

---

## 1. Project Overview

**Website Name:** [Your Company/Product Name]

**Tagline:** [Your compelling tagline]

**Primary Goal:** [e.g., Generate leads, Drive sales, Build brand awareness]

**Target Audience:** [Describe your ideal customer]

---

## 2. Design System

### Color Palette
${colorTable}

### Typography
${typographySection}

---

## 3. Page Sections

### Hero Section
**Headline:** [Your powerful headline - max 10 words]

**Subheadline:** [Supporting text - 1-2 sentences]

**CTA Button Text:** [e.g., "Get Started Free", "Request Demo"]

**CTA Action:** [Where does the button lead?]

**Hero Image/Video:** [Description or URL]

**Background Style:** Gradient using Primary → Secondary colors

### Features Section
**Section Title:** [e.g., "Why Choose Us", "Key Features"]

**Feature 1:**
- Icon: [Emoji or icon name]
- Title: [Feature name]
- Description: [1-2 sentences]

**Feature 2:**
- Icon: [Emoji or icon name]
- Title: [Feature name]
- Description: [1-2 sentences]

**Feature 3:**
- Icon: [Emoji or icon name]
- Title: [Feature name]
- Description: [1-2 sentences]

### Social Proof / Testimonials
**Section Title:** [e.g., "What Our Customers Say"]

**Testimonial 1:**
- Quote: [Customer testimonial]
- Author: [Name, Title/Company]

**Testimonial 2:**
- Quote: [Customer testimonial]
- Author: [Name, Title/Company]

### Pricing (Optional)
**Plan 1:**
- Name: [e.g., "Starter"]
- Price: [e.g., "$29/month"]
- Features: [List 3-5 key features]

**Plan 2:**
- Name: [e.g., "Pro"]
- Price: [e.g., "$99/month"]
- Features: [List 3-5 key features]

### Call-to-Action Section
**Headline:** [Final compelling CTA]

**Button Text:** [Action text]

**Supporting Text:** [Optional reassurance text]

### Footer
**Links:**
- About
- Privacy Policy
- Terms of Service
- Contact

**Social Media:** [List platforms and URLs]

**Copyright:** © ${new Date().getFullYear()} [Your Company]

---

## 4. Technical Requirements

**Platform:** [e.g., WordPress, Webflow, Custom HTML/CSS]

**Responsive:** Mobile-first design

**Performance:** Page load < 2 seconds

**Forms:** Email capture integration with [e.g., Mailchimp, ConvertKit]

**Analytics:** Google Analytics 4

---

## 5. Content Checklist

- [ ] Logo (SVG format, transparent background)
- [ ] Hero image/video
- [ ] Feature icons (3)
- [ ] Customer testimonial photos (2-3)
- [ ] Company/product screenshots
- [ ] Social media icons

---

*Customize all bracketed sections with your specific content.*`;

    } else if (type === 'blog') {
        return `# Markdown Blog Specification
**Generated by ThemeGen** | ${date}  
**Theme Name:** ${themeName}

---

## 1. Blog Overview

**Blog Name:** [Your Blog Title]

**Tagline:** [Brief description]

**Primary Topics:** [List 3-5 main categories]

**Target Audience:** [Who are you writing for?]

**Publishing Frequency:** [e.g., 2 posts per week]

---

## 2. Design System

### Color Palette
${colorTable}

**Usage Guidelines:**
- Primary: Article links, category tags
- Secondary: Sidebar elements, related posts
- Accent: Call-out boxes, highlights
- Surface: Code blocks, quote backgrounds

### Typography
${typographySection}

**Reading Experience:**
- Line height: 1.7 for body text
- Max content width: 700px
- Font size: 18px base for optimal readability

---

## 3. Blog Structure

### Homepage
**Layout:** [Grid/List/Magazine style]

**Featured Post:** Large hero card with image

**Recent Posts:** [Number] posts per page

**Sidebar Elements:**
- About the author
- Categories
- Popular posts
- Newsletter signup
- Social media links

### Article Page Template
**Elements:**
- Featured image
- Title (H1)
- Author bio with photo
- Publish date
- Reading time estimate
- Category tags
- Table of contents (for long posts)
- Social sharing buttons
- Related posts (3-4)
- Comments section

### Category Pages
**Display:** Filtered list of posts by category

**Categories to Create:**
- [Category 1]
- [Category 2]
- [Category 3]
- [Category 4]

### About Page
**Content:**
- Author photo
- Bio (2-3 paragraphs)
- Why you started the blog
- Contact information

---

## 4. Markdown Features

**Supported Elements:**
\`\`\`markdown
# Headings (H1-H6)
**Bold** and *italic* text
[Links](url)
![Images](url)
> Blockquotes
- Unordered lists
1. Ordered lists
\`inline code\`
\`\`\`code blocks\`\`\`
Tables
---
\`\`\`

**Custom Components:**
- Call-out boxes (info, warning, tip)
- Code syntax highlighting
- Image galleries
- Embedded videos

---

## 5. Content Strategy

**Post Types:**
1. **How-To Guides:** Step-by-step tutorials
2. **Listicles:** "Top 10" style posts
3. **Opinion Pieces:** Thought leadership
4. **Case Studies:** Real-world examples
5. **News/Updates:** Industry trends

**SEO Requirements:**
- Meta title (max 60 characters)
- Meta description (max 160 characters)
- Alt text for all images
- Internal linking strategy
- Schema markup for articles

---

## 6. Technical Stack

**Static Site Generator:** [e.g., Hugo, Jekyll, Next.js]

**Hosting:** [e.g., Netlify, Vercel, GitHub Pages]

**CMS:** [e.g., Markdown files, Contentful, Sanity]

**Search:** [Algolia, Lunr.js, or built-in]

**Comments:** [Disqus, Commento, or custom]

**Newsletter:** [ConvertKit, Mailchimp integration]

---

## 7. Launch Checklist

- [ ] 5-10 initial posts written
- [ ] About page complete
- [ ] RSS feed configured
- [ ] Social media accounts created
- [ ] Newsletter signup form tested
- [ ] Mobile responsiveness verified
- [ ] Page speed optimized (90+ Lighthouse score)
- [ ] Analytics installed

---

*Fill in all bracketed sections and start writing!*`;

    } else if (type === 'linktree') {
        return `# Mobile Link Page Specification (Link-in-Bio)
**Generated by ThemeGen** | ${date}  
**Theme Name:** ${themeName}

---

## 1. Page Overview

**Profile Name:** [Your Name / Brand]

**Bio:** [One-line description - max 100 characters]

**Profile Picture:** [URL or description]

**Background:** [Solid color, gradient, or image]

---

## 2. Design System

### Color Palette
${colorTable}

**Visual Style:**
- Background: ${state.colors.background} or gradient (Primary → Secondary)
- Link buttons: ${state.colors.surface} with ${state.colors.primary} accent
- Text: ${state.colors.text}
- Hover effects: ${state.colors.accent}

### Typography
${typographySection}

**Button Style:**
- Border radius: 12px (rounded)
- Padding: 16px 24px
- Font weight: 600
- Shadow: Subtle drop shadow

---

## 3. Links Configuration

### Link 1
**Title:** [e.g., "Latest YouTube Video"]

**URL:** [https://...]

**Icon:** [Optional emoji or icon]

**Style:** Primary button

### Link 2
**Title:** [e.g., "Shop My Store"]

**URL:** [https://...]

**Icon:** [Optional emoji or icon]

**Style:** Primary button

### Link 3
**Title:** [e.g., "Read My Blog"]

**URL:** [https://...]

**Icon:** [Optional emoji or icon]

**Style:** Primary button

### Link 4
**Title:** [e.g., "Book a Call"]

**URL:** [https://...]

**Icon:** [Optional emoji or icon]

**Style:** Accent button (highlighted)

### Link 5
**Title:** [e.g., "Free Resource"]

**URL:** [https://...]

**Icon:** [Optional emoji or icon]

**Style:** Primary button

**[Add more links as needed]**

---

## 4. Social Media Icons

**Platforms to Include:**
- [ ] Instagram: [URL]
- [ ] Twitter/X: [URL]
- [ ] TikTok: [URL]
- [ ] YouTube: [URL]
- [ ] LinkedIn: [URL]
- [ ] Facebook: [URL]
- [ ] Email: [address]

**Icon Style:** Circular, ${state.colors.accent} background, white icons

---

## 5. Features

**Analytics:**
- Track link clicks
- View count
- Traffic sources

**Customization:**
- Custom domain: [yourdomain.com]
- Favicon
- Open Graph image for social sharing

**Optional Elements:**
- Newsletter signup form
- Embedded video
- Image gallery
- Music player widget
- Countdown timer for launches

---

## 6. Mobile Optimization

**Viewport:** Optimized for 375px - 428px width

**Touch Targets:** Minimum 44px height for easy tapping

**Loading:** Under 1 second load time

**Animations:** Subtle fade-in on scroll

---

## 7. Platform Options

**DIY Solutions:**
- Custom HTML/CSS (full control)
- Carrd
- Bio.link

**Hosted Platforms:**
- Linktree
- Beacons
- Tap.bio
- Koji

---

## 8. Content Strategy

**Update Frequency:** Weekly or when launching new content

**Link Priority:** Most important links at the top

**Call-to-Action:** Clear, action-oriented button text

**Seasonal Updates:** Rotate links for campaigns/launches

---

## 9. Launch Checklist

- [ ] Profile picture uploaded (400x400px minimum)
- [ ] Bio written and proofread
- [ ] All links tested and working
- [ ] Social icons linked correctly
- [ ] Mobile preview checked
- [ ] Analytics configured
- [ ] Custom domain connected (if applicable)
- [ ] Shared on all social media profiles

---

*Update your links regularly to keep your audience engaged!*`;

    } else if (type === 'portfolio') {
        return `# Portfolio Website Specification
**Generated by ThemeGen** | ${date}  
**Theme Name:** ${themeName}

---

## 1. Portfolio Overview

**Your Name:** [Full Name]

**Professional Title:** [e.g., "Full-Stack Developer", "UX Designer", "Photographer"]

**Tagline:** [One compelling sentence about what you do]

**Location:** [City, Country or "Remote"]

---

## 2. Design System

### Color Palette
${colorTable}

**Design Approach:**
- Minimalist and clean
- Focus on showcasing work
- Professional yet personal
- Strong visual hierarchy

### Typography
${typographySection}

---

## 3. Page Structure

### Homepage / Hero
**Hero Section:**
- Large heading with your name
- Professional title
- Brief intro (2-3 sentences)
- CTA button: "View My Work" or "Get in Touch"
- Professional photo or avatar

**Featured Projects:** 3-4 best projects in grid layout

**Skills Overview:** Visual representation of key skills

**Quick Stats (Optional):**
- Years of experience
- Projects completed
- Happy clients
- Awards won

### About Page
**Content:**
- Professional photo
- Detailed bio (3-4 paragraphs)
- Career journey
- Skills & expertise
- Education & certifications
- Personal interests (optional)
- Downloadable resume/CV

**Skills Section:**
\`\`\`
Technical Skills:
- [Skill 1] - [Proficiency level]
- [Skill 2] - [Proficiency level]
- [Skill 3] - [Proficiency level]

Tools & Technologies:
- [Tool 1], [Tool 2], [Tool 3]
\`\`\`

### Portfolio/Work Page
**Project 1:**
- Project name
- Client/Company (if applicable)
- Role
- Technologies used
- Challenge/Problem
- Solution/Approach
- Results/Impact
- Images/Screenshots (3-5)
- Live demo link
- GitHub repo (if applicable)

**Project 2:**
[Same structure as Project 1]

**Project 3:**
[Same structure as Project 1]

**[Add 5-10 total projects]**

**Project Categories:**
- [Category 1: e.g., Web Development]
- [Category 2: e.g., Mobile Apps]
- [Category 3: e.g., Design]

### Services Page (Optional)
**Service 1:**
- Name
- Description
- What's included
- Typical timeline
- Starting price (optional)

**Service 2:**
[Same structure]

**Service 3:**
[Same structure]

### Contact Page
**Contact Form:**
- Name
- Email
- Subject
- Message
- Submit button

**Alternative Contact Methods:**
- Email: [your@email.com]
- Phone: [Optional]
- LinkedIn: [URL]
- Location: [City/Remote]

**Availability:**
- Current status: [Available for hire / Fully booked / Open to opportunities]
- Response time: [e.g., "Within 24 hours"]

---

## 4. Components

**Navigation:**
- Logo/Name
- Home
- About
- Portfolio/Work
- Services (optional)
- Blog (optional)
- Contact

**Footer:**
- Social media links
- Email
- Copyright
- "Back to top" button

**Project Cards:**
- Thumbnail image
- Project title
- Brief description (1 sentence)
- Tags/technologies
- Hover effect revealing "View Project"

---

## 5. Content Requirements

**Images Needed:**
- Professional headshot (high resolution)
- Project screenshots (3-5 per project)
- Process photos (optional)
- Behind-the-scenes (optional)

**Written Content:**
- Bio (short and long versions)
- Project case studies
- Service descriptions
- Testimonials (3-5)

**Testimonials Format:**
\`\`\`
"[Testimonial quote]"
- [Client Name], [Title] at [Company]
\`\`\`

---

## 6. Technical Requirements

**Performance:**
- Lighthouse score: 90+
- Image optimization: WebP format
- Lazy loading for images
- Smooth page transitions

**SEO:**
- Meta tags for all pages
- Open Graph images
- Structured data (Person schema)
- XML sitemap

**Responsive Design:**
- Mobile-first approach
- Breakpoints: 375px, 768px, 1024px, 1440px
- Touch-friendly navigation

**Hosting:**
- [Platform: e.g., Vercel, Netlify, GitHub Pages]
- Custom domain
- SSL certificate
- CDN for global performance

---

## 7. Optional Features

- [ ] Blog section for articles/thoughts
- [ ] Dark mode toggle
- [ ] Animations (subtle, not distracting)
- [ ] Filterable portfolio grid
- [ ] Client logo showcase
- [ ] Awards & recognition section
- [ ] Speaking engagements
- [ ] Newsletter signup

---

## 8. Launch Checklist

- [ ] All projects documented with case studies
- [ ] Professional photos taken
- [ ] Resume/CV updated and downloadable
- [ ] Contact form tested
- [ ] All links working
- [ ] Mobile responsiveness verified
- [ ] Page speed optimized
- [ ] SEO metadata complete
- [ ] Analytics installed
- [ ] Shared on LinkedIn and social media

---

*Your portfolio is your digital handshake - make it count!*`;

    } else {
        // Generic template (original)
        return `# Website Specification Sheet
**Generated by ThemeGen** | ${date}  
**Theme Name:** ${themeName}

---

## 1. Project Overview

**Project Name:** [Enter your project name]

**Description:** [Brief description of the website purpose and goals]

**Target Audience:** [Describe your target users]

**Key Objectives:**
- [Objective 1]
- [Objective 2]
- [Objective 3]

---

## 2. Design System

### Color Palette
${colorTable}

**Color Usage Guidelines:**
- Use Primary color for main CTAs and navigation highlights
- Use Secondary color for supporting elements
- Use Accent color sparingly for important highlights
- Maintain WCAG AA contrast ratios (minimum 4.5:1 for text)

### Typography
${typographySection}

**Type Scale:** ${state.typeScale || '1.25 (Major Third)'}

**Font Sizes:**
\`\`\`css
--text-xs: 0.64rem;
--text-sm: 0.8rem;
--text-base: 1rem;
--text-lg: 1.25rem;
--text-xl: 1.563rem;
--text-2xl: 1.953rem;
--text-3xl: 2.441rem;
--text-4xl: 3.052rem;
\`\`\`

---

## 3. Pages & Layouts

### Homepage
**Purpose:** [Describe homepage purpose]

**Sections:**
1. **Hero Section**
   - Headline: [Your main headline]
   - Subheadline: [Supporting text]
   - CTA: [Button text and action]
   - Visual: [Image/video description]

2. **Features Section**
   - Feature 1: [Title and description]
   - Feature 2: [Title and description]
   - Feature 3: [Title and description]

3. **[Additional sections...]**

### 3.2 [Other Pages]
**Page Name:** [e.g., About, Services, Contact]
- Purpose: [Page purpose]
- Key Content: [Main content elements]
- CTAs: [Call-to-action buttons]

---

## 4. Components

### 4.1 Navigation
- **Type:** [Horizontal/Vertical/Hamburger]
- **Items:** [List navigation items]
- **Behavior:** [Sticky/Fixed/Static]
- **Mobile:** [Describe mobile navigation]

### 4.2 Buttons
**Primary Button:**
- Background: ${state.colors.primary}
- Text: White
- Hover: [Describe hover effect]
- Usage: Main CTAs

**Secondary Button:**
- Background: ${state.colors.secondary}
- Text: ${state.colors.text}
- Hover: [Describe hover effect]
- Usage: Secondary actions

### 4.3 Cards
- Background: ${state.colors.surface}
- Border: [Specify border style]
- Shadow: [Specify shadow]
- Padding: [Specify padding]
- Border Radius: [Specify radius]

### 4.4 Forms
**Input Fields:**
- Border: ${state.colors.accent}
- Focus State: [Describe focus styling]
- Error State: [Describe error styling]
- Placeholder: [Specify placeholder color]

**Form Validation:**
- [Describe validation requirements]

### 4.5 [Additional Components]
- Modals
- Alerts/Notifications
- Badges
- Tables
- [Add more as needed]

---

## 5. Content Requirements

### 5.1 Text Content
**Homepage:**
- Hero Headline: [Your headline here]
- Hero Subtext: [Your subtext here]
- Feature 1 Title: [Title]
- Feature 1 Description: [Description]
- [Continue for all sections...]

### 5.2 Images & Media
**Required Images:**
1. Hero Image: [Dimensions, description]
2. Feature Icons: [Quantity, style, dimensions]
3. Team Photos: [Quantity, dimensions]
4. [Additional images...]

**Image Guidelines:**
- Format: [JPG/PNG/WebP]
- Optimization: [Max file size]
- Alt Text: [Requirements for accessibility]

### 5.3 Icons
- **Icon Set:** [Specify icon library or custom]
- **Style:** [Outline/Filled/Duotone]
- **Size:** [Standard sizes]

---

## 6. Functionality & Features

### 6.1 Core Features
- [ ] [Feature 1 description]
- [ ] [Feature 2 description]
- [ ] [Feature 3 description]

### 6.2 Forms & Interactions
**Contact Form:**
- Fields: [Name, Email, Message, etc.]
- Validation: [Required fields, format validation]
- Submission: [Where does data go?]
- Success Message: [What happens after submission?]

**Newsletter Signup:**
- Fields: [Email]
- Integration: [Email service provider]

### 6.3 Third-Party Integrations
- [ ] Analytics: [Google Analytics, etc.]
- [ ] Email: [Mailchimp, etc.]
- [ ] Social Media: [Links, sharing buttons]
- [ ] [Other integrations...]

---

## 7. Technical Requirements

### 7.1 Performance
- Page Load Time: [Target: < 3 seconds]
- Mobile Performance: [Target Lighthouse score]
- Image Optimization: [WebP, lazy loading]

### 7.2 Responsive Design
**Breakpoints:**
\`\`\`css
Mobile: 320px - 767px
Tablet: 768px - 1023px
Desktop: 1024px+
\`\`\`

**Mobile-First Approach:** [Yes/No]

### 7.3 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- [Mobile browsers...]

### 7.4 Accessibility
- WCAG Level: [AA/AAA]
- Screen Reader Support: [Yes]
- Keyboard Navigation: [Yes]
- Focus Indicators: [Visible and clear]
- Alt Text: [Required for all images]

### 7.5 SEO Requirements
- Meta Titles: [Max 60 characters]
- Meta Descriptions: [Max 160 characters]
- Open Graph Tags: [For social sharing]
- Structured Data: [Schema.org markup]
- Sitemap: [XML sitemap]

---

## 8. Deployment & Hosting

**Hosting Platform:** [e.g., Vercel, Netlify, AWS]

**Domain:** [Your domain name]

**SSL Certificate:** [Required]

**Deployment Process:** [Describe deployment workflow]

---

## 9. Timeline & Milestones

| Phase | Deliverable | Timeline |
|-------|-------------|----------|
| Design | Mockups & Prototypes | [Date range] |
| Development | Frontend Build | [Date range] |
| Content | Content Creation | [Date range] |
| Testing | QA & Bug Fixes | [Date range] |
| Launch | Go Live | [Target date] |

---

## 10. Success Metrics

**Key Performance Indicators:**
- [ ] [Metric 1: e.g., Conversion rate > 3%]
- [ ] [Metric 2: e.g., Bounce rate < 40%]
- [ ] [Metric 3: e.g., Page load time < 2s]
- [ ] [Metric 4: e.g., Mobile traffic > 50%]

---

## 11. Additional Notes

[Add any additional requirements, constraints, or special considerations here]

---

**Next Steps:**
1. Review and fill in all placeholder sections
2. Share with development team
3. Create detailed wireframes/mockups
4. Begin development with approved spec

---

*This specification sheet was generated using ThemeGen. Customize all placeholder sections to match your specific project requirements.*
`;
    }
}

function showSpecModal() {
    const modal = document.getElementById('spec-modal');
    const output = document.getElementById('spec-output');
    const specTypeSelect = document.getElementById('spec-type');

    if (!modal || !output) return;

    // Generate spec based on selected type
    const type = specTypeSelect ? specTypeSelect.value : 'generic';
    const spec = generateMarkdownSpec(type);
    output.value = spec;
    modal.style.display = 'block';

    // Add event listener for type change
    if (specTypeSelect) {
        specTypeSelect.onchange = function () {
            const newSpec = generateMarkdownSpec(this.value);
            output.value = newSpec;
        };
    }

    // Add event listeners for modal close
    const closeBtn = document.getElementById('close-spec-modal');
    if (closeBtn) {
        closeBtn.onclick = closeSpecModal;
    }

    // Close on outside click
    modal.onclick = function (event) {
        if (event.target === modal) {
            closeSpecModal();
        }
    };

    // Close on ESC key
    document.addEventListener('keydown', handleSpecModalEscape);
}

function closeSpecModal() {
    const modal = document.getElementById('spec-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.removeEventListener('keydown', handleSpecModalEscape);
}

function handleSpecModalEscape(e) {
    if (e.key === 'Escape') {
        closeSpecModal();
    }
}

function copySpecSheet() {
    const output = document.getElementById('spec-output');
    if (output) {
        copyToClipboard(output.value);
    }
}

function downloadSpecSheet() {
    const output = document.getElementById('spec-output');
    if (!output) return;

    const spec = output.value;
    const blob = new Blob([spec], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'spec-sheet.md';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Spec sheet downloaded!');
}


// Global Error Handler for debugging
window.onerror = function (msg, url, line, col, error) {
    // alert(`Error: ${msg}\nLine: ${line}`); // Uncomment if needed for user feedback
    console.error('Global Error:', msg, error);
};

// Start
if (typeof module === 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        hexToHsl,
        checkContrast,
        generateThemeName,
        getContrastFix,
        updateOutputs,
        downloadBrandCard,
        updateUI,
        generateMarkdownSpec,
        state
    };
}

