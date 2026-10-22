import Link from 'next/link';

// Stroke-only coin, matching the Brand mark's own line weight -- a filled
// emoji coin would clash with the rest of the icon set's style.
function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.5v9M14.5 9.3c0-1-1-1.8-2.5-1.8s-2.5.7-2.5 1.7c0 2.4 5 1 5 3.4 0 1-1.1 1.7-2.5 1.7s-2.5-.8-2.5-1.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Shown in the dashboard header on every page -- PREMIUM accounts (the
// legacy unlimited grandfather flag) get an infinity mark instead of a
// number, since a literal count would be meaningless for them.
export function CreditsBadge({
  plan,
  creditsBalance,
}: {
  plan: 'FREE' | 'PREMIUM';
  creditsBalance: number;
}) {
  const low = plan === 'FREE' && creditsBalance <= 1;

  return (
    <Link
      href="/dashboard/buy-credits"
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium transition-colors"
      style={{
        background: low ? '#fef2f2' : 'var(--accent-soft)',
        color: low ? '#b91c1c' : 'var(--accent)',
      }}
      title={plan === 'PREMIUM' ? 'Unlimited generations' : `${creditsBalance} generation credits -- buy more`}
    >
      <CoinIcon />
      {plan === 'PREMIUM' ? '∞' : creditsBalance}
    </Link>
  );
}
