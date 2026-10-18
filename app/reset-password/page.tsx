'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Brand } from '../components/brand';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    setSubmitting(false);
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.message ?? 'Could not reset password.');
      return;
    }
    setDone(true);
  }

  if (!token) {
    return (
      <p className="text-sm text-red-600">
        This reset link is missing its token.{' '}
        <a href="/forgot-password" className="link">
          Request a new one
        </a>
        .
      </p>
    );
  }

  if (done) {
    return (
      <div className="space-y-3">
        <p className="text-sm">Your password has been updated.</p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="btn-primary w-full"
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-1">
        <span className="text-sm muted">New password</span>
        <input
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Updating...' : 'Update password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main
      className="flex flex-1 items-center justify-center p-8"
      style={{ background: 'var(--background)' }}
    >
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Brand size="lg" />
        </div>

        <div className="card space-y-4">
          <h1 className="text-xl font-semibold">Set a new password</h1>
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
