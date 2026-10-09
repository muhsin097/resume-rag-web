const SIZES = {
  sm: { icon: 20, text: 'text-sm' },
  md: { icon: 24, text: 'text-lg' },
  lg: { icon: 34, text: 'text-2xl' },
} as const;

export function Brand({ size = 'md' }: { size?: keyof typeof SIZES }) {
  const { icon, text } = SIZES[size];

  return (
    <span className="inline-flex items-center gap-2">
      <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" className="flex-none">
        <defs>
          <linearGradient id="brand-gradient" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="22" height="22" rx="7" fill="url(#brand-gradient)" opacity="0.18" />
        <path
          d="M7.5 12.6l2.8 2.8L16.6 9"
          stroke="url(#brand-gradient)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`${text} font-semibold tracking-tight`}
        style={{
          backgroundImage:
            'linear-gradient(135deg, var(--accent), var(--accent-2))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Cease to Resume
      </span>
    </span>
  );
}
