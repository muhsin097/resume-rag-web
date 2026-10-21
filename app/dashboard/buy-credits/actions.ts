'use server';

import { apiFetch } from '@/lib/api';

export type CreditPack = 'STARTER' | 'JOB_SEARCH' | 'INTENSIVE';

export interface CreateOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  pack: CreditPack;
  credits: number;
}

// The backend (CREDIT_PACKS in resume-rag-api) is the sole source of truth
// for price/credits -- this call always re-derives both from the pack name
// server-side, never trusting anything the client sends beyond which pack
// was picked.
export async function createOrder(pack: CreditPack): Promise<CreateOrderResult> {
  const response = await apiFetch('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ pack }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? 'Could not start checkout.');
  }
  return response.json();
}
