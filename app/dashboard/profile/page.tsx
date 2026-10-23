import Link from 'next/link';
import { apiFetchJson, isApiUnavailable } from '@/lib/api';
import { ApiDownMessage } from '../../components/api-down';
import { deleteExperienceItem, setJobSearchEnabled } from './actions';
import { ImportResumeSection } from './import-resume-section';
import { AddExperienceItemForm } from './add-experience-item-form';
import { AddTagListForm } from './add-tag-list-form';
import { AboutYouSection } from './about-you-section';
import { GettingStartedChecklist } from './getting-started-checklist';
import { DeleteAccountSection } from './delete-account-section';
import { CollapsibleSection } from './collapsible-section';
import { ItemGroup } from './item-group';
import { TYPE_BADGE_CLASSES, TYPE_BORDER_CLASSES } from './type-colors';

export const instant = false;

type ExperienceType =
  | 'EXPERIENCE'
  | 'EDUCATION'
  | 'CERTIFICATION'
  | 'PROJECT'
  | 'ACHIEVEMENT'
  | 'SKILL'
  | 'LANGUAGE';

interface ExperienceItem {
  id: string;
  type: ExperienceType;
  title: string;
  organization: string | null;
  description: string | null;
}

interface Me {
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  bio: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  jobSearchEnabled: boolean;
  plan: 'FREE' | 'PREMIUM';
  freeGenerationsUsed: number;
  creditsBalance: number;
  creditsExpireAt: string | null;
}

// Bigger content lives in the main column; shorter, list-like content
// (certifications, achievements, skills) sits in the side column -- cuts
// down on vertical scrolling since they read side by side, not stacked.
// Projects defaults closed -- it's the group that tends to accumulate the
// most entries, so showing it collapsed keeps the page scannable;
// Experience/Education default open since those are usually few and the
// most load-bearing to see at a glance.
const MAIN_GROUPS: { label: string; type: ExperienceType; defaultOpen: boolean }[] = [
  { label: 'Experience', type: 'EXPERIENCE', defaultOpen: true },
  { label: 'Education', type: 'EDUCATION', defaultOpen: true },
  { label: 'Projects', type: 'PROJECT', defaultOpen: false },
];

// Achievements is handled separately below (one combined card instead of
// a card per item) rather than through this list.
const SIDE_GROUPS: { label: string; type: ExperienceType; defaultOpen: boolean }[] = [
  { label: 'Certifications', type: 'CERTIFICATION', defaultOpen: true },
];

function formatExpiry(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Shared by Skills and Languages -- both are short, tag-like facts shown
// as a chip row rather than a card per entry.
function TagSection({
  type,
  label,
  placeholder,
  items,
}: {
  type: 'SKILL' | 'LANGUAGE';
  label: string;
  placeholder: string;
  items: ExperienceItem[];
}) {
  return (
    <section className="space-y-3">
      <CollapsibleSection label={label} addLabel="+ Add">
        <AddTagListForm type={type} label={label} placeholder={placeholder} />
      </CollapsibleSection>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item.id}
              className={`chip ${TYPE_BADGE_CLASSES[type]} border-0`}
            >
              {item.title}
              <form action={deleteExperienceItem.bind(null, item.id)}>
                <button
                  type="submit"
                  className="opacity-60 hover:opacity-100"
                  aria-label={`Remove ${item.title}`}
                >
                  ×
                </button>
              </form>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm muted">No {label.toLowerCase()} yet.</p>
      )}
    </section>
  );
}

function ItemCard({
  item,
}: {
  item: ExperienceItem;
}) {
  return (
    <li
      className={`card-muted flex items-start justify-between ${TYPE_BORDER_CLASSES[item.type]}`}
    >
      <div>
        <p className="font-medium">
          {item.title}
          {item.organization ? ` at ${item.organization}` : ''}
        </p>
        {item.description && <p className="text-sm muted">{item.description}</p>}
      </div>
      <form action={deleteExperienceItem.bind(null, item.id)}>
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Delete
        </button>
      </form>
    </li>
  );
}

