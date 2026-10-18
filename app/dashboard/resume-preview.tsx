import type { StructuredResume } from './generate/actions';

// Skills/Languages/Achievements items carry an empty title today, but
// older stored generations put the section heading itself in there --
// skip it either way rather than printing the heading twice.
function hasOwnItemTitle(
  item: { title: string },
  section: { heading: string },
): boolean {
  return Boolean(item.title) && item.title.trim().toLowerCase() !== section.heading.trim().toLowerCase();
}

// Real headings/bullets instead of a <pre> blob -- only possible for
// generations made after structuredContent shipped; callers fall back to
// <pre>{generatedContent}</pre> for older rows (structuredContent null).
export function ResumePreview({
  resume,
  highlightedSkills,
}: {
  resume: StructuredResume;
  // Skills just approved via the "add missing keyword" flow on this exact
  // generation -- called out visually so the candidate can see at a glance
  // that the request actually landed, rather than hunting through the list.
  highlightedSkills?: string[];
}) {
  const highlightedSet = new Set(highlightedSkills?.map((s) => s.toLowerCase()));
  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="font-semibold">{resume.name}</p>
        {resume.title && (
          <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            {resume.title}
          </p>
        )}
        <p className="muted text-xs">{resume.contactLine}</p>
      </div>
      {resume.summary && <p>{resume.summary}</p>}
      {resume.sections.map((section) => (
        <div key={section.heading} className="space-y-2">
          <p className="section-label" style={{ color: 'var(--accent)' }}>
            {section.heading}
          </p>
          {section.items.map((item, index) => (
            <div key={index}>
              {hasOwnItemTitle(item, section) && (
                <>
                  <p className="font-medium">{item.title}</p>
                  {item.subtitle && <p className="muted text-xs">{item.subtitle}</p>}
                </>
              )}
              {item.bullets.length > 0 &&
                (section.heading === 'Skills' ? (
                  // One combined, comma-separated line rather than a bullet
                  // per skill -- wraps naturally no matter how many/long the
                  // skills are, and reads like a normal resume Skills line.
                  // Each skill is still its own span so a just-approved one
                  // can be highlighted without breaking the flowing layout.
                  <p>
                    {item.bullets.map((skill, i) => (
                      <span key={skill}>
                        <span
                          className={
                            highlightedSet.has(skill.toLowerCase())
                              ? 'rounded bg-green-100 px-1 font-medium text-green-900'
                              : undefined
                          }
                        >
                          {skill}
                        </span>
                        {i < item.bullets.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                ) : (
                  <ul className="ml-4 list-disc space-y-0.5">
                    {item.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
