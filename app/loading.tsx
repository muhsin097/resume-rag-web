import { BrandLoader } from './components/brand-loader';

// Root-level fallback for anything outside /dashboard and
// /recruiter/(app), which already have their own more specific
// boundaries -- covers /login, /register, /forgot-password, etc.
export default function RootLoading() {
  return <BrandLoader label="Loading..." />;
}
