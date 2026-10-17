import Link from 'next/link';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{ borderTop: '1px solid var(--border-color)' }}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm sm:px-6">
        <p className="muted">&copy; {YEAR} Cease to Resume. Operated by Muhsin Musthafa.</p>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Link href="/privacy" className="link">
            Privacy Policy
          </Link>
          <Link href="/terms" className="link">
            Terms of Service
          </Link>
          <a href="mailto:muhzin0047@gmail.com" className="link">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
