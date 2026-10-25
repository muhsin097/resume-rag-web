import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable } from '../_components/comparison-table';
import { ProsList } from '../_components/pros-list';
import { CompareCta } from '../_components/compare-cta';

export const metadata: Metadata = {
  title: 'Cease to Resume vs Kickresume',
  description:
    'A factual comparison of Cease to Resume and Kickresume: AI that writes from scratch vs AI that only rephrases your real experience.',
  alternates: { canonical: '/compare/kickresume' },
};

export default function CompareKickresumePage() {
  return (
    <main className="flex-1" style={{ background: 'var(--background)' }}>
      <div className="mx-auto max-w-3xl space-y-10 px-6 py-12">
        <Link href="/" className="link text-sm">
          &larr; Back to home
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Cease to Resume vs Kickresume</h1>
          <p className="text-base muted">
            Kickresume has one of the largest template libraries in the category, plus a personal-website
            builder, mobile apps, and a career-map tool. The core difference is how each tool&apos;s AI
            actually works: Kickresume&apos;s AI Resume Writer can generate a full first draft from just your
            name and job title. Cease to Resume&apos;s AI only rephrases facts you&apos;ve already added -- it
            can&apos;t write a resume for someone who hasn&apos;t told it anything yet, by design.
          </p>
        </header>

        <section className="card-muted">
          <p className="text-sm">
            <strong>Quick take:</strong> if you want a large choice of designs and don&apos;t mind the AI filling
            in gaps on your behalf, Kickresume gives you more to work with visually. If you want every line
            traceable back to something you actually did, that&apos;s the tradeoff Cease to Resume is built
            around.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Feature comparison</h2>
          <ComparisonTable
            competitor="Kickresume"
            rows={[
              {
                feature: 'Free tier',
                us: '2 full tailored generations, no card required -- includes the AI writer',
                them: '4 templates, unlimited downloads, but no AI writer and no ATS checker',
              },
              {
                feature: 'Paid pricing',
                us: 'Prepaid credit packs, pay only for what you use',
                them: '$4-9/mo (Premium, depending on billing term)',
              },
              {
                feature: 'How content is written',
                us: 'Retrieves and rephrases facts already in your profile -- never invents an employer, skill, or achievement',
                them: 'Their AI writer generates a full first draft from just a name and job title ("the entire first draft")',
              },
              {
                feature: 'Job-description match scoring',
                us: 'Keyword coverage (%) + a separate holistic fit score, with exactly which keywords are missing',
                them: 'Separate "Resume Tailoring" tool -- not confirmed to include a match score',
              },
              {
                feature: 'Shareable public page',
                us: 'Evidence-ranked skills showing which specific roles actually used them',
                them: 'Personal-website builder (template-based, not evidence-ranked)',
              },
              {
                feature: 'Recruiter-facing candidate search',
                us: 'Yes -- recruiters can discover candidates who opt in',
                them: 'Not offered',
              },
              {
                feature: 'Template / design library',
                us: 'One clean, ATS-friendly layout',
                them: '40+ templates, 7 website templates',
              },
              {
                feature: 'Cover letters, mobile apps, student discount',
                us: 'Not offered',
                them: 'Yes, all three',
              },
            ]}
          />
          <p className="text-xs muted">Pricing and features as of October 2026 -- check kickresume.com for current numbers.</p>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row">
          <ProsList
            title="Where Kickresume is better"
            items={[
              'Much larger template and design library, including a website builder',
              'Cover letter generator, mobile apps, and a career-map tool',
              'Student discounts via ISIC/ITIC/UNiDAYS',
              'Cheaper entry-level paid plan',
            ]}
          />
          <ProsList
            accent
            title="Where Cease to Resume is better"
            items={[
              'AI only rephrases facts you provided -- it can’t generate a draft from nothing',
              'A job-description keyword match score built into every generation',
              'Evidence-ranked skills on your public page, not just a template',
              'Recruiters can discover you directly, if you opt in',
            ]}
          />
        </div>

        <CompareCta competitor="Kickresume" />
      </div>
    </main>
  );
}
