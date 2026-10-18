'use client';

import { useState } from 'react';

// Wraps an existing item list behind a collapsible header with a count --
// keeps a profile with many Projects/Achievements from dominating the page
// by default, while the full list stays one click away. Distinct from
// CollapsibleSection (which reveals an empty "add" form) -- this toggles
// visibility of data that already exists.
export function ItemGroup({
  label,
  badgeClassName,
  count,
  defaultOpen,
  children,
}: {
  label: string;
  badgeClassName: string;
  count: number;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mb-2 flex items-center gap-2"
      >
        <span className={`chip ${badgeClassName} border-0`}>{label}</span>
        <span className="text-sm muted">
          {count} {open ? '▲' : '▼'}
        </span>
      </button>
      {open && children}
    </div>
  );
}
