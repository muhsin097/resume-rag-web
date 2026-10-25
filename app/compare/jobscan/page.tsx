import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable } from '../_components/comparison-table';
import { ProsList } from '../_components/pros-list';
import { CompareCta } from '../_components/compare-cta';

export const metadata: Metadata = {
  title: 'Cease to Resume vs Jobscan',
  description:
    'A factual comparison of Cease to Resume and Jobscan: a resume scanner that scores what you already wrote vs a tool that writes the tailored draft for you.',
  alternates: { canonical: '/compare/jobscan' },
};

export default function CompareJobscanPage() {
  return (
    <main className="flex-1" style={{ background: 'var(--background)' }}>
      <div className="mx-auto max-w-3xl space-y-10 px-6 py-12">
        <Link href="/" className="link text-sm">
          &larr; Back to home
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Cease to Resume vs Jobscan</h1>
          <p className="text-base muted">
            Jobscan and Cease to Resume solve adjacent but different problems. Jobscan is a scanner: you
            upload a resume you&apos;ve already written, paste a job description, and it scores the match and
            tells you what&apos;s missing -- you then go edit the resume yourself. Cease to Resume generates the
            tailored draft directly from facts in your profile. One tells you what to fix; the other does
            the rewriting.
          </p>
        </header>

        <section className="card-muted">
          <p className="text-sm">
            <strong>Quick take:</strong> if you already have a resume you like and just want to check it
            against a specific posting (or you need their auto-apply and LinkedIn-optimization tools),
            Jobscan&apos;s scan-and-suggest workflow is genuinely useful. If you want the tailored version
            written for you, starting from your actual documented experience, that&apos;s what we do instead.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Feature comparison</h2>
          <ComparisonTable
            competitor="Jobscan"
            rows={[
              {
                feature: 'Core workflow',
                us: 'Generates a fully tailored resume draft from your profile',
                them: 'Scores a resume you already wrote and suggests edits -- you do the rewriting',
              },
              {
                feature: 'Free tier',
                us: '2 full tailored generations, no card required',
                them: '5 scans/month, ongoing free tier',
              },
              {
                feature: 'Paid pricing',
                us: 'Prepaid credit packs, pay only for what you use',
                them: '$49.95/mo, or $89.95/quarter (~$29.98/mo)',
              },
              {
                feature: 'How content is written',
                us: 'Retrieves and rephrases facts already in your profile -- never invents an employer, skill, or achievement',
                them: 'AI optimization suggestions rewrite more freely; no stated grounding guarantee',
              },
              {
                feature: 'Job-description match scoring',
                us: 'Keyword coverage (%) + a separate holistic fit score, with exactly which keywords are missing',
                them: 'ATS match-rate score across 5 criteria, with the ATS platform detected (iCIMS, Lever, etc.)',
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
                feature: 'Auto-apply, job tracker, LinkedIn optimizer',
                us: 'Not offered',
                them: 'Yes, all three',
              },
            ]}
          />
          <p className="text-xs muted">
            Pricing and features as of October 2026, cross-checked across multiple third-party sources since
            Jobscan&apos;s own pricing page didn&apos;t return readable content on request -- check jobscan.co for
            current numbers.
          </p>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <ProsList
            title="Where Jobscan is better"
            items={[
              'Detects the specific ATS platform (iCIMS, Lever, Greenhouse, etc.) and scores against it',
              'Auto-apply -- submits applications on your behalf',
              'A job-application tracker and LinkedIn profile optimizer',
              'Useful if you already have a resume you like and just want it checked',
            ]}
          />
          <ProsList
            accent
            title="Where Cease to Resume is better"
            items={[
              'Writes the tailored draft for you, instead of leaving the editing to you',
              'Content is retrieved from facts you entered, not freely generated suggestions',
              'A public portfolio page with evidence-ranked skills -- not offered by Jobscan',
              'Recruiters can discover you directly, if you opt in',
            ]}
          />
        </div>

        <CompareCta competitor="Jobscan" />
      </div>
    </main>
  );
}
