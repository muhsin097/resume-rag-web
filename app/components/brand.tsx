import Image from 'next/image';

// Real logo asset is a 3:1 wordmark (2172x724) -- sizes below keep that
// ratio so it never stretches/squashes at any size the app uses it at.
const SIZES = {
  sm: { height: 56, width: 168 },
  md: { height: 72, width: 216 },
  lg: { height: 160, width: 480 },
} as const;

export function Brand({ size = 'md' }: { size?: keyof typeof SIZES }) {
  const { height, width } = SIZES[size];

  return (
    <Image
      src="/logo-full.png"
      alt="Cease to Resume"
      width={width}
      height={height}
      priority
      className="flex-none"
    />
  );
}
