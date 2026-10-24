'use client';

import { useState } from 'react';

// A small interactive island inside an otherwise-cached/static page --
// submits straight to a same-origin Next.js route handler (never the Nest
// API directly), which forwards to the public, rate-limited
// POST /portfolio/:slug/leads endpoint server-to-server. Always rendered
// expanded (no collapsed toggle) -- it's the page's dedicated closing
// contact section now, not a floating widget.
export function LeadForm({ slug }: { slug: string }) {
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
      <div className="contact-sent">
        <p className="font-medium">Sent!</p>
        <p className="text-sm muted">They&apos;ll be notified and can reach out to you directly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="contact-field-row">
        <label className="block">
          <span className="contact-label">Name</span>
          <input type="text" name="visitorName" placeholder="Your name" className="contact-input" />
        </label>
        <label className="block">
          <span className="contact-label">Email</span>
          <input type="email" name="visitorEmail" required placeholder="you@example.com" className="contact-input" />
        </label>
      </div>
      <label className="block">
        <span className="contact-label">Message (optional)</span>
        <textarea
          name="message"
          rows={4}
          placeholder="What's the opportunity? Role, timeline, and why you're reaching out."
          className="contact-input"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="contact-send-row">
        <button type="submit" disabled={status === 'submitting'} className="contact-send-btn">
          {status === 'submitting' ? '...' : 'Send'}
        </button>
        <p className="max-w-[14rem] text-sm muted">
          No forms into the void -- this reaches their dashboard and inbox directly.
        </p>
      </div>
    </form>
  );
}
