'use client';

import { useState } from 'react';

// A small interactive island inside an otherwise-cached/static page --
// submits straight to a same-origin Next.js route handler (never the Nest
// API directly), which forwards to the public, rate-limited
// POST /portfolio/:slug/leads endpoint server-to-server.
export function LeadForm({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      visitorEmail: String(formData.get('visitorEmail') ?? ''),
      visitorName: String(formData.get('visitorName') ?? '') || undefined,
      message: String(formData.get('message') ?? '') || undefined,
    };

    try {
      const res = await fetch(`/api/portfolio-leads/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? 'Could not send -- try again in a moment.');
      }
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Could not send -- try again in a moment.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="card-muted text-sm">
        <p className="font-medium">Sent!</p>
        <p className="muted">They&apos;ll be notified and can reach out to you directly.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-primary">
        Interested in discussing an opportunity?
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <div>
        <p className="font-medium">Get in touch</p>
        <p className="text-sm muted">Leave your email and they&apos;ll be notified right away.</p>
      </div>
      <label className="block space-y-1">
        <span className="text-sm muted">Your email</span>
        <input type="email" name="visitorEmail" required className="input" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm muted">Your name (optional)</span>
        <input type="text" name="visitorName" className="input" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm muted">Message (optional)</span>
        <textarea name="message" rows={3} className="input" />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === 'submitting'} className="btn-primary">
          {status === 'submitting' ? 'Sending...' : 'Send'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="link text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}
