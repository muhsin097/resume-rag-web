'use client';

import { useState } from 'react';
import { Brand } from '../components/brand';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    // Same message shown whether or not the email is registered -- the
    // API already guarantees this, this page just doesn't add a new way
    // to tell the two cases apart (e.g. by varying copy on failure).
    setSubmitting(false);
    setSent(true);
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

        <div className="card space-y-4">
          <h1 className="text-xl font-semibold">Reset your password</h1>

          {sent ? (
            <p className="text-sm">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a link
              to reset your password. It expires in 1 hour.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                {submitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          )}

          <p className="text-sm muted">
            <a href="/login" className="link">
              Back to log in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
