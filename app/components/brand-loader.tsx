import Image from 'next/image';

// Shown while a generation/API call that takes a noticeable moment (resume
// generation, regenerate, resume import, profile save) is in flight -- the
// icon-only mark pulses gently rather than spinning, so it reads as
// "working" without implying a literal rotation. Respects
// prefers-reduced-motion via motion-safe:.
export function BrandLoader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
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
