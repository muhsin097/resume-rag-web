import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Cease to Resume collects, uses, and protects your data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="flex-1" style={{ background: 'var(--background)' }}>
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-12">
        <Link href="/" className="link text-sm">
          &larr; Back to home
        </Link>

        <div>
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
          <p className="mt-1 text-sm muted">Last updated: October 17, 2026</p>
        </div>

        <p>
          Cease to Resume (&quot;we&quot;, &quot;us&quot;) is operated by Muhsin
          Musthafa. This page explains what data we collect when you use
          ceasetoresume.online, why we collect it, and who we share it with.
          If anything here is unclear, email{' '}
          <a href="mailto:muhzin0047@gmail.com" className="link">
            muhzin0047@gmail.com
          </a>
          .
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">What we collect</h2>
          <p>
            <strong>Account information</strong>: your email and name, plus a
            password (stored as a bcrypt hash, never in plain text) if you
            register directly, or your Google account&apos;s email/name if you
            sign in with Google -- we don&apos;t store a password at all for
            Google sign-ins.
          </p>
          <p>
            <strong>Profile content you add</strong>: phone, location, a short
            bio, and the experience, education, projects, certifications,
            skills, and languages you enter or import from an uploaded resume
            file. This is the raw material every tailored resume is built
            from.
          </p>
          <p>
            <strong>Job descriptions you paste</strong>, and the tailored
            resumes, match scores, and matched/missing keywords generated
            from them.
          </p>
          <p>
            <strong>Recruiter accounts</strong> (a separate persona) also
            store a company name and the searches run against opted-in
            candidate profiles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">How we use it</h2>
          <p>
            Your profile facts and a pasted job description are sent to
            Anthropic (Claude) to generate a tailored resume and a
            keyword-match analysis, and to Voyage AI to compute embeddings
            used for retrieving which of your facts are relevant to a given
            job description. These are the only two external AI providers we
            send your data to, and only the specific text needed for that
            request -- never your email or password.
          </p>
          <p>
            We do not use your data to train any AI model, ours or anyone
            else&apos;s, and we do not sell your data to anyone.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Recruiter visibility</h2>
          <p>
            If you turn on &quot;Open to work&quot; in your profile, your
            name, bio, and the experience facts relevant to a recruiter&apos;s
            search become visible to recruiter accounts searching the
            platform. Your email and phone number are never shown to
            recruiters. This is off by default -- turning it on is a choice
            you make, and you can turn it off at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Where your data lives</h2>
          <p>
            The application and database run on Amazon Web Services; the
            candidate and admin web apps are hosted on Vercel. Data may be
            processed on servers outside your own country. We don&apos;t use
            third-party advertising or analytics trackers -- the only cookie
            we set is a session cookie that keeps you signed in, which is
            required for the app to function and isn&apos;t used for
            tracking.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Your rights</h2>
          <p>
            You can edit or delete individual profile items yourself at any
            time from your dashboard. There isn&apos;t yet a self-serve
            &quot;delete my account&quot; button -- email{' '}
            <a href="mailto:muhzin0047@gmail.com" className="link">
              muhzin0047@gmail.com
            </a>{' '}
            from your account&apos;s email address and we&apos;ll delete your
            account and all associated data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Children</h2>
          <p>
            Cease to Resume is a job-search tool intended for adults and
            isn&apos;t directed at, or knowingly used to collect data from,
            anyone under 18.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Changes to this policy</h2>
          <p>
            If this policy changes materially, we&apos;ll update the date at
            the top of this page. Continued use of the app after a change
            means you accept the updated policy.
          </p>
        </section>
      </div>
    </main>
  );
}
