import { BrandLoader } from '../components/brand-loader';

// Next.js's automatic Suspense boundary for this segment -- shown while
// navigating between /dashboard/profile, /generate, /history (each is
// `instant = false`, so there's a real per-request fetch in between). The
// header/nav in layout.tsx stays mounted; only this content area swaps.
export default function DashboardLoading() {
  return <BrandLoader label="Loading..." />;
}
