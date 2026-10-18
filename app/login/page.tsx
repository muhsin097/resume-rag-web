'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Brand } from '../components/brand';
import { GoogleButton } from '../components/google-button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setSubmitting(false);

    if (result?.error) {
      setError('Invalid email or password.');
      return;
    }

    router.push('/dashboard/profile');
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
          <h1 className="text-xl font-semibold">Log in</h1>

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

          <p className="text-sm">
            <a href="/forgot-password" className="link">
              Forgot password?
            </a>
          </p>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? 'Logging in...' : 'Log in'}
          </button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1" style={{ background: 'var(--border-color)' }} />
            <span className="text-xs muted">or</span>
            <span className="h-px flex-1" style={{ background: 'var(--border-color)' }} />
          </div>

          <GoogleButton provider="google-candidate" callbackUrl="/dashboard/profile" />

          <p className="text-sm muted">
            No account?{' '}
            <a href="/register" className="link">
              Register
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
