import Image from 'next/image';

// Real logo asset is a 3:1 wordmark (2172x724) -- width/height below are
// the intrinsic size next/image needs for its aspect-ratio box; the
// className controls the actual rendered size per breakpoint (h-auto
// keeps the 3:1 ratio intact while it scales), so none of these overflow
// a narrow phone viewport the way a fixed 480px-wide "lg" used to.
const SIZES = {
  sm: { height: 56, width: 168, className: 'h-9 w-auto sm:h-14' },
  md: { height: 72, width: 216, className: 'h-11 w-auto sm:h-[72px]' },
  lg: { height: 160, width: 480, className: 'h-16 w-auto sm:h-28 md:h-40' },
} as const;

export function Brand({ size = 'md' }: { size?: keyof typeof SIZES }) {
  const { height, width, className } = SIZES[size];

  return (
    <Image
      src="/logo-full.png"
      alt="Cease to Resume"
      width={width}
      height={height}
      priority
      className={`flex-none ${className}`}
    />
  );
}
