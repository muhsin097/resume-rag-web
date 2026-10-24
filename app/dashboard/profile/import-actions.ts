'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { apiFetch } from '@/lib/api';
import { portfolioCacheTag } from '../../p/[slug]/cache-tag';

export type ExtractedItemType =
  | 'EXPERIENCE'
  | 'EDUCATION'
  | 'CERTIFICATION'
  | 'PROJECT'
  | 'ACHIEVEMENT'
  | 'SKILL'
  | 'LANGUAGE';

export type DatePrecision = 'YEAR' | 'MONTH' | 'DAY';

export interface ExtractedItem {
  type: ExtractedItemType;
  title: string;
  organization?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  startDatePrecision?: DatePrecision | null;
  endDatePrecision?: DatePrecision | null;
  // True only when the source resume explicitly signalled this is
  // ongoing -- not just "no end date given". See ExperienceItem.isCurrent
  // in the API's Prisma schema.
  isCurrent?: boolean;
}

export interface ExtractedContactInfo {
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
}

export interface ExtractResumeState {
  error?: string;
  items?: ExtractedItem[];
  contactInfo?: ExtractedContactInfo;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Signature matches useActionState (prevState, formData).
export async function extractResumeItems(
  _prevState: ExtractResumeState,
  formData: FormData,
): Promise<ExtractResumeState> {
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Choose a resume file first.' };
  }

  const uploadForm = new FormData();
  uploadForm.append('file', file, file.name);

  const response = await apiFetch('/resume-import', {
    method: 'POST',
    body: uploadForm,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return { error: data?.message ?? 'Could not read that resume.' };
  }

  return { items: data?.items ?? [], contactInfo: data?.contactInfo ?? {} };
}

// Called directly from the review UI (not a <form action>), so it takes
// plain arguments rather than FormData. Nothing is saved until this runs --
// extraction above never touches the database.
//
// Items go through /experience-items/bulk (ONE request, one batched Voyage
// embedding call for everything) rather than looping individual POSTs --
// looping used to blow through Voyage's free-tier 3-requests/minute cap
// partway through a multi-item resume, silently dropping every item after
// the first few. Contact info/bio is a separate PATCH to /users/me since
// it lives on the User row, not an ExperienceItem.
export async function saveExtractedResume(
  items: ExtractedItem[],
  contactInfo: ExtractedContactInfo,
) {
  if (items.length > 0) {
    const payloadItems = items.map((item) => {
      const payload: Record<string, string | boolean> = {
        type: item.type,
        title: item.title,
        isCurrent: Boolean(item.isCurrent),
      };
      if (item.organization) payload.organization = item.organization;
      if (item.description) payload.description = item.description;
      // Claude is asked for ISO dates but isn't guaranteed to comply --
      // drop anything that doesn't match rather than fail the whole save.
      if (item.startDate && ISO_DATE.test(item.startDate)) {
        payload.startDate = item.startDate;
        if (item.startDatePrecision) payload.startDatePrecision = item.startDatePrecision;
      }
      // Mutually exclusive with isCurrent, same as the manual-entry form.
      if (item.endDate && ISO_DATE.test(item.endDate) && !item.isCurrent) {
        payload.endDate = item.endDate;
        if (item.endDatePrecision) payload.endDatePrecision = item.endDatePrecision;
      }
      return payload;
    });

    const response = await apiFetch('/experience-items/bulk', {
      method: 'POST',
      body: JSON.stringify({ items: payloadItems }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message ?? 'Could not save the extracted items.');
    }
  }

  const hasContactInfo =
    contactInfo.phone || contactInfo.location || contactInfo.bio;
  if (hasContactInfo) {
    const contactPayload: Record<string, string> = {};
    if (contactInfo.phone) contactPayload.phone = contactInfo.phone;
    if (contactInfo.location) contactPayload.location = contactInfo.location;
    if (contactInfo.bio) contactPayload.bio = contactInfo.bio;

    const response = await apiFetch('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(contactPayload),
    });

    if (!response.ok) {
      throw new Error('Could not save your contact info/bio.');
    }
  }

  revalidatePath('/dashboard/profile');

  try {
    const meRes = await apiFetch('/users/me');
    if (meRes.ok) {
      const me = await meRes.json();
      if (me.portfolioEnabled && me.portfolioSlug) updateTag(portfolioCacheTag(me.portfolioSlug));
    }
  } catch {
    // Best-effort -- see revalidatePortfolioForCurrentUser in actions.ts
    // for the full reasoning; same pattern, inlined here since this file
    // only needs it in this one place.
  }
}
