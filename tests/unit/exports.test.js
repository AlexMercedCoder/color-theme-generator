const { updateOutputs, state } = require('../../script.js');

describe('Export Features', () => {
    let mockOutput;

    beforeEach(() => {
        // Mock DOM elements
        mockOutput = { value: '' };
        document.getElementById = jest.fn((id) => {
            if (id === 'code-output') return mockOutput;
            if (id === 'prompt-output') return { value: '' };
            if (id === 'gradient-output') return { value: '' };
            if (id === 'gradient-preview') return { style: {} };
            if (id === 'share-link') return { value: '' };
            return { value: '', style: {} };
        });

        // Setup State
        state.colors = {
            primary: '#ff0000',
            secondary: '#00ff00',
            background: '#ffffff',
            text: '#000000'
        };
        state.fonts = {
            headingFont: 'Roboto',
            bodyFont: 'Open Sans'
        };
        
        // Mock global functions called by updateOutputs
        global.updateGradient = jest.fn();
        global.updateHash = jest.fn();
    });

    test('should generate Figma tokens', () => {
        state.activeTab = 'figma';
        updateOutputs();
        
        const output = JSON.parse(mockOutput.value);
        expect(output.primary).toEqual({ value: '#ff0000', type: 'color' });
        expect(output['font-heading']).toEqual({ value: 'Roboto', type: 'fontFamilies' });
    });

    test('should generate React theme', () => {
        state.activeTab = 'react';
        updateOutputs();
        
        const output = mockOutput.value;
        expect(output).toContain('export const theme = {');
        expect(output).toContain('"primary": "#ff0000"');
        expect(output).toContain('"heading": "Roboto"');
    });
});
