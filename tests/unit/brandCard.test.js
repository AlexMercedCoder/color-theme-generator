const { downloadBrandCard, state } = require('../../script.js');

describe('Brand Card Export', () => {
    let mockCanvas, mockCtx, mockLink;

    beforeEach(() => {
        // Mock Canvas
        mockCtx = {
            fillStyle: '',
            fillRect: jest.fn(),
            fillText: jest.fn(),
            font: '',
            textAlign: '',
            globalAlpha: 1
        };
        mockCanvas = {
            width: 0,
            height: 0,
            getContext: jest.fn(() => mockCtx),
            toDataURL: jest.fn(() => 'data:image/png;base64,')
        };
        
        // Mock Link
        mockLink = {
            download: '',
            href: '',
            click: jest.fn()
        };

        // Mock DOM
        document.createElement = jest.fn((tag) => {
            if (tag === 'canvas') return mockCanvas;
            if (tag === 'a') return mockLink;
            return {};
        });
        
        document.getElementById = jest.fn((id) => {
            if (id === 'brand-card-size') return global.brandCardSizeSelect;
            return null;
        });

        // Mock Global Select
        global.brandCardSizeSelect = { value: 'standard' };

        // Setup State
        state.colors = {
            background: '#ffffff',
            text: '#000000',
            primary: '#ff0000'
        };
        state.fonts = {
            headingFont: 'Roboto',
            bodyFont: 'Open Sans'
        };
    });

    test('should generate standard size by default', () => {
        global.brandCardSizeSelect.value = 'standard';
        downloadBrandCard();
        expect(mockCanvas.width).toBe(800);
        expect(mockCanvas.height).toBe(600);
        expect(mockLink.download).toBe('brand-card-standard.png');
    });

    test('should generate story size', () => {
        global.brandCardSizeSelect.value = 'story';
        downloadBrandCard();
        expect(mockCanvas.width).toBe(1080);
        expect(mockCanvas.height).toBe(1920);
        expect(mockLink.download).toBe('brand-card-story.png');
    });

    test('should generate post size', () => {
        global.brandCardSizeSelect.value = 'post';
        downloadBrandCard();
        expect(mockCanvas.width).toBe(1080);
        expect(mockCanvas.height).toBe(1080);
        expect(mockLink.download).toBe('brand-card-post.png');
    });
});
