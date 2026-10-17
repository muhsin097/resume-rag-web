'use client';

import { useState } from 'react';

export interface RequestedSkill {
  keyword: string;
  saveToProfile: boolean;
}

interface MissingKeywordsPanelProps {
  missingKeywords: string[];
  onSubmit: (requestedSkills: RequestedSkill[]) => void;
}

// Each red "missing from the resume" chip doubles as a toggle: click it to
// stage the keyword for the next regeneration (shows a checkmark instead of
// "+"). The backend still decides whether a staged keyword is a genuine fit
// for the candidate -- staging here just means "please ask about this one."
// The parent unmounts this panel while a regeneration is pending (it shows
// a full-page loader instead), so there's no in-component pending state.
export function MissingKeywordsPanel({
  missingKeywords,
  onSubmit,
}: MissingKeywordsPanelProps) {
  const [staged, setStaged] = useState<Map<string, boolean>>(new Map());

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
              title={isStaged ? 'Remove from this regeneration' : 'Add this keyword'}
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
            tailored resume?
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
          <p className="text-xs muted">
            We only add keywords that genuinely fit your background -- unrelated ones are
            skipped automatically. This regenerates your resume and uses 1 generation credit.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onSubmit(
                  stagedKeywords.map((keyword) => ({
                    keyword,
                    saveToProfile: staged.get(keyword) ?? true,
                  })),
                )
              }
              className="btn-primary"
            >
              Add & regenerate
            </button>
            <button
              type="button"
              onClick={() => setStaged(new Map())}
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
