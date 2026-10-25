import { describe, it, expect } from 'vitest';
import { portfolioCacheTag } from './cache-tag';

// Trivial on its own, but the whole point of extracting this into one
// function is that the read side (data.ts) and every write side
// (dashboard/profile/actions.ts) call the exact same implementation --
// a snapshot-style assertion here is cheap insurance against someone
// "simplifying" one call site and silently breaking cache invalidation.
describe('portfolioCacheTag', () => {
  it('produces a stable, deterministic tag for a given slug', () => {
    expect(portfolioCacheTag('jordan-rivera')).toBe('portfolio-jordan-rivera');
  });

  it('produces different tags for different slugs', () => {
    expect(portfolioCacheTag('a')).not.toBe(portfolioCacheTag('b'));
  });
});
