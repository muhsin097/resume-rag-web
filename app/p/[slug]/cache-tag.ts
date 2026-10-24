// Shared by the cached portfolio fetch (page.tsx) and every server action
// that can change what a portfolio shows (dashboard/profile/actions.ts) --
// defining the tag string in exactly one place means the read and write
// sides can never drift apart.
export function portfolioCacheTag(slug: string): string {
  return `portfolio-${slug}`;
}
