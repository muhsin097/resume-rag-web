'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Brand } from '../../../components/brand';
import { GoogleButton } from '../../../components/google-button';

export default function RecruiterRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const registerResponse = await fetch('/api/recruiter-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, companyName, email, password }),
    });

    if (!registerResponse.ok) {
      const data = await registerResponse.json().catch(() => null);
      setSubmitting(false);
      setError(data?.message ?? 'Could not create account.');
      return;
    }

    await signIn('recruiter', { email, password, redirect: false });
    setSubmitting(false);
    router.push('/recruiter/search');
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
          <h1 className="text-xl font-semibold">Recruiter sign up</h1>

          <label className="block space-y-1">
            <span className="text-sm muted">Your name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm muted">Company</span>
            <input
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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

          <GoogleButton provider="google-recruiter" callbackUrl="/recruiter/search" />

          <p className="text-sm muted">
            Already have an account?{' '}
            <a href="/recruiter/login" className="link">
              Log in
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
