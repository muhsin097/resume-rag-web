import { apiFetch } from '@/lib/api';
import { GenerateForm } from './generate-form';

export const instant = false;

const FREE_GENERATIONS_LIMIT = 5;

export default async function GeneratePage() {
  const meRes = await apiFetch('/users/me');
  const me = await meRes.json();

  const remaining =
    me.plan === 'PREMIUM'
      ? null
      : Math.max(0, FREE_GENERATIONS_LIMIT - me.freeGenerationsUsed);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="card text-sm">
        {me.plan === 'PREMIUM'
          ? 'Premium plan: unlimited generations.'
          : `${remaining} of ${FREE_GENERATIONS_LIMIT} free generations remaining.`}
      </div>
      <GenerateForm />
    </div>
  );
}
