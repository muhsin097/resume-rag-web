import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Compare Cease to Resume',
  description:
    'How Cease to Resume compares to Rezi, Teal, Kickresume, Enhancv, and Jobscan -- pricing, fact-grounding, and what each tool actually does.',
  alternates: { canonical: '/compare' },
};

const COMPARISONS = [
  { slug: 'rezi', name: 'Rezi', blurb: 'AI resume builder with mock interviews and cover letters.' },
  { slug: 'teal', name: 'Teal', blurb: 'Job-application tracker with a resume builder bolted on.' },
  { slug: 'kickresume', name: 'Kickresume', blurb: 'Large template library; AI that can write from scratch.' },
  { slug: 'enhancv', name: 'Enhancv', blurb: 'Premium, senior-focused suite with a 7-day free trial.' },
  { slug: 'jobscan', name: 'Jobscan', blurb: 'Scans and scores a resume you already wrote.' },
] as const;

export default function ComparePage() {
  return (
    <main className="flex-1" style={{ background: 'var(--background)' }}>
      <div className="mx-auto max-w-3xl space-y-8 px-6 py-12">
        <Link href="/" className="link text-sm">
          &larr; Back to home
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Compare Cease to Resume</h1>
          <p className="text-base muted">
            Honest, fact-checked comparisons against five other resume tools -- what each one actually does
            well, where Cease to Resume is different, and current pricing. No tool here is a straw man; each
            page names real strengths the competitor has that we don&apos;t.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          {COMPARISONS.map((c) => (
            <Link key={c.slug} href={`/compare/${c.slug}`} className="card space-y-1 transition-colors hover:border-[var(--accent)]">
              <p className="font-semibold">Cease to Resume vs {c.name}</p>
              <p className="text-sm muted">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
