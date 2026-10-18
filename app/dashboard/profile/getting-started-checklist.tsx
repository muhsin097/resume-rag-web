'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';

const DISMISS_KEY = 'ctr_getting_started_dismissed';
// localStorage.setItem doesn't fire a 'storage' event in the same tab that
// made the change (only other tabs get that), so dismiss() notifies this
// tiny local subscriber set itself to trigger a re-render.
const listeners = new Set<() => void>();

function subscribeToDismissed(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getDismissedSnapshot() {
  return localStorage.getItem(DISMISS_KEY) === '1';
}

// No localStorage on the server -- assume not dismissed there, matching
// the default a first-time visitor would see.
function getDismissedServerSnapshot() {
  return false;
}

function dismissChecklist() {
  localStorage.setItem(DISMISS_KEY, '1');
  listeners.forEach((listener) => listener());
}

// Shown on first login so a new user doesn't have to guess the order of
// operations (add experience, then generate) -- disappears on its own
// once both steps are genuinely done, or earlier if explicitly hidden
// (remembered via localStorage, not tied to any one device's session).
export function GettingStartedChecklist({
  hasExperience,
  hasGenerated,
}: {
  hasExperience: boolean;
  hasGenerated: boolean;
}) {
  const dismissed = useSyncExternalStore(
    subscribeToDismissed,
    getDismissedSnapshot,
    getDismissedServerSnapshot,
  );

  if ((hasExperience && hasGenerated) || dismissed) return null;

  const steps = [
    {
      label: 'Add your experience -- import a resume or add it manually below',
      done: hasExperience,
    },
    {
      label: 'Generate your first tailored resume',
      done: hasGenerated,
      href: hasExperience ? '/dashboard/generate' : undefined,
    },
  ];

  return (
    <section className="card space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Getting started</h2>
        <button type="button" onClick={dismissChecklist} className="text-xs muted hover:underline">
          Hide
        </button>
      </div>
      <ul className="space-y-2 text-sm">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-2.5">
            <span
              className="flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs"
              style={
                step.done
                  ? { background: 'var(--accent)', color: 'var(--accent-foreground)' }
                  : { border: '1px solid var(--border-color)' }
              }
            >
              {step.done ? '✓' : ''}
            </span>
            {step.href ? (
              <Link href={step.href} className="link">
                {step.label}
              </Link>
            ) : (
              <span className={step.done ? 'muted line-through' : undefined}>{step.label}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
