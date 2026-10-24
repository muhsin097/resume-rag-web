import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPortfolioData, type PortfolioExperienceItem } from './data';
import { LeadForm } from './lead-form';

// Honest date formatting, matching the isCurrent distinction the rest of
// the app already uses -- isCurrent=false with no endDate means "ended,
// date just not known," never silently rendered as "Present" (the old
// ambiguous behavior this whole app moved away from).
function formatRange(item: PortfolioExperienceItem): string | null {
  const fmt = (d: string) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  if (!item.startDate && !item.endDate && !item.isCurrent) return null;
  const start = item.startDate ? fmt(item.startDate) : '?';
  if (item.isCurrent) return `${start} – Present`;
  if (item.endDate) return `${start} – ${fmt(item.endDate)}`;
  return start;
}

function EntryList({ items }: { items: PortfolioExperienceItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <p className="font-medium">
              {item.title}
              {item.organization ? ` at ${item.organization}` : ''}
            </p>
            {formatRange(item) && <p className="text-xs muted">{formatRange(item)}</p>}
          </div>
          {item.description && <p className="mt-1 text-sm muted whitespace-pre-wrap">{item.description}</p>}
        </div>
      ))}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPortfolioData(slug);
  if (!profile) return {};

  return {
    title: `${profile.name} — Cease to Resume`,
    description: profile.bio ?? `${profile.name}'s professional portfolio.`,
    openGraph: {
      title: profile.name,
      description: profile.bio ?? undefined,
      type: 'profile',
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getPortfolioData(slug);
  if (!profile) notFound();

  const evidencedSkills = profile.skills.filter((s) => s.evidenceCount > 0);
  const otherSkills = profile.skills.filter((s) => s.evidenceCount === 0);

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-12" style={{ background: 'var(--background)' }}>
      <header className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight">{profile.name}</h1>
        {profile.bio && <p className="max-w-xl text-base muted sm:max-w-none">{profile.bio}</p>}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:justify-start">
          {profile.location && <span className="muted">{profile.location}</span>}
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="link">
              LinkedIn
            </a>
          )}
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="link">
              GitHub
            </a>
          )}
          {profile.websiteUrl && (
            <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="link">
              Website
            </a>
          )}
        </div>
        <div className="flex justify-center sm:justify-start">
          <LeadForm slug={slug} />
        </div>
      </header>

      {profile.skills.length > 0 && (
        <section className="space-y-2">
          <h2 className="section-label">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {evidencedSkills.map((skill) => (
              <span
                key={skill.title}
                className="chip"
                style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                title={`Used in: ${skill.roles.join(', ')}`}
              >
                {skill.title}
                <span className="text-xs opacity-70">
                  · {skill.evidenceCount} role{skill.evidenceCount === 1 ? '' : 's'}
                </span>
              </span>
            ))}
            {otherSkills.map((skill) => (
              <span key={skill.title} className="chip">
                {skill.title}
              </span>
            ))}
          </div>
        </section>
      )}

      {profile.experience.length > 0 && (
        <section className="space-y-2">
          <h2 className="section-label">Experience</h2>
          <EntryList items={profile.experience} />
        </section>
      )}

      {profile.projects.length > 0 && (
        <section className="space-y-2">
          <h2 className="section-label">Projects</h2>
          <EntryList items={profile.projects} />
        </section>
      )}

      {profile.education.length > 0 && (
        <section className="space-y-2">
          <h2 className="section-label">Education</h2>
          <EntryList items={profile.education} />
        </section>
      )}

      {profile.certifications.length > 0 && (
        <section className="space-y-2">
          <h2 className="section-label">Certifications</h2>
          <EntryList items={profile.certifications} />
        </section>
      )}

      {profile.languages.length > 0 && (
        <section className="space-y-2">
          <h2 className="section-label">Languages</h2>
          <p className="text-sm">{profile.languages.map((l) => l.title).join(', ')}</p>
        </section>
      )}

      {profile.achievements.length > 0 && (
        <section className="space-y-2">
          <h2 className="section-label">Achievements</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {profile.achievements.map((a) => (
              <li key={a.title}>
                {a.title}
                {a.description && <span className="muted"> — {a.description}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="pt-4 text-center text-xs muted">
        Built with{' '}
        <Link href="/" className="link">
          Cease to Resume
        </Link>
      </footer>
    </main>
  );
}
