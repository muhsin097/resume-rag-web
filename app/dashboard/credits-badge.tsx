import Link from 'next/link';

// A genuine filled gold coin (not a thin purple outline) -- two-tone disc
// for a bit of embossed depth, plus a star to read as "special currency"
// rather than a plain circle that could be mistaken for anything.
function GoldCoinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#D4940A" />
      <circle cx="12" cy="12" r="8" fill="#FFC72C" />
      <circle cx="12" cy="12" r="8" fill="none" stroke="#D4940A" strokeWidth="1" strokeDasharray="1.2 2" />
      <path
        d="M12 7.2l1.2 2.5 2.7.4-2 1.9.5 2.7L12 13.3l-2.4 1.4.5-2.7-2-1.9 2.7-.4L12 7.2Z"
        fill="#D4940A"
      />
    </svg>
  );
}

// Shown in the dashboard header on every page -- PREMIUM accounts (the
// legacy unlimited grandfather flag) get an infinity mark instead of a
// number, since a literal count would be meaningless for them. The word
// "credits" is spelled out, not left for the coin icon alone to imply --
// a bare number next to any icon reads as ambiguous at a glance.
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
      className="flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3.5 text-sm font-semibold transition-colors"
      style={{
        background: low ? '#fef2f2' : 'var(--accent-soft)',
        color: low ? '#b91c1c' : 'var(--accent)',
        border: `1px solid ${low ? '#fecaca' : 'var(--accent)'}`,
      }}
      title={plan === 'PREMIUM' ? 'Unlimited generations' : `${creditsBalance} generation credits -- buy more`}
    >
      <GoldCoinIcon />
      {plan === 'PREMIUM' ? 'Unlimited' : `${creditsBalance} credit${creditsBalance === 1 ? '' : 's'}`}
    </Link>
  );
}
