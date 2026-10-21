// Shared between the history page (explaining the two badges next to
// every entry) and the home page (showcasing the two-signal scoring as a
// feature) -- one place for this copy so the two never drift apart.
export function ScoreLegend() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="card flex gap-3">
        <span
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full text-base font-semibold"
          style={{ background: '#dcfce7', color: '#166534' }}
          aria-hidden="true"
        >
          %
        </span>
        <div className="space-y-1">
          <h3 className="font-semibold">Keyword coverage</h3>
          <p className="text-sm muted">
            How many of the job description&apos;s specific keywords your resume
            actually matches -- a plain percentage, computed directly from the
            matched/missing list. 100 means every important keyword is
            covered.
          </p>
        </div>
      </div>
      <div className="card flex gap-3">
        <span
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full text-base font-semibold"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          aria-hidden="true"
        >
          AI
        </span>
        <div className="space-y-1">
          <h3 className="font-semibold">Overall fit</h3>
          <p className="text-sm muted">
            Claude&apos;s own holistic read of how well your full background
            fits the role -- weighing seniority, depth of experience, and
            adjacent skills, not just literal keyword matches.
          </p>
        </div>
      </div>
    </div>
  );
}
