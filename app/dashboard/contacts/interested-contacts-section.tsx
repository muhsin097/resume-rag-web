interface Lead {
  id: string;
  visitorEmail: string;
  visitorName: string | null;
  message: string | null;
  createdAt: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Only reachable if the portfolio is (or was) enabled -- a visitor can't
// submit a lead against a disabled/nonexistent portfolio in the first
// place, so an empty list here just means nobody's reached out yet.
export function InterestedContactsSection({ leads }: { leads: Lead[] }) {
  return (
    <section className="card space-y-3">
      <div>
        <h1 className="text-xl font-semibold">
          Interested contacts {leads.length > 0 ? `(${leads.length})` : ''}
        </h1>
        <p className="text-sm muted">People who reached out from your public portfolio.</p>
      </div>
      {leads.length === 0 ? (
        <p className="text-sm muted">No one yet -- share your portfolio link to start hearing from people.</p>
      ) : (
        <ul className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {leads.map((lead) => (
            <li key={lead.id} className="space-y-1 py-3 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="font-medium">
                  {lead.visitorName ? `${lead.visitorName} · ` : ''}
                  <a href={`mailto:${lead.visitorEmail}`} className="link">
                    {lead.visitorEmail}
                  </a>
                </p>
                <p className="text-xs muted">{formatDate(lead.createdAt)}</p>
              </div>
              {lead.message && <p className="text-sm muted whitespace-pre-wrap">{lead.message}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
