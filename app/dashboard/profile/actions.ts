'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api';

export async function createExperienceItem(formData: FormData) {
  const payload: Record<string, string> = {
    type: String(formData.get('type')),
    title: String(formData.get('title')),
  };
  const organization = formData.get('organization');
  const description = formData.get('description');
  const startDate = formData.get('startDate');
  const endDate = formData.get('endDate');
  if (organization) payload.organization = String(organization);
  if (description) payload.description = String(description);
  if (startDate) payload.startDate = String(startDate);
  if (endDate) payload.endDate = String(endDate);

  const response = await apiFetch('/experience-items', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? 'Could not create experience item');
  }

  revalidatePath('/dashboard/profile');
}

// Skills/languages are one-word(ish) facts with no description/org/dates --
// let the user drop in a whole batch at once instead of repeating the full
// form per entry. Goes through /experience-items/bulk (one batched Voyage
// call for all of them) rather than looping individual POSTs, which would
// hit Voyage's free-tier 3-requests/minute cap after the first couple.
export async function addTagItems(type: 'SKILL' | 'LANGUAGE', titles: string[]) {
  const response = await apiFetch('/experience-items/bulk', {
    method: 'POST',
    body: JSON.stringify({
      items: titles.map((title) => ({ type, title })),
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? 'Could not save.');
  }

  revalidatePath('/dashboard/profile');
}

export async function deleteExperienceItem(id: string) {
  const response = await apiFetch(`/experience-items/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Could not delete experience item');
  }

  revalidatePath('/dashboard/profile');
}

export async function updateContactInfo(formData: FormData) {
  const payload: Record<string, string> = {};
  const name = formData.get('name');
  const phone = formData.get('phone');
  const location = formData.get('location');
  const bio = formData.get('bio');
  const linkedinUrl = formData.get('linkedinUrl');
  const githubUrl = formData.get('githubUrl');
  const websiteUrl = formData.get('websiteUrl');
  if (name !== null) payload.name = String(name);
  if (phone !== null) payload.phone = String(phone);
  if (location !== null) payload.location = String(location);
  if (bio !== null) payload.bio = String(bio);
  if (linkedinUrl !== null) payload.linkedinUrl = String(linkedinUrl);
  if (githubUrl !== null) payload.githubUrl = String(githubUrl);
  if (websiteUrl !== null) payload.websiteUrl = String(websiteUrl);

  const response = await apiFetch('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Could not update contact info/bio');
  }

  revalidatePath('/dashboard/profile');
}

export async function setJobSearchEnabled(enabled: boolean) {
  const response = await apiFetch('/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ jobSearchEnabled: enabled }),
  });

  if (!response.ok) {
    throw new Error('Could not update job search preference');
  }

  revalidatePath('/dashboard/profile');
}
