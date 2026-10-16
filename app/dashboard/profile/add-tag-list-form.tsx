'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addTagItems } from './actions';

// Shared by Skills and Languages -- both are short, one-line facts added
// in a batch via a comma/newline-separated textarea rather than a form per
// entry.
export function AddTagListForm({
  type,
  label,
  placeholder,
}: {
  type: 'SKILL' | 'LANGUAGE';
  label: string;
  placeholder: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const titles = value
      .split(/[,\n]/)
      .map((title) => title.trim())
      .filter(Boolean);
    if (titles.length === 0) return;

    setSaving(true);
    setError(null);
    try {
      await addTagItems(type, titles);
      setValue('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-2">
      <label className="block space-y-1">
        <span className="text-sm muted">{label}</span>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={2}
          placeholder={placeholder}
          className="input"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}
