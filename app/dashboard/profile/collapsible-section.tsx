'use client';

import { useState } from 'react';

// A heading with a pill button that reveals its children (a form) on
// click, and collapses back to the button on cancel -- so the form isn't
// permanently taking up space once there's already data on the page.
export function CollapsibleSection({
  label,
  addLabel,
  children,
}: {
  label: string;
  addLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{label}</h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="btn-secondary"
        >
          {open ? 'Cancel' : addLabel}
        </button>
      </div>
      {open && <div>{children}</div>}
    </section>
  );
}
