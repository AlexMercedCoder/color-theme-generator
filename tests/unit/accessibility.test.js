const { getContrastFix, checkContrast, hexToHsl, state } = require('../../script.js');

describe('Accessibility Features', () => {
    beforeEach(() => {
        // Reset state
        state.colors = {
            background: '#ffffff',
            text: '#000000'
        };
    });

    test('getContrastFix should improve low contrast', () => {
        // Set low contrast (light gray on white)
        const bg = '#ffffff';
        const text = '#eeeeee'; 
        
        const initialRatio = checkContrast(bg, text);
        expect(initialRatio).toBeLessThan(4.5);

        const newText = getContrastFix(bg, text);

        const newRatio = checkContrast(bg, newText);
        expect(newRatio).toBeGreaterThanOrEqual(4.5);
        expect(newText).not.toBe(text);
    });

    test('getContrastFix should return original color if contrast is already good', () => {
        const bg = '#ffffff';
        const text = '#000000';
        
        const newText = getContrastFix(bg, text);
        
        expect(newText).toBe(text);
    });
});
