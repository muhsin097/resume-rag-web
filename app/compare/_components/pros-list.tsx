export function ProsList({ title, items, accent = false }: { title: string; items: string[]; accent?: boolean }) {
  return (
    <div
      className="card-muted flex-1"
      style={accent ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)' } : undefined}
    >
      <p className="font-medium" style={accent ? { color: 'var(--accent)' } : undefined}>
        {title}
      </p>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
