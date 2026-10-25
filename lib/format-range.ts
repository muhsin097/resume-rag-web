// Shared by the public portfolio page and the dashboard's experience-item
// cards -- previously defined identically in both places, which is
// exactly the kind of duplication that silently drifts (one gets fixed,
// the other doesn't). Honest date formatting: isCurrent=false with a
// null endDate means "ended, date just not known," never silently
// rendered as "Present".
export interface DateRangeItem {
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
}

export function formatRange(item: DateRangeItem): string | null {
  const fmt = (d: string) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  if (!item.startDate && !item.endDate && !item.isCurrent) return null;
  const start = item.startDate ? fmt(item.startDate) : '?';
  if (item.isCurrent) return `${start} – Present`;
  if (item.endDate) return `${start} – ${fmt(item.endDate)}`;
  return start;
}
