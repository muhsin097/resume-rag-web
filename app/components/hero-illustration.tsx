// Decorative only -- a stylized pencil (tip mid-write) with a few sparkle/
// star doodles and a swirl, in the brand's own accent purple. Kept as
// simple geometric shapes rather than true sketch cross-hatching, which
// would need an enormous, fragile amount of hand-authored path data for
// marginal extra realism.
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 420"
      fill="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* swirl doodle, behind everything */}
      <path
        d="M40 330c40-55 20 60 95 20s10-120 90-95"
        stroke="var(--border-color)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* the pencil, angled with the tip toward upper-left */}
      <g transform="rotate(-38 210 210)">
        <path d="M100 196 L58 213 L100 230 Z" fill="#ffffff" stroke="#3f3f46" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M74 205 L58 213 L74 221 Z" fill="#3f3f46" />
        <rect x="100" y="196" width="230" height="34" fill="#ffffff" stroke="#3f3f46" strokeWidth="2.5" />
        <rect x="100" y="208" width="230" height="10" fill="var(--accent)" opacity="0.3" />
        <rect x="330" y="193" width="14" height="40" fill="#ffffff" stroke="#3f3f46" strokeWidth="2.5" />
        <rect x="344" y="193" width="10" height="40" fill="#ffffff" stroke="#3f3f46" strokeWidth="2.5" />
        <rect x="354" y="191" width="38" height="44" rx="8" fill="var(--accent)" opacity="0.65" stroke="#3f3f46" strokeWidth="2.5" />
      </g>

      {/* motion marks at the tip */}
      <g stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round">
        <path d="M70 70 L70 92" />
        <path d="M54 86 L76 86" />
        <path d="M44 100 L58 114" />
      </g>

      {/* sparkle stars */}
      <path d="M330 70 L336 83 L349 89 L336 95 L330 108 L324 95 L311 89 L324 83 Z" fill="var(--accent)" opacity="0.55" />
      <path d="M365 150 L369 158 L377 162 L369 166 L365 174 L361 166 L353 162 L361 158 Z" fill="var(--accent)" opacity="0.4" />
      <path d="M95 300 L99 308 L107 312 L99 316 L95 324 L91 316 L83 312 L91 308 Z" fill="var(--accent)" opacity="0.45" />

      {/* small circle doodle */}
      <circle cx="120" cy="260" r="4" stroke="var(--border-color)" strokeWidth="2" fill="none" />
    </svg>
  );
}
