import { BrandLoader } from '../../components/brand-loader';

// Next.js's automatic Suspense boundary for this segment -- shown while
// navigating between /recruiter/search and /recruiter/candidates/[id].
export default function RecruiterLoading() {
  return <BrandLoader label="Loading..." />;
}
