import { SearchForm } from './search-form';

export default function RecruiterSearchPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-lg font-semibold">Find candidates</h1>
      <SearchForm />
    </div>
  );
}
