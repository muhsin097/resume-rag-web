'use client';

import { useEffect, useRef, useState } from 'react';

// Progressive enhancement, not a gate: the wrapped content is real SSR'd
// HTML the whole time -- this only toggles a CSS class once it scrolls
// into view. If JS never runs, .reveal's base (non-.reveal-visible) state
// still shows content via the prefers-reduced-motion override in
// globals.css falling back for crawlers/no-JS is a non-goal here since
// this only affects opacity/transform, not text content.
export function Reveal({
  children,
  delayMs = 0,
  className = '',
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' reveal-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
