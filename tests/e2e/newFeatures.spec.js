const { test, expect } = require('@playwright/test');

test.describe('New Features: Preview Layouts and Spec Sheet', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`file://${__dirname}/../../index.html`);
    });

    test('should switch to Components Gallery layout', async ({ page }) => {
        await page.selectOption('#preview-layout', 'components');

        // Verify components gallery content is visible
        await expect(page.locator('.component-showcase').first()).toBeVisible();
        await expect(page.locator('text=Buttons')).toBeVisible();
        await expect(page.locator('text=Alerts')).toBeVisible();
        await expect(page.locator('text=Badges')).toBeVisible();
    });

    test('should switch to Admin Panel layout', async ({ page }) => {
        await page.selectOption('#preview-layout', 'admin');

        // Verify admin panel content is visible
        await expect(page.locator('.admin-sidebar')).toBeVisible();
        await expect(page.locator('.data-table')).toBeVisible();
        await expect(page.locator('.stat-card').first()).toBeVisible();
    });

    test('should switch to Marketing Page layout', async ({ page }) => {
        await page.selectOption('#preview-layout', 'marketing');

        // Verify marketing page content is visible
        await expect(page.locator('.marketing-hero')).toBeVisible();
        await expect(page.locator('.feature-grid')).toBeVisible();
        await expect(page.locator('.testimonials')).toBeVisible();
    });

    test('should switch to App Interface layout', async ({ page }) => {
        await page.selectOption('#preview-layout', 'app');

        // Verify app interface content is visible
        await expect(page.locator('.app-header')).toBeVisible();
        await expect(page.locator('.app-sidebar')).toBeVisible();
        await expect(page.locator('.app-content')).toBeVisible();
    });

    test('should open spec sheet modal', async ({ page }) => {
        await page.click('#generate-spec-btn');

        // Verify modal is visible
        await expect(page.locator('#spec-modal')).toBeVisible();
        await expect(page.locator('#spec-output')).toBeVisible();

        // Verify spec content is generated
        const specContent = await page.inputValue('#spec-output');
        expect(specContent).toContain('Website Specification Sheet');
        expect(specContent).toContain('Design System');
        expect(specContent).toContain('Color Palette');
    });

    test('should copy spec sheet content', async ({ page }) => {
        await page.click('#generate-spec-btn');

        // Click copy button
        await page.click('#copy-spec-btn');

        // Verify toast notification appears
        await expect(page.locator('.toast')).toBeVisible();
        await expect(page.locator('text=Copied to clipboard!')).toBeVisible();
    });

    test('should download spec sheet file', async ({ page }) => {
        await page.click('#generate-spec-btn');

        // Set up download listener
        const downloadPromise = page.waitForEvent('download');
        await page.click('#download-spec-btn');
        const download = await downloadPromise;

        // Verify download filename
        expect(download.suggestedFilename()).toBe('spec-sheet.md');
    });

    test('should close spec modal with close button', async ({ page }) => {
        await page.click('#generate-spec-btn');
        await expect(page.locator('#spec-modal')).toBeVisible();

        // Click close button
        await page.click('#close-spec-modal');

        // Verify modal is hidden
        await expect(page.locator('#spec-modal')).not.toBeVisible();
    });

    test('should close spec modal with ESC key', async ({ page }) => {
        await page.click('#generate-spec-btn');
        await expect(page.locator('#spec-modal')).toBeVisible();

        // Press ESC key
        await page.keyboard.press('Escape');

        // Verify modal is hidden
        await expect(page.locator('#spec-modal')).not.toBeVisible();
    });

    test('should close spec modal by clicking outside', async ({ page }) => {
        await page.click('#generate-spec-btn');
        await expect(page.locator('#spec-modal')).toBeVisible();

        // Click on modal overlay (outside content)
        await page.locator('#spec-modal').click({ position: { x: 10, y: 10 } });

        // Verify modal is hidden
        await expect(page.locator('#spec-modal')).not.toBeVisible();
    });

    test('all new layouts should apply theme colors', async ({ page }) => {
        const layouts = ['components', 'admin', 'marketing', 'app'];

        for (const layout of layouts) {
            await page.selectOption('#preview-layout', layout);

            // Wait for layout to render
            await page.waitForTimeout(100);

            // Verify preview frame has the correct class
            const previewFrame = page.locator('#preview-frame');
            await expect(previewFrame).toHaveClass(new RegExp(`layout-${layout}`));
        }
    });
});
