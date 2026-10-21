import { apiFetch, isApiUnavailable } from '@/lib/api';
import { ApiDownMessage } from '../../components/api-down';
import { BuyButton } from './buy-button';
import type { CreditPack } from './actions';

export const instant = false;

// Display-only mirror of CREDIT_PACKS in resume-rag-api -- the backend
// re-derives price/credits from the pack name on every order, so a stale
// value here is a display bug at worst, never a pricing bug.
const PACKS: { pack: CreditPack; label: string; priceRupees: number; credits: number }[] = [
  { pack: 'STARTER', label: 'Starter', priceRupees: 99, credits: 5 },
  { pack: 'JOB_SEARCH', label: 'Job Search', priceRupees: 249, credits: 15 },
  { pack: 'INTENSIVE', label: 'Intensive', priceRupees: 499, credits: 35 },
];

export default async function BuyCreditsPage() {
  let meRes;
  try {
    meRes = await apiFetch('/users/me');
  } catch (err) {
    if (isApiUnavailable(err)) return <ApiDownMessage />;
    throw err;
  }
  const me = await meRes.json();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Buy generation credits</h1>
        <p className="mt-1 text-sm muted">
          {me.plan === 'PREMIUM'
            ? 'You have unlimited generations on your account -- no need to buy credits.'
            : `You currently have ${me.creditsBalance} generation${me.creditsBalance === 1 ? '' : 's'} remaining. Credits are valid for 90 days from purchase and don't auto-renew.`}
        </p>
      </div>

      {me.plan !== 'PREMIUM' && (
        <div className="grid gap-4 sm:grid-cols-3">
          {PACKS.map((p) => (
            <div key={p.pack} className="card flex flex-col gap-3">
              <div>
                <p className="font-semibold">{p.label}</p>
                <p className="text-2xl font-semibold">
                  &#8377;{p.priceRupees}
                  <span className="text-sm font-normal muted"> / {p.credits} generations</span>
                </p>
                <p className="text-xs muted">
                  &#8377;{(p.priceRupees / p.credits).toFixed(0)} per generation
                </p>
              </div>
              <BuyButton pack={p.pack} label={p.label} email={me.email} name={me.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
