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

// Skills are one-word facts with no description/org/dates -- let the user
// drop in a whole batch at once instead of repeating the full form per
// skill. Goes through /experience-items/bulk (one batched Voyage call for
// all of them) rather than looping individual POSTs, which would hit
// Voyage's free-tier 3-requests/minute cap after the first couple of skills.
export async function addSkills(skills: string[]) {
  const response = await apiFetch('/experience-items/bulk', {
    method: 'POST',
    body: JSON.stringify({
      items: skills.map((title) => ({ type: 'SKILL', title })),
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? 'Could not save the skills.');
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
  const phone = formData.get('phone');
  const location = formData.get('location');
  const bio = formData.get('bio');
  if (phone !== null) payload.phone = String(phone);
  if (location !== null) payload.location = String(location);
  if (bio !== null) payload.bio = String(bio);

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
