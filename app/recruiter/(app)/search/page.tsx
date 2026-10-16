import { apiFetch } from '@/lib/api';
import { SearchForm } from './search-form';

export const instant = false;

export default async function RecruiterSearchPage() {
  const meRes = await apiFetch('/recruiter/me');
  const me = await meRes.json();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Find candidates</h1>
        <span className="text-sm muted">{me.creditsRemaining} ranking credits left</span>
      </div>
      <SearchForm initialCreditsRemaining={me.creditsRemaining} />
    </div>
  );
}
