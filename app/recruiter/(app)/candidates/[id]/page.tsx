import Link from 'next/link';
import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { TYPE_BADGE_CLASSES } from '../../../dashboard/profile/type-colors';

export const instant = false;

interface ExperienceItem {
  id: string;
  type: string;
  title: string;
  organization: string | null;
  startDate: string | null;
  endDate: string | null;
}

interface CandidateDetail {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
  experienceItems: ExperienceItem[];
}

function formatRange(start: string | null, end: string | null) {
  if (!start && !end) return null;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  return `${start ? fmt(start) : '?'} – ${end ? fmt(end) : 'present'}`;
}

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiFetch(`/recruiter/candidates/${id}`);
  if (res.status === 404) {
    notFound();
  }
  const candidate: CandidateDetail = await res.json();

  const grouped = new Map<string, ExperienceItem[]>();
  for (const item of candidate.experienceItems) {
    grouped.set(item.type, [...(grouped.get(item.type) ?? []), item]);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/recruiter/search" className="link text-sm">
        ← Back to search
      </Link>

      <div className="card space-y-2">
        <h1 className="text-lg font-semibold">{candidate.name}</h1>
        {candidate.location && (
          <p className="text-sm muted">{candidate.location}</p>
        )}
        {candidate.bio && <p className="text-sm">{candidate.bio}</p>}
      </div>

      <div className="card space-y-4">
        <div className="section-label">
          Experience ({candidate.experienceItems.length})
        </div>
        {[...grouped.entries()].map(([type, items]) => (
          <div key={type} className="space-y-2">
            <span
              className={`chip ${TYPE_BADGE_CLASSES[type]}`}
              style={{ border: 'none' }}
            >
              {type} · {items.length}
            </span>
            <ul className="space-y-1">
              {items.map((item) => {
                const range = formatRange(item.startDate, item.endDate);
                return (
                  <li key={item.id} className="text-sm">
                    <span className="font-medium">{item.title}</span>
                    {item.organization && (
                      <span className="muted"> · {item.organization}</span>
                    )}
                    {range && <span className="muted"> · {range}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {candidate.experienceItems.length === 0 && (
          <p className="text-sm muted">No experience listed yet.</p>
        )}
      </div>
    </div>
  );
}
