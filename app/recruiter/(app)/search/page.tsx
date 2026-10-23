import { apiFetchJson, isApiUnavailable } from '@/lib/api';
import { ApiDownMessage } from '../../../components/api-down';
import { SearchForm } from './search-form';

export const instant = false;

interface Me {
  creditsRemaining: number;
}

export default async function RecruiterSearchPage() {
  let me: Me;
  try {
    me = await apiFetchJson<Me>('/recruiter/me');
  } catch (err) {
    if (isApiUnavailable(err)) return <ApiDownMessage />;
    throw err;
  }

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
