// Wraps every occurrence of `matched`/`missing` keywords inside `text` in a
// colored <mark>. Keywords are matched case-insensitively and are expected
// to be verbatim substrings of `text` (the backend's analyzeMatch prompt
// requires Claude to copy them exactly from the job description for this
// reason). Longer keywords are matched first so e.g. "AWS EKS" claims its
// span before the bare "AWS" would.
export function highlightKeywords(
  text: string,
  matched: string[],
  missing: string[],
): React.ReactNode[] {
  interface Mark {
    start: number;
    end: number;
    variant: 'matched' | 'missing';
  }

  const candidates = [
    ...matched.map((keyword) => ({ keyword, variant: 'matched' as const })),
    ...missing.map((keyword) => ({ keyword, variant: 'missing' as const })),
  ].sort((a, b) => b.keyword.length - a.keyword.length);

  const marks: Mark[] = [];
  for (const { keyword, variant } of candidates) {
    if (!keyword.trim()) continue;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      marks.push({
        start: match.index,
        end: match.index + match[0].length,
        variant,
      });
    }
  }

  // Resolve overlaps: longer keywords were pushed first, but matches are now
  // mixed by position -- sort by start, then prefer the longer (earlier-
  // ending-later) span at ties, and drop anything that overlaps a span
  // already accepted.
  marks.sort((a, b) => a.start - b.start || b.end - a.end);
  const accepted: Mark[] = [];
  let cursor = -1;
  for (const mark of marks) {
    if (mark.start >= cursor) {
      accepted.push(mark);
      cursor = mark.end;
    }
  }

  const classNames: Record<Mark['variant'], string> = {
    matched:
      'rounded bg-green-200 px-0.5 text-green-900',
    missing:
      'rounded bg-red-200 px-0.5 text-red-900',
  };

  const nodes: React.ReactNode[] = [];
  let pos = 0;
  accepted.forEach((mark, i) => {
    if (mark.start > pos) nodes.push(text.slice(pos, mark.start));
    nodes.push(
      <mark key={i} className={classNames[mark.variant]}>
        {text.slice(mark.start, mark.end)}
      </mark>,
    );
    pos = mark.end;
  });
  if (pos < text.length) nodes.push(text.slice(pos));

  return nodes;
}
