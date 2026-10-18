'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Brand } from '../components/brand';

async function requestCode(email: string) {
  await fetch('/api/resend-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  // Registration already triggered the first send -- only an explicit
  // "resend" (or arriving here without a fresh registration) needs to
  // ask the API again.
  const [emailSubmitted, setEmailSubmitted] = useState(Boolean(searchParams.get('email')));
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await requestCode(email);
    setSubmitting(false);
    setEmailSubmitted(true);
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn('verify-email', { email, code, redirect: false });
    setSubmitting(false);

    if (result?.error) {
      setError('That code is incorrect or has expired.');
      return;
    }

    router.push('/dashboard/profile');
  }

  async function handleResend() {
    setResendMessage(null);
    await requestCode(email);
    setResendMessage('A new code has been sent.');
  }

  if (!emailSubmitted) {
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <p className="text-sm muted">Enter your email to get a verification code.</p>
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
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Sending...' : 'Send code'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleCodeSubmit} className="space-y-4">
      <p className="text-sm">
        Enter the 6-digit code sent to <strong>{email}</strong>.
      </p>

      <label className="block space-y-1">
        <span className="text-sm muted">Verification code</span>
        <input
          type="text"
          inputMode="numeric"
          required
          minLength={6}
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="input text-center text-lg tracking-widest"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {resendMessage && <p className="text-sm muted">{resendMessage}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Verifying...' : 'Verify'}
      </button>

      <button type="button" onClick={handleResend} className="link text-sm">
        Resend code
      </button>
    </form>
  );
}

export default function VerifyEmailPage() {
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
          <h1 className="text-xl font-semibold">Verify your email</h1>
          <Suspense fallback={null}>
            <VerifyEmailForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
