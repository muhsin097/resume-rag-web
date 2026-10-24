import type { SimpleIcon } from 'simple-icons';
import type { PortfolioSkill } from './data';
import { getTechIcon } from './tech-icons';

// Pure CSS animation (see .marquee-track in globals.css) -- no client JS
// needed for the scroll itself, so this stays a server component. The
// item list is duplicated so the -50% translateX loop has no visible seam.
export function SkillsMarquee({ skills }: { skills: PortfolioSkill[] }) {
  const logoSkills = skills
    .map((skill) => ({ skill, icon: getTechIcon(skill.title) }))
    .filter((entry): entry is { skill: PortfolioSkill; icon: SimpleIcon } => entry.icon !== null);

  if (logoSkills.length === 0) return null;

  const looped = [...logoSkills, ...logoSkills];

  return (
    <div className="marquee-viewport">
      <div className="marquee-track">
        {looped.map(({ skill, icon }, i) => (
          <div
            key={`${skill.title}-${i}`}
            className={`marquee-item${skill.evidenceCount > 0 ? ' is-evidenced' : ''}`}
            title={skill.evidenceCount > 0 ? `Used in ${skill.evidenceCount} role${skill.evidenceCount === 1 ? '' : 's'}: ${skill.roles.join(', ')}` : skill.title}
          >
            <svg viewBox="0 0 24 24" width={20} height={20} fill={`#${icon.hex}`} aria-hidden="true">
              <path d={icon.path} />
            </svg>
            <span>{skill.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
