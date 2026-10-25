import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable } from '../_components/comparison-table';
import { ProsList } from '../_components/pros-list';
import { CompareCta } from '../_components/compare-cta';

export const metadata: Metadata = {
  title: 'Cease to Resume vs Teal',
  description:
    'A factual comparison of Cease to Resume and Teal: job-application tracking vs resume tailoring, pricing, and fact-grounding.',
  alternates: { canonical: '/compare/teal' },
};

export default function CompareTealPage() {
  return (
    <main className="flex-1" style={{ background: 'var(--background)' }}>
      <div className="mx-auto max-w-3xl space-y-10 px-6 py-12">
        <Link href="/" className="link text-sm">
          &larr; Back to home
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Cease to Resume vs Teal</h1>
          <p className="text-base muted">
            Teal is primarily a job-application tracker -- a Chrome extension that saves jobs from LinkedIn
            and Indeed and tracks your pipeline -- with an AI resume builder as a secondary feature. Cease to
            Resume is the opposite: a resume-tailoring tool first, with no tracking dashboard at all. Which
            one fits depends on whether your bottleneck is staying organized across applications, or getting
            each individual resume right.
          </p>
        </header>

        <section className="card-muted">
          <p className="text-sm">
            <strong>Quick take:</strong> if you&apos;re applying to dozens of jobs and need to track where you
            stand with each one, Teal&apos;s tracker is a real, distinct feature we don&apos;t have. If what you need
            is a resume rewritten in a specific job posting&apos;s language with nothing invented, that&apos;s the
            part Teal treats as secondary and we treat as the whole product.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Feature comparison</h2>
          <ComparisonTable
            competitor="Teal"
            rows={[
              {
                feature: 'Core focus',
                us: 'Resume tailoring against a specific job description',
                them: 'Job-application tracking (Chrome extension, pipeline/status board)',
              },
              {
                feature: 'Free tier',
                us: '2 full tailored generations, no card required',
                them: 'Unlimited tracking + basic builder; job-match score and unlimited AI rewrites are paid-only',
              },
              {
                feature: 'Paid pricing',
                us: 'Prepaid credit packs, pay only for what you use',
                them: 'Teal+: $29/mo, $13/week, or $79/quarter',
              },
              {
                feature: 'How content is written',
                us: 'Retrieves and rephrases facts already in your profile -- never invents an employer, skill, or achievement',
                them: 'AI bullet rewriter and cover letter generator write more freely from your input',
              },
              {
                feature: 'Job-description match scoring',
                us: 'Keyword coverage (%) + a separate holistic fit score, with exactly which keywords are missing',
                them: 'Numeric job-match score (Teal+ only)',
              },
              {
                feature: 'Shareable public portfolio page',
                us: 'Yes -- evidence-ranked skills showing which roles actually used them',
                them: 'Not offered',
              },
              {
                feature: 'Recruiter-facing candidate search',
                us: 'Yes -- recruiters can discover candidates who opt in',
                them: 'Not offered',
              },
              {
                feature: 'Application tracking dashboard',
                us: 'Not offered',
                them: 'Yes -- auto-saves jobs from job boards, tracks status/follow-ups',
              },
            ]}
          />
          <p className="text-xs muted">Pricing and features as of October 2026 -- check tealhq.com for current numbers.</p>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <ProsList
            title="Where Teal is better"
            items={[
              'A real job-application tracking dashboard -- we have nothing like it',
              'Chrome extension that auto-saves postings from LinkedIn, Indeed, etc.',
              'More generous free tier specifically for tracking (not resume generation)',
            ]}
          />
          <ProsList
            accent
            title="Where Cease to Resume is better"
            items={[
              'Content is retrieved from facts you entered, not freely generated',
              'Full tailored generations are free from day one, not gated behind a subscription',
              'A public portfolio page with evidence-ranked skills -- not offered by Teal',
              'Recruiters can discover you directly, if you opt in',
            ]}
          />
        </div>

        <section className="space-y-2 text-sm">
          <h2 className="font-semibold">On fact-grounding</h2>
          <p className="muted">
            Cease to Resume&apos;s AI can only rephrase and reorder facts already in your profile -- it can&apos;t
            add an employer, skill, or number you didn&apos;t provide. Independent reviews of Teal have
            documented the opposite problem: one review found Teal&apos;s bullet rewriter inventing timeframes
            not present in the source resume, and its cover letter generator fabricating &quot;18 months of
            GitHub Copilot and Claude experience&quot; to paper over a skills gap (
            <a
              href="https://www.jobshinobi.com/blog/how-to-write-resume-bullet-points-with-ai-without-lying"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              source
            </a>
            ). We haven&apos;t verified that review ourselves, but it illustrates the actual difference: a tool
            that generates freely versus one that&apos;s structurally limited to your own documented facts.
          </p>
        </section>

        <CompareCta competitor="Teal" />
      </div>
    </main>
  );
}
