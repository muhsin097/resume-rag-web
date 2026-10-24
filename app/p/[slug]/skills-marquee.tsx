import type { SimpleIcon } from 'simple-icons';
import type { PortfolioSkill } from './data';
import { getTechIcon } from './tech-icons';

// Below this, duplicating the list for a seamless -50% loop just reads as
// duplicated data (e.g. a single "Figma, Figma" pair) rather than an
// illusion of continuous motion -- not enough items for the trick to work.
const MIN_ITEMS_TO_LOOP = 4;

function LogoChip({ skill, icon }: { skill: PortfolioSkill; icon: SimpleIcon }) {
  return (
    <div
      className="marquee-item"
      title={
        skill.evidenceCount > 0
          ? `Used in ${skill.evidenceCount} role${skill.evidenceCount === 1 ? '' : 's'}: ${skill.roles.join(', ')}`
          : skill.title
      }
    >
      <svg viewBox="0 0 24 24" width={20} height={20} fill={`#${icon.hex}`} aria-hidden="true">
        <path d={icon.path} />
      </svg>
      <span>{skill.title}</span>
    </div>
  );
}

// Pure CSS animation (see .marquee-track in globals.css) -- no client JS
// needed for the scroll itself, so this stays a server component.
export function SkillsMarquee({ skills }: { skills: PortfolioSkill[] }) {
  const logoSkills = skills
    .map((skill) => ({ skill, icon: getTechIcon(skill.title) }))
    .filter((entry): entry is { skill: PortfolioSkill; icon: SimpleIcon } => entry.icon !== null);

  if (logoSkills.length === 0) return null;

  if (logoSkills.length < MIN_ITEMS_TO_LOOP) {
    return (
      <div className="flex flex-wrap gap-3">
        {logoSkills.map(({ skill, icon }) => (
          <LogoChip key={skill.title} skill={skill} icon={icon} />
        ))}
      </div>
    );
  }

  const looped = [...logoSkills, ...logoSkills];

  return (
    <div className="marquee-viewport">
      <div className="marquee-track">
        {looped.map(({ skill, icon }, i) => (
          <LogoChip key={`${skill.title}-${i}`} skill={skill} icon={icon} />
        ))}
      </div>
    </div>
  );
}
