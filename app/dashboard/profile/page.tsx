import { apiFetch } from '@/lib/api';
import { deleteExperienceItem, setJobSearchEnabled } from './actions';
import { ImportResumeSection } from './import-resume-section';
import { AddExperienceItemForm } from './add-experience-item-form';
import { AddSkillsForm } from './add-skills-form';
import { AboutYouSection } from './about-you-section';
import { CollapsibleSection } from './collapsible-section';
import { TYPE_BADGE_CLASSES, TYPE_BORDER_CLASSES } from './type-colors';

export const instant = false;

type ExperienceType =
  | 'EXPERIENCE'
  | 'EDUCATION'
  | 'CERTIFICATION'
  | 'PROJECT'
  | 'ACHIEVEMENT'
  | 'SKILL';

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
  jobSearchEnabled: boolean;
  plan: 'FREE' | 'PREMIUM';
  freeGenerationsUsed: number;
}

// Bigger content lives in the main column; shorter, list-like content
// (certifications, achievements, skills) sits in the side column -- cuts
// down on vertical scrolling since they read side by side, not stacked.
const MAIN_GROUPS: { label: string; type: ExperienceType }[] = [
  { label: 'Experience', type: 'EXPERIENCE' },
  { label: 'Education', type: 'EDUCATION' },
  { label: 'Projects', type: 'PROJECT' },
];

const SIDE_GROUPS: { label: string; type: ExperienceType }[] = [
  { label: 'Certifications', type: 'CERTIFICATION' },
  { label: 'Achievements', type: 'ACHIEVEMENT' },
];

const FREE_GENERATIONS_LIMIT = 5;

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

export default async function ProfilePage() {
  const [itemsRes, meRes] = await Promise.all([
    apiFetch('/experience-items'),
    apiFetch('/users/me'),
  ]);
  const items: ExperienceItem[] = await itemsRes.json();
  const me: Me = await meRes.json();

  const mainGroups = MAIN_GROUPS.map((group) => ({
    label: group.label,
    type: group.type,
    items: items.filter((item) => item.type === group.type),
  })).filter((group) => group.items.length > 0);

  const sideGroups = SIDE_GROUPS.map((group) => ({
    label: group.label,
    type: group.type,
    items: items.filter((item) => item.type === group.type),
  })).filter((group) => group.items.length > 0);

  const skills = items.filter((item) => item.type === 'SKILL');

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="card flex items-center justify-between">
        <div>
          <p className="font-medium">
            {me.name} &middot; {me.email}
          </p>
          <p className="text-sm muted">
            {me.plan === 'PREMIUM' ? 'Premium plan' : 'Free plan'} &middot;{' '}
            {me.freeGenerationsUsed}/{FREE_GENERATIONS_LIMIT} generations used
          </p>
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
              <div key={group.label}>
                <span
                  className={`chip ${TYPE_BADGE_CLASSES[group.type]} mb-2 border-0`}
                >
                  {group.label}
                </span>
                <ul className="mt-2 space-y-2">
                  {group.items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Side column: skills, certifications, achievements */}
        <div className="space-y-6">
          <section className="space-y-3">
            <CollapsibleSection label="Skills" addLabel="+ Add">
              <AddSkillsForm />
            </CollapsibleSection>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((item) => (
                  <span
                    key={item.id}
                    className={`chip ${TYPE_BADGE_CLASSES.SKILL} border-0`}
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
              <p className="text-sm muted">No skills yet.</p>
            )}
          </section>

          {sideGroups.map((group) => (
            <section key={group.label} className="space-y-2">
              <span className={`chip ${TYPE_BADGE_CLASSES[group.type]} border-0`}>
                {group.label}
              </span>
              <ul className="mt-2 space-y-2">
                {group.items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
