import { apiFetchJson, isApiUnavailable } from '@/lib/api';
import { ApiDownMessage } from '../../components/api-down';
import { BuyButton } from './buy-button';
import type { CreditPack } from './actions';

export const instant = false;

interface Me {
  email: string;
  name: string;
  plan: 'FREE' | 'PREMIUM';
  creditsBalance: number;
}

// Display-only mirror of CREDIT_PACKS in resume-rag-api -- the backend
// re-derives price/credits from the pack name on every order, so a stale
// value here is a display bug at worst, never a pricing bug. credits is
// in the finer unit (a full generation costs 2, a rescore costs 1), so
// "generations" below is credits/2, not credits itself.
const PACKS: { pack: CreditPack; label: string; priceRupees: number; credits: number }[] = [
  { pack: 'STARTER', label: 'Starter', priceRupees: 99, credits: 10 },
  { pack: 'JOB_SEARCH', label: 'Job Search', priceRupees: 249, credits: 30 },
  { pack: 'INTENSIVE', label: 'Intensive', priceRupees: 499, credits: 70 },
];

export default async function BuyCreditsPage() {
  let me: Me;
  try {
    me = await apiFetchJson<Me>('/users/me');
  } catch (err) {
    if (isApiUnavailable(err)) return <ApiDownMessage />;
    throw err;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Buy generation credits</h1>
        <p className="mt-1 text-sm muted">
          {me.plan === 'PREMIUM'
            ? 'You have unlimited generations on your account -- no need to buy credits.'
            : `You currently have ${me.creditsBalance} credit${me.creditsBalance === 1 ? '' : 's'} (a full generation uses 2, recalculating a score uses 1 -- adding a skill is always free). Credits are valid for 90 days from purchase and don't auto-renew.`}
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
                  <span className="text-sm font-normal muted"> / {p.credits} credits</span>
                </p>
                <p className="text-xs muted">
                  &asymp;{p.credits / 2} full generations &middot; &#8377;
                  {(p.priceRupees / (p.credits / 2)).toFixed(0)} per generation
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
