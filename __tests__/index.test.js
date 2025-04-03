"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../src/config");
describe('patternToRegex', () => {
    test('converts wildcard patterns to regex correctly', () => {
        expect((0, config_1.patternToRegex)('*bug*').test('fix: bug in login')).toBe(true);
        expect((0, config_1.patternToRegex)('fix: *').test('fix: updated button style')).toBe(true);
        expect((0, config_1.patternToRegex)('fix: *').test('feat: add new feature')).toBe(false);
        expect((0, config_1.patternToRegex)('*[WIP]*').test('[WIP]: initial commit')).toBe(true);
        expect((0, config_1.patternToRegex)('*WIP*').test('WIP: initial commit')).toBe(true);
    });
});
describe('getLabelsForTitle', () => {
    test('returns correct labels based on PR title and config', () => {
        const config = {
            'bug': ['*bug*', 'fix: *'],
            'feature': ['feat: *', '*feature*'],
            'documentation': ['docs: *', '*documentation*']
        };
        expect((0, config_1.getLabelsForTitle)('fix: login bug', config)).toContain('bug');
        expect((0, config_1.getLabelsForTitle)('feat: add new login feature', config)).toEqual(['feature']);
        expect((0, config_1.getLabelsForTitle)('docs: update readme', config)).toEqual(['documentation']);
        expect((0, config_1.getLabelsForTitle)('chore: update dependencies', config)).toEqual([]);
    });
    test('handles case-insensitive matching', () => {
        const config = {
            'bug': ['*BUG*'],
            'feature': ['FEAT: *']
        };
        expect((0, config_1.getLabelsForTitle)('fix: login bug', config)).toContain('bug');
        expect((0, config_1.getLabelsForTitle)('feat: new feature', config)).toContain('feature');
    });
});
describe('getDefaultConfig', () => {
    test('returns a non-empty configuration', () => {
        const config = (0, config_1.getDefaultConfig)();
        expect(Object.keys(config).length).toBeGreaterThan(0);
    });
    test('includes common label categories', () => {
        const config = (0, config_1.getDefaultConfig)();
        expect(config).toHaveProperty('bug');
        expect(config).toHaveProperty('enhancement');
        expect(config).toHaveProperty('documentation');
    });
});
//# sourceMappingURL=index.test.js.map