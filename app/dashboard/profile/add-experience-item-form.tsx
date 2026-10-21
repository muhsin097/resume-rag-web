'use client';

import { useState } from 'react';
import { createExperienceItem } from './actions';

const TYPE_OPTIONS = [
  { value: 'EXPERIENCE', label: 'Experience' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'CERTIFICATION', label: 'Certification' },
  { value: 'PROJECT', label: 'Project' },
  { value: 'ACHIEVEMENT', label: 'Achievement' },
] as const;

type FormExperienceType = (typeof TYPE_OPTIONS)[number]['value'];

// Organization only makes sense for a job/school/issuer -- a project is
// often personal, and an achievement is a single standalone fact.
function showOrganization(type: FormExperienceType): boolean {
  return type !== 'PROJECT' && type !== 'ACHIEVEMENT';
}

// Dates don't apply to a single-fact achievement entry.
function showDates(type: FormExperienceType): boolean {
  return type !== 'ACHIEVEMENT';
}

export function AddExperienceItemForm() {
  const [type, setType] = useState<FormExperienceType>('EXPERIENCE');
  const [isCurrent, setIsCurrent] = useState(false);

  return (
    <form action={createExperienceItem} className="card grid grid-cols-2 gap-3">
      <label className="col-span-1 space-y-1">
        <span className="text-sm muted">Type</span>
        <select
          name="type"
          required
          value={type}
          onChange={(e) => setType(e.target.value as FormExperienceType)}
          className="input"
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="col-span-1 space-y-1">
        <span className="text-sm muted">Title</span>
        <input name="title" required className="input" />
      </label>

      {showOrganization(type) && (
        <label className="col-span-1 space-y-1">
          <span className="text-sm muted">Organization</span>
          <input name="organization" className="input" />
        </label>
      )}

      {showDates(type) && (
        <div
          className={
            showOrganization(type)
              ? 'col-span-1 space-y-2'
              : 'col-span-2 space-y-2'
          }
        >
          <div className="grid grid-cols-2 gap-2">
            <label className="space-y-1">
              <span className="text-sm muted">Start date</span>
              <input type="date" name="startDate" className="input" />
            </label>
            <label className="space-y-1">
              <span className="text-sm muted">End date</span>
              <input
                type="date"
                name="endDate"
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
          {/* Leaving end date blank without checking this means "ended,
              exact date just not known" -- not "still ongoing". Only
              check this if it's genuinely still in progress. */}
          {!isCurrent && (
            <p className="text-xs muted">
              Leave end date blank if it already ended but you don&apos;t
              remember exactly when.
            </p>
          )}
        </div>
      )}

      <label className="col-span-2 space-y-1">
        <span className="text-sm muted">Description</span>
        <textarea name="description" rows={3} className="input" />
      </label>
      <button type="submit" className="btn-primary col-span-2">
        Add
      </button>
    </form>
  );
}
