import Link from 'next/link';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { auth } from '@/auth';
import { Brand } from './components/brand';

export const instant = false;

const STEPS = [
  {
    title: 'Build your profile',
    body: 'Add your real jobs, education, projects, certifications, and skills once. Import an existing resume to skip the typing.',
  },
  {
    title: 'Paste a job description',
    body: "We retrieve the facts from your profile that actually match what this specific job is asking for -- not your whole history, just the relevant part of it.",
  },
  {
    title: 'Get a tailored resume',
    body: "Rewritten in the job posting's own language, with a match score showing exactly which keywords you hit and which ones you're missing.",
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
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
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

      <section className="mx-auto max-w-3xl px-6 pt-12 pb-16 text-center sm:pt-20">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Your resume shouldn&apos;t say the same thing to every job.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base muted sm:text-lg">
          Generic resumes get filtered out before a human ever sees them, and
          tailoring every application by hand takes hours you don&apos;t have.
          Cease to Resume builds a tailored version from your{' '}
          <em>real</em> experience, in seconds.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register" className="btn-primary px-6 py-2.5 text-base">
            Try for free
          </Link>
          <Link href="/login" className="btn-secondary px-6 py-2.5 text-base">
            Log in
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="card space-y-2">
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                {index + 1}
              </span>
              <h2 className="font-medium">{step.title}</h2>
              <p className="text-sm muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <div className="card-muted mx-auto max-w-2xl space-y-1 py-6">
          <p className="font-medium">Nothing is invented.</p>
          <p className="text-sm muted">
            Every line in your tailored resume comes from something already
            in your profile -- rephrased and reordered to match the job, never
            fabricated.
          </p>
        </div>
        <Link
          href="/register"
          className="btn-primary mt-8 inline-flex px-6 py-2.5 text-base"
        >
          Try for free
        </Link>
      </section>
    </main>
  );
}
