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
    <div className="space-y-4 text-sm">
      <div>
        <p className="font-semibold">{resume.name}</p>
        {resume.title && (
          <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            {resume.title}
          </p>
        )}
        <p className="muted text-xs">{resume.contactLine}</p>
      </div>
      {resume.summary && (
        <div className="space-y-1">
          <p className="section-label" style={{ color: 'var(--accent)' }}>
            Professional Summary
          </p>
          <p>{resume.summary}</p>
        </div>
      )}
      {resume.sections.map((section) => (
        <div key={section.heading} className="space-y-2">
          <p className="section-label" style={{ color: 'var(--accent)' }}>
            {section.heading}
          </p>
          {section.items.map((item, index) => (
            <div key={index}>
              {section.heading === 'Skills' ? (
                // One category per line ("Category: skill, skill, skill")
                // rather than a bullet per skill or one giant
                // comma-separated line -- reads like a normal resume Skills
                // section. Each skill is still its own span so a
                // just-approved one can be highlighted. Items with no
                // category yet just render their list with no leading label.
                item.bullets.length > 0 && (
                  <p className="pl-1">
                    {item.title && <span className="font-medium">{item.title}: </span>}
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
                )
              ) : (
                <>
                  {hasOwnItemTitle(item, section) && (
                    <>
                      <p className="font-medium">{item.title}</p>
                      {item.subtitle && <p className="muted text-xs">{item.subtitle}</p>}
                    </>
                  )}
                  {item.bullets.length > 0 && (
                    <ul className="ml-5 list-disc space-y-1">
                      {item.bullets.map((bullet, index) => (
                        <li key={index}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
