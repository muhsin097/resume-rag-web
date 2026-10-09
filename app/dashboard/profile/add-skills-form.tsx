'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addSkills } from './actions';

export function AddSkillsForm() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const skills = value
      .split(/[,\n]/)
      .map((skill) => skill.trim())
      .filter(Boolean);
    if (skills.length === 0) return;

    setSaving(true);
    setError(null);
    try {
      await addSkills(skills);
      setValue('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save skills.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-2">
      <label className="block space-y-1">
        <span className="text-sm muted">
          Skills (comma or newline separated)
        </span>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={2}
          placeholder="Kubernetes, AWS, Terraform, Node.js, TypeScript"
          className="input"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? 'Adding...' : 'Add skills'}
      </button>
    </form>
  );
}