// All achievements in one card as compact rows, rather than a full
// card-per-item like ItemCard -- achievements tend to be short one-liners,
// so a card each wastes far more space than it's worth.
function AchievementsCard({ items }: { items: ExperienceItem[] }) {
  return (
    <ul className="card-muted divide-y" style={{ borderColor: 'var(--border-color)' }}>
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-start justify-between gap-2 py-2 first:pt-0 last:pb-0"
        >
          <div>
            <p className="text-sm font-medium">{item.title}</p>
            {item.description && <p className="text-xs muted">{item.description}</p>}
          </div>
          <form action={deleteExperienceItem.bind(null, item.id)}>
            <button type="submit" className="text-xs text-red-600 hover:underline">
              Delete
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}

export default async function ProfilePage() {
  let items: ExperienceItem[], me: Me, generationCount: number;
  try {
    const [itemsResult, meResult, generationsResult] = await Promise.all([
      apiFetchJson<ExperienceItem[]>('/experience-items'),
      apiFetchJson<Me>('/users/me'),
      // limit=1 -- only the `total` count is needed here, not the rows.
      apiFetchJson<{ total: number }>('/resume-generations?limit=1'),
    ]);
    items = itemsResult;
    me = meResult;
    generationCount = generationsResult.total;
  } catch (err) {
    if (isApiUnavailable(err)) return <ApiDownMessage />;
    throw err;
  }

  const mainGroups = MAIN_GROUPS.map((group) => ({
    ...group,
    items: items.filter((item) => item.type === group.type),
  })).filter((group) => group.items.length > 0);

  const sideGroups = SIDE_GROUPS.map((group) => ({
    ...group,
    items: items.filter((item) => item.type === group.type),
  })).filter((group) => group.items.length > 0);

  const skills = items.filter((item) => item.type === 'SKILL');
  const languages = items.filter((item) => item.type === 'LANGUAGE');
  const achievements = items.filter((item) => item.type === 'ACHIEVEMENT');

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="card flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium break-words">
            {me.name} &middot; {me.email}
          </p>
          <p className="text-sm muted">
            {me.plan === 'PREMIUM' ? (
              'Unlimited generations'
            ) : (
              <>
                {me.creditsBalance} credit{me.creditsBalance === 1 ? '' : 's'}
                {me.creditsExpireAt && me.creditsBalance > 0
                  ? ` (expires ${formatExpiry(me.creditsExpireAt)})`
                  : ''}
                {' -- '}
                <Link href="/dashboard/buy-credits" className="link">
                  buy more
                </Link>
              </>
            )}
          </p>
          {items.length > 0 && (
            <p className="mt-1 text-sm">
              Download resume:{' '}
              <Link href="/api/resume-export/general?format=docx" className="link">
                DOCX
              </Link>{' '}
              <Link href="/api/resume-export/general?format=pdf" className="link">
                PDF
              </Link>
            </p>
          )}
        </div>
        <form action={setJobSearchEnabled.bind(null, !me.jobSearchEnabled)}>
          <button
            type="submit"
            className={me.jobSearchEnabled ? 'btn-primary' : 'btn-secondary'}
          >
            {me.jobSearchEnabled ? 'Open to work: ON' : 'Open to work: OFF'}
          </button>
        </form>
      </section>

      <GettingStartedChecklist
        hasExperience={items.length > 0}
        hasGenerated={generationCount > 0}
      />

      <AboutYouSection me={me} />

      <ImportResumeSection />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column: experience, education, projects */}
        <div className="space-y-6 lg:col-span-2">
          <CollapsibleSection label="Experience & more" addLabel="+ Add">
            <AddExperienceItemForm />
          </CollapsibleSection>

          {mainGroups.length === 0 ? (
            <p className="text-sm muted">
              Nothing yet -- add your first one above, or import a resume.
            </p>
          ) : (
            mainGroups.map((group) => (
              <ItemGroup
                key={group.label}
                label={group.label}
                badgeClassName={TYPE_BADGE_CLASSES[group.type]}
                count={group.items.length}
                defaultOpen={group.defaultOpen}
              >
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </ul>
              </ItemGroup>
            ))
          )}
        </div>

        {/* Side column: skills, languages, certifications, achievements */}
        <div className="space-y-6">
          <TagSection
            type="SKILL"
            label="Skills"
            placeholder="Kubernetes, AWS, Terraform, Node.js, TypeScript"
            items={skills}
          />

          <TagSection
            type="LANGUAGE"
            label="Languages"
            placeholder="English (Native), Spanish (Fluent)"
            items={languages}
          />

          {sideGroups.map((group) => (
            <ItemGroup
              key={group.label}
              label={group.label}
              badgeClassName={TYPE_BADGE_CLASSES[group.type]}
              count={group.items.length}
              defaultOpen={group.defaultOpen}
            >
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </ul>
            </ItemGroup>
          ))}

          {achievements.length > 0 && (
            <ItemGroup
              label="Achievements"
              badgeClassName={TYPE_BADGE_CLASSES.ACHIEVEMENT}
              count={achievements.length}
              defaultOpen={false}
            >
              <AchievementsCard items={achievements} />
            </ItemGroup>
          )}
        </div>
      </div>

      <DeleteAccountSection />
    </div>
  );
}
