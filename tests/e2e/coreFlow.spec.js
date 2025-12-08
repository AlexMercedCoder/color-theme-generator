const { test, expect } = require('@playwright/test');

test.describe('Theme Generator Core Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the local file
    await page.goto('file:///home/alexmerced/development/personal/Personal/2026/colortheme/index.html');
  });

  test('should generate a new theme', async ({ page }) => {
    // Get initial primary color
    const initialColor = await page.locator('.swatch input[type="color"]').first().inputValue();
    
    // Click generate button
    await page.click('#generate-btn');
    
    // Get new primary color
    // Verify colors changed (wait for transition)
    await expect(page.locator('.swatch input[type="color"]').first()).not.toHaveValue(initialColor);
  });

  test('should save a theme', async ({ page }) => {
    // Click save button
    await page.click('#save-theme-btn');
    
    // Verify it appears in the saved list
    const savedItem = page.locator('.saved-theme-item').first();
    await expect(savedItem).toBeVisible();
  });

  test('should switch tabs', async ({ page }) => {
    // Click CSS tab
    await page.click('button[data-tab="css"]');
    
    // Verify output contains CSS variables
    const output = await page.inputValue('#code-output');
    expect(output).toContain(':root {');
    expect(output).toContain('--primary:');
  });

  test('should toggle dark mode', async ({ page }) => {
    // Click dark mode toggle
    await page.click('#theme-toggle');
    
    // Verify body has dark-mode class
    await expect(page.locator('body')).toHaveClass(/dark-mode/);
  });
  
  test('should open and close zen mode', async ({ page }) => {
    // Click zen mode button
    await page.click('#zen-mode-btn');
    
    // Verify body has zen-mode class
    await expect(page.locator('body')).toHaveClass(/zen-mode/);
    
    // Click exit button
    await page.click('#exit-zen-btn');
    
    // Verify body does not have zen-mode class
    await expect(page.locator('body')).not.toHaveClass(/zen-mode/);
  });
});
