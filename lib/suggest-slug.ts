// Shared by the portfolio settings section and the nudge banner --
// previously defined identically in both places. Produces a reasonable
// URL-safe guess from a display name; the user can always edit it
// afterward, this just needs to be a plausible starting point, not
// perfect (e.g. it doesn't transliterate non-Latin names).
export function suggestSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    // A name with a leading/trailing symbol (e.g. '"Mike" Johnson' or a
    // stray leading hyphen) otherwise leaves a leading/trailing hyphen
    // here, which fails the backend's slug pattern
    // (/^[a-z0-9]+(-[a-z0-9]+)*$/) and would silently break the
    // one-click enable flow.
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    // Re-strip after the length cap -- a cut that happens to land right
    // on a hyphen would otherwise leave one dangling at the new end.
    .replace(/^-+|-+$/g, '');
}
