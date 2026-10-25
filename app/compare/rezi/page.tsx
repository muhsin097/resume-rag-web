import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable } from '../_components/comparison-table';
import { ProsList } from '../_components/pros-list';
import { CompareCta } from '../_components/compare-cta';

export const metadata: Metadata = {
  title: 'Cease to Resume vs Rezi',
  description:
    'A factual comparison of Cease to Resume and Rezi: pricing, free-tier limits, fact-grounding, and what each tool actually does well.',
  alternates: { canonical: '/compare/rezi' },
};

export default function CompareReziPage() {
  return (
    <main className="flex-1" style={{ background: 'var(--background)' }}>
      <div className="mx-auto max-w-3xl space-y-10 px-6 py-12">
        <Link href="/" className="link text-sm">
          &larr; Back to home
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Cease to Resume vs Rezi</h1>
          <p className="text-base muted">
            Rezi is one of the best-known AI resume builders, with a large template library and features
            like mock interviews and cover letters that we don&apos;t have. The real differences come down to
            how each tool generates content, what the free tier actually includes, and whether you get a
            shareable page recruiters can find on their own.
          </p>
        </header>

        <section className="card-muted">
          <p className="text-sm">
            <strong>Quick take:</strong> if you want one tool that also handles mock interview practice,
            cover letters, and resignation letters, Rezi does more at once. If you want a resume built
            strictly from facts you actually provided, scored against a specific job description, with a
            public page you can share -- that&apos;s what Cease to Resume is built around.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Feature comparison</h2>
          <ComparisonTable
            competitor="Rezi"
            rows={[
              {
                feature: 'Free tier',
                us: '2 full tailored generations, no card required, ongoing (not time-boxed)',
                them: '1 resume, 3 PDF downloads total (lifetime cap, not monthly)',
              },
              {
                feature: 'Paid pricing',
                us: 'Prepaid credit packs, pay only for what you use',
                them: '$29/mo (Pro), or $149 one-time (Lifetime)',
              },
              {
                feature: 'How content is written',
                us: 'Retrieves and rephrases facts already in your profile -- never invents an employer, skill, or achievement',
                them: 'AI "refines" your input, but this isn’t enforced as a hard constraint',
              },
              {
                feature: 'Job-description match scoring',
                us: 'Keyword coverage (%) + a separate holistic fit score, with exactly which keywords are missing',
                them: 'Rezi Score + Resume Keyword Scanner',
              },
              {
                feature: 'Shareable public portfolio page',
                us: 'Yes -- evidence-ranked skills showing which roles actually used them',
                them: 'Not offered',
              },
              {
                feature: 'Recruiter-facing candidate search',
                us: 'Yes -- recruiters can discover candidates who opt in',
                them: 'Not offered (job-seeker only)',
              },
              {
                feature: 'Mock interview practice',
                us: 'Not offered',
                them: 'Yes',
              },
              {
                feature: 'Cover letter / resignation letter generator',
                us: 'Not offered',
                them: 'Yes',
              },
              {
                feature: 'Template library',
                us: 'One clean, ATS-friendly layout',
                them: 'Large library, including an expert-review add-on',
              },
            ]}
          />
          <p className="text-xs muted">Pricing and features as of October 2026 -- check rezi.ai for current numbers.</p>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <ProsList
            title="Where Rezi is better"
            items={[
              'Mock interview practice built in',
              'Cover letter and resignation letter generators',
              'Much larger template library and brand recognition',
              'Optional human expert review of your resume',
            ]}
          />
          <ProsList
            accent
            title="Where Cease to Resume is better"
            items={[
              'Free tier is ongoing and credit-based, not a 3-download lifetime cap',
              'Content is retrieved from facts you entered, not freely generated',
              'A public portfolio page with evidence-ranked skills -- not offered by Rezi',
              'Recruiters can discover you directly, if you opt in',
            ]}
          />
        </div>

        <section className="space-y-2 text-sm">
          <h2 className="font-semibold">On fact-grounding</h2>
          <p className="muted">
            We built Cease to Resume around a hard constraint: the AI can only rephrase and reorder facts
            already in your profile, never invent new ones. Rezi&apos;s own site describes its AI as
            &quot;refining&quot; your input, but per independent third-party testing (
            <a
              href="https://atsverification.com/blog/ai-resume-builders-tested-2026/"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              AI Resume Builders Tested 2026
            </a>
            ), Rezi&apos;s Keyword Targeting feature fabricated a specific accomplishment that wasn&apos;t in the
            source resume, and the fabricated version still scored well on Rezi&apos;s own ATS check. We
            haven&apos;t verified that test ourselves, but it&apos;s consistent with the difference in how the two
            tools are built: a soft policy versus a structural constraint.
          </p>
        </section>

        <CompareCta competitor="Rezi" />
      </div>
    </main>
  );
}
