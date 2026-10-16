import type { StructuredResume } from './generate/actions';

// Real headings/bullets instead of a <pre> blob -- only possible for
// generations made after structuredContent shipped; callers fall back to
// <pre>{generatedContent}</pre> for older rows (structuredContent null).
export function ResumePreview({ resume }: { resume: StructuredResume }) {
  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="font-semibold">{resume.name}</p>
        <p className="muted text-xs">{resume.contactLine}</p>
      </div>
      {resume.summary && <p>{resume.summary}</p>}
      {resume.sections.map((section) => (
        <div key={section.heading} className="space-y-2">
          <p className="section-label" style={{ color: 'var(--accent)' }}>
            {section.heading}
          </p>
          {section.items.map((item) => (
            <div key={item.title}>
              <p className="font-medium">
                {item.title}
                {item.subtitle && <span className="muted"> — {item.subtitle}</span>}
              </p>
              {item.bullets.length > 0 && (
                <ul className="ml-4 list-disc space-y-0.5">
                  {item.bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
