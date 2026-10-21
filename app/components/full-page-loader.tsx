import { BrandLoader } from './brand-loader';

// A fixed, full-viewport overlay rather than an inline block -- used for
// generate/regenerate, which can take 10-30s (a Claude call). An inline
// spinner squeezed below the form was easy to miss and left the stale
// form visibly interactive underneath; this makes "working, please wait"
// unambiguous and blocks interaction with the rest of the page in the
// meantime.
export function FullPageLoader({ label }: { label?: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'color-mix(in srgb, var(--background) 85%, transparent)' }}
    >
      <BrandLoader label={label} />
    </div>
  );
}
