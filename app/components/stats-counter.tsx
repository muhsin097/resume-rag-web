'use client';

import { useEffect, useRef, useState } from 'react';

// Placeholder numbers, hardcoded per request -- modest/plausible rather
// than inflated, since fabricated traffic claims sit oddly next to a
// product whose whole pitch is "nothing is invented." Swap for the real
// counts from /admin/overview (src/admin/admin.service.ts already
// computes userCount/generationCount) once there's real traffic worth
// showing.
const STATS = [
  { label: 'Candidates', value: 50 },
  { label: 'Recruiters', value: 12 },
  { label: 'Resumes tailored', value: 120 },
];

function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    let frame: number;
    function tick(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

function StatItem({ label, value }: { label: string; value: number }) {
  const count = useCountUp(value);
  return (
    <div className="text-center">
      <div className="font-heading text-3xl font-bold" style={{ color: 'var(--accent)' }}>
        {count}+
      </div>
      <div className="text-xs muted">{label}</div>
    </div>
  );
}

export function StatsCounter() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 sm:justify-start sm:gap-12">
      {STATS.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  );
}
