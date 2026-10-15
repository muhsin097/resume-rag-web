'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Brand } from '../../../components/brand';

export default function RecruiterLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn('recruiter', {
      email,
      password,
      redirect: false,
    });

    setSubmitting(false);

    if (result?.error) {
      setError('Invalid email or password.');
      return;
    }

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
          <h1 className="text-xl font-semibold">Recruiter log in</h1>

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
            {submitting ? 'Logging in...' : 'Log in'}
          </button>

          <p className="text-sm muted">
            No account?{' '}
            <a href="/recruiter/register" className="link">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
