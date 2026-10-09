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
              ? 'col-span-1 grid grid-cols-2 gap-2'
              : 'col-span-2 grid grid-cols-2 gap-2'
          }
        >
          <label className="space-y-1">
            <span className="text-sm muted">Start date</span>
            <input type="date" name="startDate" className="input" />
          </label>
          <label className="space-y-1">
            <span className="text-sm muted">End date</span>
            <input type="date" name="endDate" className="input" />
          </label>
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
