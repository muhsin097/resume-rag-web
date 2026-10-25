import { describe, it, expect } from 'vitest';
import { formatRange } from './format-range';

describe('formatRange', () => {
  it('returns null when there is no start/end date and it is not ongoing', () => {
    expect(formatRange({ startDate: null, endDate: null, isCurrent: false })).toBeNull();
  });

  it('renders "Present" only when isCurrent is explicitly true', () => {
    const result = formatRange({ startDate: '2022-01-01', endDate: null, isCurrent: true });
    expect(result).toContain('Present');
  });

  it('never renders "Present" for isCurrent=false, even with a null endDate (ended, date unknown)', () => {
    const result = formatRange({ startDate: '2022-01-01', endDate: null, isCurrent: false });
    expect(result).not.toContain('Present');
    expect(result).not.toBeNull();
  });

  it('renders a real end date when present and not current', () => {
    const result = formatRange({ startDate: '2022-01-01', endDate: '2023-06-01', isCurrent: false });
    expect(result).toContain('Jun 2023');
    expect(result).not.toContain('Present');
  });

  it('uses "?" for a missing start date when an end date or current status exists', () => {
    const result = formatRange({ startDate: null, endDate: '2023-06-01', isCurrent: false });
    expect(result).toMatch(/^\? –/);
  });

  it('prefers isCurrent over a stray endDate (isCurrent wins if both are somehow set)', () => {
    const result = formatRange({ startDate: '2022-01-01', endDate: '2023-06-01', isCurrent: true });
    expect(result).toContain('Present');
    expect(result).not.toContain('Jun 2023');
  });
});
