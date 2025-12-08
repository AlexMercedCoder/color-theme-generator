const { hexToHsl, checkContrast, generateThemeName } = require('../../script.js');

describe('Color Logic', () => {
    test('hexToHsl converts hex to HSL object', () => {
        const result = hexToHsl('#ff0000');
        expect(result).toEqual({ h: 0, s: 100, l: 50 });
        
        const result2 = hexToHsl('#00ff00');
        expect(result2).toEqual({ h: 120, s: 100, l: 50 });
        
        const result3 = hexToHsl('#0000ff');
        expect(result3).toEqual({ h: 240, s: 100, l: 50 });
    });

    test('checkContrast calculates ratio correctly', () => {
        const ratio = checkContrast('#000000', '#ffffff');
        expect(ratio).toBeCloseTo(21, 1);
        
        const ratio2 = checkContrast('#ffffff', '#ffffff');
        expect(ratio2).toBeCloseTo(1, 1);
        
        const ratio3 = checkContrast('#ff0000', '#ffffff');
        expect(ratio3).toBeGreaterThan(1);
        expect(ratio3).toBeLessThan(21);
    });

    test('generateThemeName returns a string', () => {
        const name = generateThemeName({ primary: '#ff0000', secondary: '#00ff00' });
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
    });
});
