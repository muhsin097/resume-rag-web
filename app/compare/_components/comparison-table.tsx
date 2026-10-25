export interface ComparisonRow {
  feature: string;
  us: string;
  them: string;
}

// Plain text values rather than a generic boolean-check grid -- most of
// these comparisons are genuinely nuanced ("full generated draft" vs
// "scores an existing resume"), not just yes/no, and forcing everything
// into checkmarks would flatten real differences into a templated look.
export function ComparisonTable({ competitor, rows }: { competitor: string; rows: ComparisonRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
            <th className="py-2 pr-4 text-left font-medium muted">Feature</th>
            <th className="px-4 py-2 text-left font-semibold" style={{ color: 'var(--accent)' }}>
              Cease to Resume
            </th>
            <th className="py-2 pl-4 text-left font-medium">{competitor}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-b" style={{ borderColor: 'var(--border-color)' }}>
              <td className="py-3 pr-4 align-top font-medium">{row.feature}</td>
              <td className="px-4 py-3 align-top">{row.us}</td>
              <td className="py-3 pl-4 align-top muted">{row.them}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
