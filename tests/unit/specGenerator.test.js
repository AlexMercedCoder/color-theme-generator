const { generateMarkdownSpec, state } = require('../../script.js');

describe('Markdown Spec Sheet Generator', () => {
    beforeEach(() => {
        // Set up a test theme
        state.colors = {
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            accent: '#f59e0b',
            background: '#ffffff',
            surface: '#f3f4f6',
            text: '#1f2937'
        };
        state.fonts = {
            headingFont: 'Poppins',
            bodyFont: 'Inter'
        };
        state.themeName = 'Test Theme';
    });

    test('generateMarkdownSpec returns a string', () => {
        const spec = generateMarkdownSpec();
        expect(typeof spec).toBe('string');
        expect(spec.length).toBeGreaterThan(0);
    });

    test('spec includes all color values', () => {
        const spec = generateMarkdownSpec();
        expect(spec).toContain(state.colors.primary);
        expect(spec).toContain(state.colors.secondary);
        expect(spec).toContain(state.colors.accent);
        expect(spec).toContain(state.colors.background);
        expect(spec).toContain(state.colors.surface);
        expect(spec).toContain(state.colors.text);
    });

    test('spec includes font names', () => {
        const spec = generateMarkdownSpec();
        expect(spec).toContain(state.fonts.headingFont);
        expect(spec).toContain(state.fonts.bodyFont);
    });

    test('spec includes theme name', () => {
        const spec = generateMarkdownSpec();
        expect(spec).toContain('Test Theme');
    });

    test('spec includes placeholder sections', () => {
        const spec = generateMarkdownSpec();
        expect(spec).toContain('[Enter your project name]');
        expect(spec).toContain('## 1. Project Overview');
        expect(spec).toContain('## 2. Design System');
        expect(spec).toContain('## 3. Pages & Layouts');
        expect(spec).toContain('## 4. Components');
        expect(spec).toContain('## 5. Content Requirements');
        expect(spec).toContain('## 6. Functionality & Features');
        expect(spec).toContain('## 7. Technical Requirements');
        expect(spec).toContain('## 8. Deployment & Hosting');
        expect(spec).toContain('## 9. Timeline & Milestones');
        expect(spec).toContain('## 10. Success Metrics');
    });

    test('spec is valid markdown format', () => {
        const spec = generateMarkdownSpec();
        // Check for markdown headers
        expect(spec).toMatch(/^#\s/m);
        expect(spec).toMatch(/^##\s/m);
        // Check for markdown table
        expect(spec).toMatch(/\|.*\|.*\|/);
        // Check for code blocks
        expect(spec).toContain('```css');
    });

    test('spec includes color usage guidelines', () => {
        const spec = generateMarkdownSpec();
        expect(spec).toContain('Color Usage Guidelines');
        expect(spec).toContain('WCAG AA contrast ratios');
    });

    test('spec includes typography scale', () => {
        const spec = generateMarkdownSpec();
        expect(spec).toContain('Type Scale');
        expect(spec).toContain('--text-base');
        expect(spec).toContain('--text-4xl');
    });
});
