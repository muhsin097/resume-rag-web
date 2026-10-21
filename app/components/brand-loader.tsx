import Image from 'next/image';

// Shown while a generation/API call that takes a noticeable moment (resume
// generation, regenerate, resume import, profile save) is in flight -- the
// icon-only mark pulses gently rather than spinning, so it reads as
// "working" without implying a literal rotation. Respects
// prefers-reduced-motion via motion-safe:.
// min-h-[50vh], not py-10 -- the parent (<main>, a plain block) has no
// defined height of its own for justify-center to center within, so
// without an explicit min-height here this just sat near the top of the
// page instead of actually centering.
export function BrandLoader({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      <Image
        src="/logo-mark.png"
        alt=""
        width={48}
        height={48}
        className="h-12 w-12 motion-safe:animate-pulse"
        priority
      />
      <p className="text-sm muted">{label ?? 'Working on it...'}</p>
    </div>
  );
}
