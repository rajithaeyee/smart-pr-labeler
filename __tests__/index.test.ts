import { getLabelsForTitle, getDefaultConfig, patternToRegex } from '../src/config';

describe('patternToRegex', () => {
  test('converts wildcard patterns to regex correctly', () => {
    expect(patternToRegex('*bug*').test('fix: bug in login')).toBe(true);
    expect(patternToRegex('fix: *').test('fix: updated button style')).toBe(true);
    expect(patternToRegex('fix: *').test('feat: add new feature')).toBe(false);
    expect(patternToRegex('*[WIP]*').test('[WIP]: initial commit')).toBe(true);
    expect(patternToRegex('*WIP*').test('WIP: initial commit')).toBe(true);
  });
});

describe('getLabelsForTitle', () => {
  test('returns correct labels based on PR title and config', () => {
    const config = {
      'bug': ['*bug*', 'fix: *'],
      'feature': ['feat: *', '*feature*'],
      'documentation': ['docs: *', '*documentation*']
    };
    
    expect(getLabelsForTitle('fix: login bug', config)).toContain('bug');
    expect(getLabelsForTitle('feat: add new login feature', config)).toEqual(['feature']);
    expect(getLabelsForTitle('docs: update readme', config)).toEqual(['documentation']);
    expect(getLabelsForTitle('chore: update dependencies', config)).toEqual([]);
  });
  
  test('handles case-insensitive matching', () => {
    const config = {
      'bug': ['*BUG*'],
      'feature': ['FEAT: *']
    };
    
    expect(getLabelsForTitle('fix: login bug', config)).toContain('bug');
    expect(getLabelsForTitle('feat: new feature', config)).toContain('feature');
  });
});

describe('getDefaultConfig', () => {
  test('returns a non-empty configuration', () => {
    const config = getDefaultConfig();
    expect(Object.keys(config).length).toBeGreaterThan(0);
  });
  
  test('includes common label categories', () => {
    const config = getDefaultConfig();
    expect(config).toHaveProperty('bug');
    expect(config).toHaveProperty('enhancement');
    expect(config).toHaveProperty('documentation');
  });
});