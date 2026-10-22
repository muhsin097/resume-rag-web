'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder, getOrderStatus, type CreditPack } from './actions';

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Polls for up to ~15s (10 tries, 1.5s apart) -- the webhook usually lands
// within a second or two, but this doesn't claim success until the order
// is actually confirmed PAID server-side, never on a blind timeout guess.
const POLL_ATTEMPTS = 10;
const POLL_INTERVAL_MS = 1500;

type Status = 'idle' | 'loading' | 'confirming' | 'success' | 'delayed' | 'error';

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
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [creditsAdded, setCreditsAdded] = useState<number | null>(null);

  async function confirmPurchase(orderId: string) {
    setStatus('confirming');
    for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
      await sleep(POLL_INTERVAL_MS);
      try {
        const order = await getOrderStatus(orderId);
        if (order.status === 'PAID') {
          setCreditsAdded(order.credits);
          setStatus('success');
          router.refresh();
          // Back to a normal "Buy" button after a few seconds, so another
          // purchase is still possible without a page reload.
          setTimeout(() => setStatus('idle'), 4000);
          return;
        }
        if (order.status === 'FAILED') {
          setStatus('error');
          setError('Payment failed. You have not been charged.');
          return;
        }
      } catch {
        // A transient check failure isn't itself a failed purchase --
        // keep polling rather than giving up on one bad request.
      }
    }
    // Genuinely still pending after ~15s -- rare (webhook delay, Razorpay
    // retry backoff), but don't claim success we haven't confirmed.
    setStatus('delayed');
  }

  async function handleClick() {
    setStatus('loading');
    setError(null);
    setCreditsAdded(null);
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
        // Credits are only actually granted server-side once our webhook
        // verifies the payment with Razorpay directly -- this handler
        // just kicks off polling for that confirmation, it never grants
        // anything itself.
        handler: () => {
          void confirmPurchase(order.orderId);
        },
        modal: {
          ondismiss: () => setStatus((s) => (s === 'loading' ? 'idle' : s)),
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
        disabled={status === 'loading' || status === 'confirming'}
        className={status === 'success' ? 'btn-primary w-full bg-green-600 hover:bg-green-600' : 'btn-primary w-full'}
      >
        {status === 'loading' && 'Starting checkout...'}
        {status === 'confirming' && 'Confirming payment...'}
        {status === 'success' && `✓ ${creditsAdded} credits added!`}
        {status === 'delayed' && 'Buy ' + label}
        {(status === 'idle' || status === 'error') && `Buy ${label}`}
      </button>
      {status === 'delayed' && (
        <p className="text-xs text-amber-700">
          Payment received -- your credits are taking a little longer than usual to appear.
          They&apos;ll show up shortly; refresh if they don&apos;t.
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
