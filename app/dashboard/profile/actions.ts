'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { apiFetch } from '@/lib/api';
import { signOut } from '@/auth';
import { portfolioCacheTag } from '../../p/[slug]/cache-tag';

// Called after any edit that could change what a public portfolio shows
// (a new/removed experience item, a bio/contact change, a skill added).
// getPortfolioData() auto-revalidates hourly regardless, but invalidating
// explicitly means an edit shows up on the public page right away instead
// of up to an hour later -- worth the one extra lightweight request given
// how often a candidate edits their profile right before sharing the
// link. Best-effort: a failure here shouldn't fail the edit that
// triggered it.
async function revalidatePortfolioForCurrentUser(): Promise<void> {
  try {
    const res = await apiFetch('/users/me');
    if (!res.ok) return;
    const me = await res.json();
    if (me.portfolioEnabled && me.portfolioSlug) {
      updateTag(portfolioCacheTag(me.portfolioSlug));
    }
  } catch {
    // Best-effort -- see comment above.
  }
}

export async function createExperienceItem(formData: FormData) {
  const payload: Record<string, string | boolean> = {
    type: String(formData.get('type')),
    title: String(formData.get('title')),
  };
  const organization = formData.get('organization');
  const description = formData.get('description');
  const startDate = formData.get('startDate');
  const endDate = formData.get('endDate');
  const isCurrent = formData.get('isCurrent') === 'on';
  if (organization) payload.organization = String(organization);
  if (description) payload.description = String(description);
  if (startDate) payload.startDate = String(startDate);
  // Mutually exclusive with isCurrent -- the form disables/clears the end
  // date input when "currently ongoing" is checked, so this is a
  // defensive guard against ever sending both.
  if (endDate && !isCurrent) payload.endDate = String(endDate);
  payload.isCurrent = isCurrent;

  const response = await apiFetch('/experience-items', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? 'Could not create experience item');
  }

  revalidatePath('/dashboard/profile');
  await revalidatePortfolioForCurrentUser();
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
  await revalidatePortfolioForCurrentUser();
}

// Resaves isCurrent:true with no other change -- the point isn't to
// alter the row, it's to bump updatedAt past the migration cutoff so
// this item drops out of the "needs confirmation" banner now that the
// candidate has actually looked at it and confirmed it's genuinely
// still ongoing.
export async function confirmStillOngoing(id: string) {
  const response = await apiFetch(`/experience-items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ isCurrent: true }),
  });

  if (!response.ok) {
    throw new Error('Could not confirm this item.');
  }

  revalidatePath('/dashboard/profile');
}

// The other resolution from the legacy-dates banner: the role/program
// actually ended, just not on a date anyone had recorded. Sets a real
// endDate and flips isCurrent off in one PATCH -- same update() call
// that drops the item out of the banner (see confirmStillOngoing).
export async function setItemEndDate(id: string, endDate: string) {
  const response = await apiFetch(`/experience-items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ endDate, isCurrent: false }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? 'Could not save the end date.');
  }

  revalidatePath('/dashboard/profile');
  await revalidatePortfolioForCurrentUser();
}

// At most one highlighted project at a time -- enforced server-side
// (ExperienceItemsService.update unsets any previous one in the same
// transaction), this just triggers that and refreshes both pages.
export async function setProjectHighlighted(id: string, highlighted: boolean) {
  const response = await apiFetch(`/experience-items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ isHighlighted: highlighted }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? 'Could not update the highlighted project.');
  }

  revalidatePath('/dashboard/profile');
  await revalidatePortfolioForCurrentUser();
}

export async function deleteExperienceItem(id: string) {
  const response = await apiFetch(`/experience-items/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Could not delete experience item');
  }

  revalidatePath('/dashboard/profile');
  await revalidatePortfolioForCurrentUser();
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
  await revalidatePortfolioForCurrentUser();
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

// Toggling OFF needs to take effect immediately (someone disabling their
// portfolio is often doing it specifically to pull it down right now, not
// "eventually") -- so this always explicitly invalidates the public
// page's cache tag, rather than relying on the hourly auto-revalidation
// getPortfolioData() otherwise uses.
export async function setPortfolioEnabled(enabled: boolean) {
  const response = await apiFetch('/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ portfolioEnabled: enabled }),
  });

  if (!response.ok) {
    throw new Error('Could not update portfolio visibility');
  }

  const me = await response.json();
  if (me.portfolioSlug) updateTag(portfolioCacheTag(me.portfolioSlug));

  revalidatePath('/dashboard/profile');
}

export interface PortfolioSlugState {
  error?: string;
  success?: boolean;
}

export async function updatePortfolioSlug(
  _prevState: PortfolioSlugState,
  formData: FormData,
): Promise<PortfolioSlugState> {
  const slug = String(formData.get('portfolioSlug') ?? '').trim();

  const response = await apiFetch('/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ portfolioSlug: slug }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return { error: data?.message?.[0] ?? data?.message ?? 'Could not update your portfolio URL.' };
  }

  if (data?.portfolioSlug) updateTag(portfolioCacheTag(data.portfolioSlug));
  revalidatePath('/dashboard/profile');
  return { success: true };
}

// Soft-deletes on the API side (profile data + experience items/history
// genuinely removed, email + generation usage retained to stop a
// delete-then-re-register loop from resetting the free tier) -- this just
// needs to end the browser's own session afterward.
export async function deleteAccount() {
  const response = await apiFetch('/users/me', { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Could not delete account');
  }
  await signOut({ redirectTo: '/' });
}
