import { describe, it, expect } from 'vitest';
import { suggestSlug } from './suggest-slug';

describe('suggestSlug', () => {
  it('lowercases and hyphenates a simple name', () => {
    expect(suggestSlug('Jordan Rivera')).toBe('jordan-rivera');
  });

  it('strips punctuation', () => {
    expect(suggestSlug("O'Brien, Jr.")).toBe('obrien-jr');
  });

  it('collapses repeated whitespace/hyphens into a single hyphen', () => {
    expect(suggestSlug('Jordan   Rivera -- Smith')).toBe('jordan-rivera-smith');
  });

  it('trims leading/trailing whitespace before processing', () => {
    expect(suggestSlug('  Jordan Rivera  ')).toBe('jordan-rivera');
  });

  it('caps the result at 40 characters', () => {
    const longName = 'A'.repeat(60);
    const result = suggestSlug(longName);
    expect(result.length).toBeLessThanOrEqual(40);
  });

  it('never leaves a leading or trailing hyphen, even for a name with leading/trailing symbols', () => {
    expect(suggestSlug('- Jordan Rivera -')).toBe('jordan-rivera');
    expect(suggestSlug('"Mike" Johnson')).toBe('mike-johnson');
    expect(suggestSlug('(Dr.) Jordan Rivera')).toBe('dr-jordan-rivera');
  });

  it('matches the public portfolio slug pattern the backend validates against', () => {
    // UsersService.update validates portfolioSlug against
    // /^[a-z0-9]+(-[a-z0-9]+)*$/ -- a suggestion that doesn't satisfy this
    // would silently fail the one-click enable flow.
    const pattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    expect(suggestSlug('Jordan Rivera')).toMatch(pattern);
    expect(suggestSlug("O'Brien, Jr. (Senior)")).toMatch(pattern);
    expect(suggestSlug('- Jordan Rivera -')).toMatch(pattern);
  });
});
