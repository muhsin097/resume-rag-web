import Link from 'next/link';
import { apiFetchJson, isApiUnavailable } from '@/lib/api';
import { ApiDownMessage } from '../../components/api-down';
import { InterestedContactsSection } from './interested-contacts-section';

interface PortfolioLead {
  id: string;
  visitorEmail: string;
  visitorName: string | null;
  message: string | null;
  createdAt: string;
}

interface Me {
  portfolioEnabled: boolean;
  portfolioSlug: string | null;
}

export default async function ContactsPage() {
  let me: Me, leads: PortfolioLead[];
  try {
    [me, leads] = await Promise.all([
      apiFetchJson<Me>('/users/me'),
      apiFetchJson<PortfolioLead[]>('/users/me/portfolio-leads'),
    ]);
  } catch (err) {
    if (isApiUnavailable(err)) return <ApiDownMessage />;
    throw err;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {!me.portfolioEnabled && leads.length === 0 && (
        <div className="card-muted text-sm">
          Your public portfolio is currently off, so no one can reach out yet.{' '}
          <Link href="/dashboard/profile" className="link">
            Turn it on from your profile
          </Link>{' '}
          to start hearing from people.
        </div>
      )}

      <InterestedContactsSection leads={leads} />
    </div>
  );
}
