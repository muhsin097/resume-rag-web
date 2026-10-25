import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { getPortfolioData, type PortfolioExperienceItem, type PortfolioSkill } from './data';
import { LeadForm } from './lead-form';
import { SkillsMarquee } from './skills-marquee';
import { Reveal } from './reveal';
import { HeroIllustration } from '../../components/hero-illustration';
import { formatRange } from '@/lib/format-range';

// Section copy is static/editorial, not derived from the candidate's
// data -- only which sections appear (and their running number) depends
// on what the profile actually has.
const SECTION_COPY = {
  skills: { eyebrow: 'SKILLS', headline: 'What I bring' },
  experience: { eyebrow: 'EXPERIENCE', headline: "Where I've worked" },
  projects: { eyebrow: 'PROJECTS', headline: 'Selected work' },
  education: { eyebrow: 'EDUCATION', headline: 'Where I studied' },
  certifications: { eyebrow: 'CERTIFICATIONS', headline: 'Certifications' },
  languages: { eyebrow: 'LANGUAGES', headline: 'Languages' },
  achievements: { eyebrow: 'ACHIEVEMENTS', headline: 'Worth mentioning' },
  contact: { eyebrow: 'CONTACT', headline: "Let's work together" },
} as const;

type SectionKey = keyof typeof SECTION_COPY;

function PortfolioNav({ items }: { items: SectionKey[] }) {
  return (
    <nav className="portfolio-nav">
      <div className="portfolio-nav-inner">
        {items.map((key) => (
          <a key={key} href={`#${key}`} className="portfolio-nav-link">
            {SECTION_COPY[key].eyebrow}
          </a>
        ))}
      </div>
    </nav>
  );
}

function SectionIntro({ number, section, blurb }: { number: string; section: SectionKey; blurb?: string }) {
  const { eyebrow, headline } = SECTION_COPY[section];
  return (
    <div>
      <p className="section-eyebrow">
        {number} — {eyebrow}
      </p>
      <h2 className="section-headline">{headline}</h2>
      {blurb && <p className="mt-2 max-w-md text-sm muted">{blurb}</p>}
    </div>
  );
}


function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
}

function groupSkillsByCategory(skills: PortfolioSkill[]): [string, PortfolioSkill[]][] {
  const order: string[] = [];
  const map = new Map<string, PortfolioSkill[]>();
  for (const skill of skills) {
    const key = skill.category ?? 'Other';
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(skill);
  }
  return order.map((key) => [key, map.get(key)!]);
}

function EntryList({ items, showDates = true }: { items: PortfolioExperienceItem[]; showDates?: boolean }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <p className="font-medium">
              {item.title}
              {item.organization ? ` at ${item.organization}` : ''}
            </p>
            {showDates && formatRange(item) && <p className="text-xs muted">{formatRange(item)}</p>}
          </div>
          {item.description && <p className="mt-1 text-sm muted whitespace-pre-wrap">{item.description}</p>}
        </div>
      ))}
    </div>
  );
}

