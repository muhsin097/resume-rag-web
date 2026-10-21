// Minimal shape for Razorpay's Checkout.js global, loaded at runtime from
// https://checkout.razorpay.com/v1/checkout.js (not an npm package -- this
// just types the subset of the API this app actually calls).
interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  prefill?: { email?: string; name?: string };
  theme?: { color?: string };
  handler?: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayCheckoutInstance {
  open(): void;
  on(event: 'payment.failed', handler: (response: { error: { description: string } }) => void): void;
}

interface Window {
  Razorpay?: {
    new (options: RazorpayCheckoutOptions): RazorpayCheckoutInstance;
  };
}
