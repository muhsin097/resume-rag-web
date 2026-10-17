// One accent color per experience type -- gives each section a distinct,
// recognizable color instead of everything being the same neutral gray.
export const TYPE_BADGE_CLASSES: Record<string, string> = {
  EXPERIENCE: 'bg-indigo-100 text-indigo-800',
  EDUCATION: 'bg-violet-100 text-violet-800',
  CERTIFICATION: 'bg-amber-100 text-amber-800',
  PROJECT: 'bg-rose-100 text-rose-800',
  ACHIEVEMENT: 'bg-emerald-100 text-emerald-800',
  SKILL: 'bg-fuchsia-100 text-fuchsia-800',
  LANGUAGE: 'bg-cyan-100 text-cyan-800',
};

export const TYPE_BORDER_CLASSES: Record<string, string> = {
  EXPERIENCE: 'border-l-4 border-l-indigo-400',
  EDUCATION: 'border-l-4 border-l-violet-400',
  CERTIFICATION: 'border-l-4 border-l-amber-400',
  PROJECT: 'border-l-4 border-l-rose-400',
  ACHIEVEMENT: 'border-l-4 border-l-emerald-400',
  SKILL: 'border-l-4 border-l-fuchsia-400',
  LANGUAGE: 'border-l-4 border-l-cyan-400',
};
