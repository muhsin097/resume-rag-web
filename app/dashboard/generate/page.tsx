import Link from 'next/link';
import { apiFetchJson, isApiUnavailable } from '@/lib/api';
import { ApiDownMessage } from '../../components/api-down';
import { GenerateForm } from './generate-form';

export const instant = false;

interface Me {
  plan: 'FREE' | 'PREMIUM';
  creditsBalance: number;
}

export default async function GeneratePage() {
  let me: Me;
  try {
    me = await apiFetchJson<Me>('/users/me');
  } catch (err) {
    if (isApiUnavailable(err)) return <ApiDownMessage />;
    throw err;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="card text-sm">
        {me.plan === 'PREMIUM' ? (
          'Unlimited generations.'
        ) : (
          <>
            {me.creditsBalance} credit{me.creditsBalance === 1 ? '' : 's'} -- a full generation
            uses 2, recalculating a score uses 1, adding a skill is free.{' '}
            <Link href="/dashboard/buy-credits" className="link">
              Buy more
            </Link>
          </>
        )}
      </div>
      <GenerateForm />
    </div>
  );
}
