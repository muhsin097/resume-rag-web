'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder, type CreditPack } from './actions';

// Loaded on demand (not in <head> globally) -- most visits to the app
// never touch checkout, no reason to pull in Razorpay's script on every
// page. Cached after the first load since the script defines window.Razorpay
// once and doesn't need reloading for a second purchase in the same visit.
function loadRazorpayScript(): Promise<void> {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load the payment widget.'));
    document.body.appendChild(script);
  });
}

export function BuyButton({
  pack,
  label,
  email,
  name,
}: {
  pack: CreditPack;
  label: string;
  email: string;
  name: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setStatus('loading');
    setError(null);
    try {
      const [order] = await Promise.all([createOrder(pack), loadRazorpayScript()]);
      if (!window.Razorpay) throw new Error('Could not load the payment widget.');

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Cease to Resume',
        description: `${label} -- ${order.credits} generations`,
        prefill: { email, name },
        theme: { color: '#6D28D9' },
        // The payment is only actually granted server-side once our
        // webhook verifies it with Razorpay directly (see
        // PaymentsService.handleWebhook) -- this handler is UX feedback
        // for the person waiting, not what credits the account. Refresh
        // after a short delay to give the webhook time to land; worst
        // case they see the old balance for a few seconds and can
        // refresh again themselves.
        handler: () => {
          setStatus('processing');
          setTimeout(() => router.refresh(), 2500);
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      });
      razorpay.on('payment.failed', () => {
        setStatus('error');
        setError('Payment failed. You have not been charged.');
      });
      razorpay.open();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Could not start checkout.');
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'loading' || status === 'processing'}
        className="btn-primary w-full"
      >
        {status === 'loading' && 'Starting checkout...'}
        {status === 'processing' && 'Payment received -- crediting your account...'}
        {(status === 'idle' || status === 'error') && `Buy ${label}`}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
