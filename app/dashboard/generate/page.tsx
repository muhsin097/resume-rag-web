import Link from 'next/link';
import { apiFetch, isApiUnavailable } from '@/lib/api';
import { ApiDownMessage } from '../../components/api-down';
import { GenerateForm } from './generate-form';

export const instant = false;

export default async function GeneratePage() {
  let meRes;
  try {
    meRes = await apiFetch('/users/me');
  } catch (err) {
    if (isApiUnavailable(err)) return <ApiDownMessage />;
    throw err;
  }
  const me = await meRes.json();

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
