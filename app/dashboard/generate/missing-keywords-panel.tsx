'use client';

import { useState } from 'react';

export interface StagedSkill {
  keyword: string;
  saveToProfile: boolean;
}

interface MissingKeywordsPanelProps {
  missingKeywords: string[];
  onSubmit: (skills: StagedSkill[]) => void;
  pending: boolean;
}

// Each red "missing from the resume" chip doubles as a toggle: click it to
// stage the keyword for adding. Adding is free and immediate -- no AI
// approval step -- but requires the candidate to explicitly confirm they
// actually have each staged skill, the same honesty bar already implicit
// in typing something into the Profile page directly. The parent is
// responsible for a separate "Recalculate score" action once skills are
// added; this panel only ever touches the Skills section.
export function MissingKeywordsPanel({
  missingKeywords,
  onSubmit,
  pending,
}: MissingKeywordsPanelProps) {
  const [staged, setStaged] = useState<Map<string, boolean>>(new Map());
  const [confirmed, setConfirmed] = useState(false);

  function toggle(keyword: string) {
    setStaged((prev) => {
      const next = new Map(prev);
      if (next.has(keyword)) {
        next.delete(keyword);
      } else {
        next.set(keyword, true);
      }
      return next;
    });
    setConfirmed(false);
  }

  function setSaveToProfile(keyword: string, value: boolean) {
    setStaged((prev) => new Map(prev).set(keyword, value));
  }

  const stagedKeywords = Array.from(staged.keys());

  return (
    <div className="space-y-2 pt-1">
      <div className="flex flex-wrap gap-1.5">
        {missingKeywords.map((keyword) => {
          const isStaged = staged.has(keyword);
          return (
            <button
              key={keyword}
              type="button"
              onClick={() => toggle(keyword)}
              title={isStaged ? 'Remove' : 'Add this keyword -- free'}
              className={`group inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition ${
                isStaged
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-red-100 text-red-900 hover:bg-red-200'
              }`}
            >
              {keyword}
              <span
                className={
                  isStaged ? 'font-bold' : 'font-bold opacity-0 group-hover:opacity-100'
                }
              >
                {isStaged ? '✓' : '+'}
              </span>
            </button>
          );
        })}
      </div>

      {stagedKeywords.length > 0 && (
        <div className="card-muted space-y-3 text-sm">
          <p className="font-medium">
            Add {stagedKeywords.length} keyword{stagedKeywords.length > 1 ? 's' : ''} to your
            Skills -- free, no credit used.
          </p>
          <ul className="space-y-2">
            {stagedKeywords.map((keyword) => (
              <li key={keyword} className="flex flex-wrap items-center justify-between gap-2">
                <span>{keyword}</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs muted">
                    <input
                      type="checkbox"
                      checked={staged.get(keyword) ?? true}
                      onChange={(e) => setSaveToProfile(keyword, e.target.checked)}
                    />
                    Save to my profile
                  </label>
                  <button
                    type="button"
                    onClick={() => toggle(keyword)}
                    className="link text-xs"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <label className="flex items-start gap-2 text-xs">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              I confirm I have genuine hands-on experience with{' '}
              {stagedKeywords.length > 1 ? 'all of the skills above' : 'this skill'}.
            </span>
          </label>
          <p className="text-xs muted">
            This only updates your Skills section -- it won&apos;t change your match score
            until you recalculate it separately (1 credit).
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!confirmed || pending}
              onClick={() => {
                onSubmit(
                  stagedKeywords.map((keyword) => ({
                    keyword,
                    saveToProfile: staged.get(keyword) ?? true,
                  })),
                );
                setStaged(new Map());
                setConfirmed(false);
              }}
              className="btn-primary"
            >
              {pending ? 'Adding...' : 'Add keywords'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStaged(new Map());
                setConfirmed(false);
              }}
              className="link text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
