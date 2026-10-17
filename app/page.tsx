import Link from 'next/link';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { auth } from '@/auth';
import { Brand } from './components/brand';
import { HeroIllustration } from './components/hero-illustration';
import { StatsCounter } from './components/stats-counter';

export const instant = false;

// Stroke-only, 24x24, currentColor -- same weight/linecap as the Brand
// mark's own arrow so these read as one family rather than a stock icon set.
function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 19c1.2-3.2 3.8-4.8 6.5-4.8s5.3 1.6 6.5 4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="5" y="5" width="14" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="9" y="3.2" width="6" height="3.2" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.5 11h7M8.5 14.5h7M8.5 18h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Folded-corner page, echoing the same motif in the logo mark itself.
function TailoredDocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M14 3.5V7a1 1 0 0 0 1 1h3.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path
        d="M9 14.5l2 2 4-4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FAQS = [
  {
    question: 'Is Cease to Resume free?',
    answer:
      'Yes -- every account gets 5 free tailored resume generations, no card required. Build your profile and try it on real job descriptions before deciding if you want more.',
  },
  {
    question: 'Will it invent things I haven’t actually done?',
    answer:
      'No. It only rephrases and reorders facts already in your profile to match a job’s language -- it never invents an employer, skill, or achievement you haven’t added yourself.',
  },
  {
    question: 'How is this different from asking a chatbot to write my resume?',
    answer:
      'A general-purpose chatbot can produce plausible-sounding experience that isn’t true. Cease to Resume retrieves specific facts from your own profile using semantic search, so every line traces back to something you actually added.',
  },
  {
    question: 'Can I import an existing resume instead of typing everything?',
    answer:
      'Yes -- upload a PDF, Word document, or plain-text resume (up to 5MB) and it extracts your experience, education, projects, and skills into your profile automatically.',
  },
  {
    question: 'What does the match score mean?',
    answer:
      'After generating a resume, you get a 0-100 score showing how well it covers the job description, plus exactly which important keywords you hit and which ones are still missing.',
  },
  {
    question: 'Is this an ATS resume checker?',
    answer:
      "Yes, in effect -- the match score works like an ATS resume scanner, running your resume's wording against the job description's own keywords so you can see what an applicant tracking system would flag as missing before you apply.",
  },
  {
    question: 'Can recruiters see my profile without my permission?',
    answer:
      'Only if you turn on "Open to work" yourself. Even then, recruiters only ever see your name, bio, and experience -- never your email or phone number.',
  },
];

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

const WEBAPP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Cease to Resume',
  url: 'https://ceasetoresume.online',
  description:
    'Tailor your resume to any job in seconds. Retrieves the facts from your real experience that match a job description and rewrites them in its language -- an ATS-friendly, keyword-matched resume with nothing invented.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const STEPS = [
  {
    title: 'Build your profile',
    body: 'Add your real jobs, education, projects, certifications, and skills once. Import an existing resume to skip the typing.',
    Icon: ProfileIcon,
  },
  {
    title: 'Paste a job description',
    body: "We retrieve the facts from your profile that actually match what this specific job is asking for -- not your whole history, just the relevant part of it.",
    Icon: ClipboardIcon,
  },
  {
    title: 'Get a tailored resume',
    body: "Rewritten in the job posting's own language, plus an instant ATS resume analysis showing exactly which keywords you hit and which ones you're missing.",
    Icon: TailoredDocIcon,
  },
];

export default async function Home() {
  // auth() can touch crypto randomness internally -- `connection()` tells
  // Next this must run per-request, not during a prerender attempt.
  await connection();
  const session = await auth();
  if (session) {
    redirect('/dashboard/profile');
  }

  return (
    <main className="flex-1" style={{ background: 'var(--background)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBAPP_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 px-4 py-5 sm:px-6">
        <Brand size="sm" />
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/login" className="btn-ghost">
            Log in
          </Link>
          <Link href="/register" className="btn-primary">
            Try for free
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto max-w-6xl overflow-hidden px-6 pt-12 pb-16 sm:pt-20">
        <div className="relative z-10 max-w-xl text-center sm:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Your resume shouldn&apos;t say the same thing to every job.
          </h1>
          <p className="mt-4 text-base muted sm:text-lg">
            Generic resumes get filtered out before a human ever sees them, and
            tailoring every application by hand takes hours you don&apos;t have.
            Cease to Resume is a free, ATS-friendly resume maker that builds a
            tailored version from your <em>real</em> experience, in seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <Link href="/register" className="btn-primary px-6 py-2.5 text-base">
              Try for free
            </Link>
            <Link href="/login" className="btn-secondary px-6 py-2.5 text-base">
              Log in
            </Link>
          </div>
          <div className="mt-12">
            <StatsCounter />
          </div>
        </div>

        <div
          className="pointer-events-none absolute top-1/2 right-[-40px] hidden h-[420px] w-[420px] -translate-y-1/2 lg:block"
          aria-hidden="true"
        >
          <HeroIllustration />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="card group space-y-2 motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-1"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] transition-colors duration-200 group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-foreground)]">
                <step.Icon />
              </span>
              <h2 className="font-semibold">
                <span className="muted mr-1.5 text-sm font-normal">{index + 1}.</span>
                {step.title}
              </h2>
              <p className="text-sm muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16 text-center">
        <div className="card-muted mx-auto max-w-2xl space-y-1 py-6">
          <p className="font-medium">Nothing is invented.</p>
          <p className="text-sm muted">
            Every line in your tailored resume comes from something already
            in your profile -- rephrased and reordered to match the job, never
            fabricated.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-16">
        <h2 className="text-center font-semibold">Frequently asked questions</h2>
        <div className="mt-6 space-y-2">
          {FAQS.map((faq) => (
            <details key={faq.question} className="card group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium">
                {faq.question}
                <span
                  className="flex-none text-lg muted transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <Link
          href="/register"
          className="btn-primary inline-flex px-6 py-2.5 text-base"
        >
          Try for free
        </Link>
      </section>
    </main>
  );
}
