'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Brand } from '../components/brand';
import { GoogleButton } from '../components/google-button';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!registerResponse.ok) {
      const data = await registerResponse.json().catch(() => null);
      setSubmitting(false);
      setError(data?.message ?? 'Could not create account.');
      return;
    }

    // Account now exists, but can't log in yet -- it's unverified until
    // the OTP emailed to them is entered, so there's no session to start
    // here. The actual sign-in happens once /verify-email succeeds.
    setSubmitting(false);
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <main
      className="flex flex-1 items-center justify-center p-8"
      style={{ background: 'var(--background)' }}
    >
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Brand size="lg" />
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <h1 className="text-xl font-semibold">Create an account</h1>

          <label className="block space-y-1">
            <span className="text-sm muted">Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm muted">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm muted">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1" style={{ background: 'var(--border-color)' }} />
            <span className="text-xs muted">or</span>
            <span className="h-px flex-1" style={{ background: 'var(--border-color)' }} />
          </div>

          <GoogleButton provider="google-candidate" callbackUrl="/dashboard/profile" />

          <p className="text-sm muted">
            Already have an account?{' '}
            <a href="/login" className="link">
              Log in
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
