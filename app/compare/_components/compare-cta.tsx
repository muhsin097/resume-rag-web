import Link from 'next/link';

export function CompareCta({ competitor }: { competitor: string }) {
  return (
    <section className="card-muted mx-auto flex max-w-xl flex-col items-center gap-3 py-8 text-center">
      <p className="font-medium">See how your resume scores against a real job description.</p>
      <p className="text-sm muted">
        2 free tailored generations, no card required -- try it on the same job description you&apos;d use for{' '}
        {competitor}.
      </p>
      <Link href="/register" className="btn-primary px-6 py-2.5 text-base">
        Try for free
      </Link>
    </section>
  );
}
