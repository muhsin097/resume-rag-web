import { apiFetch, isApiUnavailable } from '@/lib/api';
import { ApiDownMessage } from '../../../components/api-down';
import { SearchForm } from './search-form';

export const instant = false;

export default async function RecruiterSearchPage() {
  let meRes;
  try {
    meRes = await apiFetch('/recruiter/me');
  } catch (err) {
    if (isApiUnavailable(err)) return <ApiDownMessage />;
    throw err;
  }
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