// Visual timeline for Experience -- a connecting line + dots reads more
// like a career path than a flat list. Each entry fades/slides in as it
// scrolls into view, staggered by index; an ongoing role gets a gently
// pulsing dot.
function Timeline({ items }: { items: PortfolioExperienceItem[] }) {
  return (
    <div className="timeline">
      {items.map((item, i) => (
        <Reveal key={item.id} delayMs={Math.min(i, 5) * 80} className="timeline-item">
          <span className={`timeline-dot${item.isCurrent ? ' is-current' : ''}`} />
          <div className="timeline-card">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className="font-medium">
                {item.title}
                {item.organization ? ` at ${item.organization}` : ''}
              </p>
              {formatRange(item) && <p className="text-xs muted">{formatRange(item)}</p>}
            </div>
            {item.description && <p className="mt-1 text-sm muted whitespace-pre-wrap">{item.description}</p>}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

// Card grid rather than a stacked text list -- projects are the section
// that benefits most from reading like a showcase. The one project the
// candidate chose to feature (see ExperienceItemsService.update, "at
// most one per user") gets a bigger standalone card above the rest.
function ProjectGrid({ items }: { items: PortfolioExperienceItem[] }) {
  const highlighted = items.find((item) => item.isHighlighted);
  const rest = highlighted ? items.filter((item) => item.id !== highlighted.id) : items;

  return (
    <div className="space-y-5">
      {highlighted && (
        <Reveal className="featured-project-card">
          <p className="featured-project-label">Featured project</p>
          <p className="mt-1.5 text-xl font-bold">{highlighted.title}</p>
          {highlighted.description && (
            <p className="mt-2 text-sm muted whitespace-pre-wrap">{highlighted.description}</p>
          )}
        </Reveal>
      )}
      {rest.length > 0 && (
        <div className="project-grid">
          {rest.map((item, i) => (
            <Reveal key={item.id} delayMs={Math.min(i, 5) * 70} className="project-card">
              <p className="text-base font-semibold">{item.title}</p>
              {item.description && <p className="mt-1.5 text-sm muted whitespace-pre-wrap">{item.description}</p>}
            </Reveal>
          ))}
        </div>
      )}
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

  // Top-evidenced skills get a real data-driven bar (width scaled to
  // evidenceCount, never a fabricated proficiency %); the long tail
  // renders as quiet grouped text instead of a wall of bordered chips.
  const barSkills = profile.skills.filter((s) => s.evidenceCount > 0).slice(0, 6);
  const barSkillTitles = new Set(barSkills.map((s) => s.title));
  const maxEvidence = Math.max(1, ...barSkills.map((s) => s.evidenceCount));
  const longTailGroups = groupSkillsByCategory(profile.skills.filter((s) => !barSkillTitles.has(s.title)));

  // Section numbers are computed from whichever sections this profile
  // actually has data for, not hardcoded -- stays contiguous either way.
  const presence: [SectionKey, boolean][] = [
    ['skills', profile.skills.length > 0],
    ['experience', profile.experience.length > 0],
    ['projects', profile.projects.length > 0],
    ['education', profile.education.length > 0],
    ['certifications', profile.certifications.length > 0],
    ['languages', profile.languages.length > 0],
    ['achievements', profile.achievements.length > 0],
    ['contact', true],
  ];
  const numbers = new Map<SectionKey, string>();
  let n = 0;
  for (const [key, show] of presence) {
    if (show) {
      n += 1;
      numbers.set(key, String(n).padStart(2, '0'));
    }
  }

  const navItems = presence.filter(([, show]) => show).map(([key]) => key);
  const hasSocialLinks = Boolean(profile.linkedinUrl || profile.githubUrl || profile.websiteUrl);

  return (
    <main className="portfolio-bg">
      <PortfolioNav items={navItems} />
      <div className="mx-auto max-w-3xl space-y-14 px-6 py-12">
        <header className="portfolio-hero text-center sm:text-left">
          <div className="hero-doodle" aria-hidden="true">
            <HeroIllustration />
          </div>
          <div className="portfolio-hero-content hero-animate space-y-3">
            <div className="avatar-circle mx-auto sm:mx-0">{getInitials(profile.name)}</div>
            <h1 className="hero-name">{profile.name}</h1>
            {profile.bio && <p className="hero-bio">{profile.bio}</p>}
            {profile.location && <p className="text-sm muted">{profile.location}</p>}
          </div>
        </header>

        {profile.skills.length > 0 && (
          <Reveal>
            <section id="skills" className="portfolio-section space-y-5">
              <SectionIntro number={numbers.get('skills')!} section="skills" />
              <SkillsMarquee skills={profile.skills} />
              {barSkills.length > 0 && (
                <div>
                  {barSkills.map((skill) => (
                    <div
                      key={skill.title}
                      className="skill-bar-row"
                      title={`Used in: ${skill.roles.join(', ')}`}
                    >
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-medium">{skill.title}</span>
                        <span className="text-xs muted">
                          {skill.evidenceCount} role{skill.evidenceCount === 1 ? '' : 's'}
                        </span>
                      </div>
                      <div className="skill-bar-track">
                        <div
                          className="skill-bar-fill"
                          style={{ '--bar-width': `${Math.max(16, (skill.evidenceCount / maxEvidence) * 100)}%` } as CSSProperties}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {longTailGroups.length > 0 && (
                <div className="space-y-1.5 text-sm">
                  {longTailGroups.map(([category, items]) => (
                    <p key={category} className="muted">
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                        {category}:{' '}
                      </span>
                      {items.map((s) => s.title).join(', ')}
                    </p>
                  ))}
                </div>
              )}
            </section>
          </Reveal>
        )}

        {profile.experience.length > 0 && (
          <Reveal>
            <section id="experience" className="portfolio-section section-split">
              <div className="section-intro-sticky">
                <SectionIntro
                  number={numbers.get('experience')!}
                  section="experience"
                  blurb="Roles, scope, and what I actually worked on."
                />
              </div>
              <Timeline items={profile.experience} />
            </section>
          </Reveal>
        )}

        {profile.projects.length > 0 && (
          <Reveal>
            <section id="projects" className="portfolio-section space-y-5">
              <SectionIntro number={numbers.get('projects')!} section="projects" />
              <ProjectGrid items={profile.projects} />
            </section>
          </Reveal>
        )}

        {profile.education.length > 0 && (
          <Reveal>
            <section id="education" className="portfolio-section space-y-5">
              <SectionIntro number={numbers.get('education')!} section="education" />
              <EntryList items={profile.education} />
            </section>
          </Reveal>
        )}

        {profile.certifications.length > 0 && (
          <Reveal>
            <section id="certifications" className="portfolio-section space-y-5">
              <SectionIntro number={numbers.get('certifications')!} section="certifications" />
              <EntryList items={profile.certifications} />
            </section>
          </Reveal>
        )}

        {profile.languages.length > 0 && (
          <Reveal>
            <section id="languages" className="portfolio-section space-y-5">
              <SectionIntro number={numbers.get('languages')!} section="languages" />
              <p className="text-sm">{profile.languages.map((l) => l.title).join(', ')}</p>
            </section>
          </Reveal>
        )}

        {profile.achievements.length > 0 && (
          <Reveal>
            <section id="achievements" className="portfolio-section space-y-5">
              <SectionIntro number={numbers.get('achievements')!} section="achievements" />
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {profile.achievements.map((a) => (
                  <li key={a.title}>
                    {a.title}
                    {a.description && <span className="muted"> — {a.description}</span>}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        )}

        <Reveal>
          <section id="contact" className="portfolio-section">
            <SectionIntro
              number={numbers.get('contact')!}
              section="contact"
              blurb="Know someone who's hiring, or think I'd be a fit? Reach out -- it goes straight to their dashboard and inbox."
            />
            <div className="contact-grid mt-6">
              <LeadForm slug={slug} />
              <div className="contact-aside space-y-4">
                {hasSocialLinks && (
                  <div>
                    <p className="section-eyebrow">Elsewhere</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.linkedinUrl && (
                        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-pill">
                          LinkedIn
                        </a>
                      )}
                      {profile.githubUrl && (
                        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="social-pill">
                          GitHub
                        </a>
                      )}
                      {profile.websiteUrl && (
                        <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="social-pill">
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-sm muted">
                  Your message goes straight to {profile.name.split(' ')[0]}&apos;s dashboard and email -- no
                  middleman, no public comment thread.
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        <footer className="pt-2 text-center text-xs muted">
          Built with{' '}
          <Link href="/" className="link">
            Cease to Resume
          </Link>
        </footer>
      </div>
    </main>
  );
}
