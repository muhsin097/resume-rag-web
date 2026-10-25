import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable } from '../_components/comparison-table';
import { ProsList } from '../_components/pros-list';
import { CompareCta } from '../_components/compare-cta';

export const metadata: Metadata = {
  title: 'Cease to Resume vs Enhancv',
  description:
    'A factual comparison of Cease to Resume and Enhancv: both claim fact-grounded AI -- here is where they actually differ, on free-tier structure, scope, and audience.',
  alternates: { canonical: '/compare/enhancv' },
};

export default function CompareEnhancvPage() {
  return (
    <main className="flex-1" style={{ background: 'var(--background)' }}>
      <div className="mx-auto max-w-3xl space-y-10 px-6 py-12">
        <Link href="/" className="link text-sm">
          &larr; Back to home
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Cease to Resume vs Enhancv</h1>
          <p className="text-base muted">
            Enhancv is the closest of the tools we compare ourselves to -- it also tailors a resume to a
            specific job description and also claims its AI sticks to your real experience rather than
            inventing content. We won&apos;t pretend otherwise: on fact-grounding specifically, the two
            products make the same promise. The real differences are elsewhere -- what the free tier
            actually gives you, who each product targets, and what happens after you&apos;re done.
          </p>
        </header>

        <section className="card-muted">
          <p className="text-sm">
            <strong>Quick take:</strong> Enhancv is built for senior/executive job seekers who want a
            polished, premium-feeling tool with interview prep, LinkedIn coaching, and a job tracker built
            in -- and are fine paying for all of it. Cease to Resume is a narrower, free-first tool: tailor a
            resume, see your match score, get a shareable page. If you want the fuller career-management
            suite, Enhancv does more. If you want to try tailoring without a trial clock running, we do.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Feature comparison</h2>
          <ComparisonTable
            competitor="Enhancv"
            rows={[
              {
                feature: 'Free tier',
                us: '2 full tailored generations, no card required, no expiry',
                them: '7-day trial only -- not an ongoing free tier, capped at 12 items, watermarked',
              },
              {
                feature: 'Paid pricing',
                us: 'Prepaid credit packs, pay only for what you use',
                them: '~$16.50-39/mo depending on billing term',
              },
              {
                feature: 'How content is written',
                us: 'Retrieves and rephrases facts already in your profile -- never invents an employer, skill, or achievement',
                them: 'Also claims AI is "built from your real experience only," and uses a placeholder instead of inventing missing numbers',
              },
              {
                feature: 'Job-description match scoring',
                us: 'Keyword coverage (%) + a separate holistic fit score, with exactly which keywords are missing',
                them: 'One-click JD tailoring + a 27-point ATS/format checker',
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
                feature: 'Target audience',
                us: 'General job seekers',
                them: 'Explicitly positioned for senior/executive professionals',
              },
              {
                feature: 'Job tracker, mock interviews, LinkedIn coach',
                us: 'Not offered',
                them: 'Yes, all three',
              },
            ]}
          />
          <p className="text-xs muted">Pricing and features as of October 2026 -- check enhancv.com for current numbers.</p>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <ProsList
            title="Where Enhancv is better"
            items={[
              'A full career-management suite: job tracker, mock interviews, LinkedIn coaching',
              'A 27-point automated formatting/style checker',
              'Polished, design-forward templates built for senior roles',
              'Chrome extension to capture job postings directly',
            ]}
          />
          <ProsList
            accent
            title="Where Cease to Resume is better"
            items={[
              'An ongoing free tier -- not a 7-day trial that ends regardless of whether you’ve finished',
              'No item caps or watermarking on the free tier',
              'A public portfolio page with evidence-ranked skills -- not offered by Enhancv',
              'Recruiters can discover you directly, if you opt in',
            ]}
          />
        </div>

        <CompareCta competitor="Enhancv" />
      </div>
    </main>
  );
}
