import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of Cease to Resume.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <main className="flex-1" style={{ background: 'var(--background)' }}>
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-12">
        <Link href="/" className="link text-sm">
          &larr; Back to home
        </Link>

        <div>
          <h1 className="text-2xl font-semibold">Terms of Service</h1>
          <p className="mt-1 text-sm muted">Last updated: October 17, 2026</p>
        </div>

        <p>
          These terms govern your use of ceasetoresume.online, operated by
          Muhsin Musthafa (&quot;we&quot;, &quot;us&quot;). By creating an
          account or using the site, you agree to them. Questions go to{' '}
          <a href="mailto:muhzin0047@gmail.com" className="link">
            muhzin0047@gmail.com
          </a>
          .
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">The service</h2>
          <p>
            Cease to Resume generates a resume tailored to a job description
            you paste in, built only from facts you&apos;ve added to your own
            profile -- it rephrases and prioritizes what you provide, and is
            instructed not to invent experience, employers, or skills you
            haven&apos;t entered. It doesn&apos;t always get phrasing or
            emphasis right, and you&apos;re responsible for reviewing any
            generated resume before you send it to an employer.
          </p>
          <p>
            Free accounts get 5 tailored resume generations. We may change
            this limit, or what a premium plan includes, at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Your account</h2>
          <p>
            You&apos;re responsible for keeping your login credentials secure
            and for activity that happens under your account. Give us
            accurate information -- both because it&apos;s what ends up on
            your generated resumes, and because we may rely on your email to
            reach you about your account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Your content</h2>
          <p>
            You own what you put into your profile. By adding it, you give us
            the permission we need to process it as described in the{' '}
            <Link href="/privacy" className="link">
              Privacy Policy
            </Link>{' '}
            -- including sending the relevant parts of it to Anthropic and
            Voyage AI to generate and retrieve content on your behalf. We
            don&apos;t claim ownership of your profile content or generated
            resumes, and we don&apos;t use them for anything beyond providing
            the service to you.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              Enter experience, credentials, or employers you don&apos;t
              actually have -- the whole point of this tool is that it
              doesn&apos;t invent anything, which only holds if what you give
              it is true.
            </li>
            <li>
              Scrape, reverse-engineer, or use automated tools against the
              site outside normal browser use.
            </li>
            <li>
              As a recruiter, use candidate data surfaced through search for
              anything other than legitimate recruiting, or contact
              candidates outside the platform using data obtained here
              without their separate consent.
            </li>
            <li>Attempt to disrupt or overload the service.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">No warranty</h2>
          <p>
            The service is provided &quot;as is.&quot; AI-generated content
            can contain errors or awkward phrasing, and we make no guarantee
            that a tailored resume will get you an interview or job offer. We
            don&apos;t guarantee the service will be uninterrupted or
            error-free.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Limitation of liability</h2>
          <p>
            To the extent permitted by law, we aren&apos;t liable for
            indirect, incidental, or consequential damages arising from your
            use of the service, including any employment outcome related to a
            resume generated here.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Termination</h2>
          <p>
            We may suspend or terminate an account that violates these terms.
            You can stop using the service, or request account deletion, at
            any time -- see the{' '}
            <Link href="/privacy" className="link">
              Privacy Policy
            </Link>{' '}
            for how.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Changes</h2>
          <p>
            We may update these terms as the service changes. Material
            changes will update the date at the top of this page; continuing
            to use the service after a change means you accept it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Governing law</h2>
          <p>These terms are governed by the laws of India.</p>
        </section>
      </div>
    </main>
  );
}
