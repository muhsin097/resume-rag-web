'use client';

import { useState } from 'react';
import { deleteExperienceItem, setProjectHighlighted, updateExperienceItem } from './actions';
import { TYPE_BORDER_CLASSES } from './type-colors';
import { formatRange } from '@/lib/format-range';

// Widened to match the full type union used elsewhere on the profile
// page, even though ItemCard/AchievementRow are only ever rendered for
// the non-tag types (SKILL/LANGUAGE go through TagSection instead) --
// keeps the shared ExperienceItem shape structurally assignable without
// a cast at the call site.
type ExperienceType = 'EXPERIENCE' | 'EDUCATION' | 'CERTIFICATION' | 'PROJECT' | 'ACHIEVEMENT' | 'SKILL' | 'LANGUAGE';

export interface ExperienceItemData {
  id: string;
  type: ExperienceType;
  title: string;
  organization: string | null;
  description: string | null;
  isCurrent: boolean;
  isHighlighted: boolean;
  startDate: string | null;
  endDate: string | null;
}

// Organization only makes sense for a job/school/issuer -- a project is
// often personal, and an achievement is a single standalone fact.
function showOrganization(type: ExperienceType): boolean {
  return type !== 'PROJECT' && type !== 'ACHIEVEMENT';
}

// Dates don't apply to a single-fact achievement entry.
function showDates(type: ExperienceType): boolean {
  return type !== 'ACHIEVEMENT';
}

function toDateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : '';
}

export function ItemCard({ item }: { item: ExperienceItemData }) {
  const [editing, setEditing] = useState(false);
  const [isCurrent, setIsCurrent] = useState(item.isCurrent);

  if (editing) {
    return (
      <li className={`card-muted ${TYPE_BORDER_CLASSES[item.type]}`}>
        <form
          action={async (formData) => {
            await updateExperienceItem(item.id, formData);
            setEditing(false);
          }}
          className="grid grid-cols-2 gap-3"
        >
          <label className="col-span-1 space-y-1">
            <span className="text-sm muted">Title</span>
            <input name="title" required defaultValue={item.title} className="input" />
          </label>

          {showOrganization(item.type) && (
            <label className="col-span-1 space-y-1">
              <span className="text-sm muted">Organization</span>
              <input name="organization" defaultValue={item.organization ?? ''} className="input" />
            </label>
          )}

          {showDates(item.type) && (
            <div className="col-span-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1">
                  <span className="text-sm muted">Start date</span>
                  <input type="date" name="startDate" defaultValue={toDateInputValue(item.startDate)} className="input" />
                </label>
                <label className="space-y-1">
                  <span className="text-sm muted">End date</span>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={toDateInputValue(item.endDate)}
                    disabled={isCurrent}
                    className="input disabled:opacity-50"
                  />
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isCurrent"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                />
                Currently ongoing
              </label>
            </div>
          )}

          <label className="col-span-2 space-y-1">
            <span className="text-sm muted">Description</span>
            <textarea name="description" rows={3} defaultValue={item.description ?? ''} className="input" />
          </label>

          <div className="col-span-2 flex items-center gap-3">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button type="button" onClick={() => setEditing(false)} className="link text-sm">
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`card-muted flex items-start justify-between gap-3 ${TYPE_BORDER_CLASSES[item.type]}`}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <p className="font-medium">
            {item.title}
            {item.organization ? ` at ${item.organization}` : ''}
            {item.isHighlighted && (
              <span
                className="chip ml-2"
                style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                Featured
              </span>
            )}
          </p>
          {formatRange(item) && <p className="text-xs muted">{formatRange(item)}</p>}
        </div>
        {item.description && <p className="text-sm muted">{item.description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <button type="button" onClick={() => setEditing(true)} className="text-sm link whitespace-nowrap">
          Edit
        </button>
        {item.type === 'PROJECT' && (
          <form action={setProjectHighlighted.bind(null, item.id, !item.isHighlighted)}>
            <button type="submit" className="text-sm link whitespace-nowrap">
              {item.isHighlighted ? 'Unfeature' : 'Feature on portfolio'}
            </button>
          </form>
        )}
        <form action={deleteExperienceItem.bind(null, item.id)}>
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Delete
          </button>
        </form>
      </div>
    </li>
  );
}

export function AchievementRow({ item }: { item: ExperienceItemData }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="space-y-2 py-2 first:pt-0 last:pb-0">
        <form
          action={async (formData) => {
            await updateExperienceItem(item.id, formData);
            setEditing(false);
          }}
          className="space-y-2"
        >
          <label className="block space-y-1">
            <span className="text-xs muted">Title</span>
            <input name="title" required defaultValue={item.title} className="input text-sm" />
          </label>
          <label className="block space-y-1">
            <span className="text-xs muted">Description</span>
            <textarea name="description" rows={2} defaultValue={item.description ?? ''} className="input text-sm" />
          </label>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary px-3 py-1 text-xs">
              Save
            </button>
            <button type="button" onClick={() => setEditing(false)} className="link text-xs">
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-start justify-between gap-2 py-2 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium">{item.title}</p>
        {item.description && <p className="text-xs muted">{item.description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <button type="button" onClick={() => setEditing(true)} className="text-xs link">
          Edit
        </button>
        <form action={deleteExperienceItem.bind(null, item.id)}>
          <button type="submit" className="text-xs text-red-600 hover:underline">
            Delete
          </button>
        </form>
      </div>
    </li>
  );
}
