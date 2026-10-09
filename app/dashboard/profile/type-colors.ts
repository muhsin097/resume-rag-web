// One accent color per experience type -- gives each section a distinct,
// recognizable color instead of everything being the same neutral gray.
export const TYPE_BADGE_CLASSES: Record<string, string> = {
  EXPERIENCE: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
  EDUCATION: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
  CERTIFICATION: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  PROJECT: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
  ACHIEVEMENT: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  SKILL: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-200',
};

export const TYPE_BORDER_CLASSES: Record<string, string> = {
  EXPERIENCE: 'border-l-4 border-l-indigo-400 dark:border-l-indigo-500',
  EDUCATION: 'border-l-4 border-l-violet-400 dark:border-l-violet-500',
  CERTIFICATION: 'border-l-4 border-l-amber-400 dark:border-l-amber-500',
  PROJECT: 'border-l-4 border-l-rose-400 dark:border-l-rose-500',
  ACHIEVEMENT: 'border-l-4 border-l-emerald-400 dark:border-l-emerald-500',
  SKILL: 'border-l-4 border-l-fuchsia-400 dark:border-l-fuchsia-500',
};
