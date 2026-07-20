import { Template } from '../Types';

/**
 * Deterministically constructs a real, highly tailored Boolean search string 
 * for a specific recruitment template and target platform.
 */
export function generateSourcingQuery(template: Template, platformId: string, customSkills: string[] = []): string {
  const keywords = template.keywords;
  const skills = customSkills.length > 0 ? customSkills : template.skills.slice(0, 3);
  const title = template.name;

  // Prepare components
  const titleGroup = keywords.slice(0, 2).map(k => `"${k}"`).join(' OR ');
  const skillsGroup = skills.map(s => s.includes(' ') ? `"${s}"` : s).join(' OR ');
  
  switch (platformId) {
    case 'linkedin':
      // LinkedIn standard search (no site: needed)
      return `(${titleGroup}) AND (${skillsGroup})`;

    case 'google':
      // Google X-Ray LinkedIn profiles
      return `site:linkedin.com/in/ (${titleGroup}) AND (${skillsGroup})`;

    case 'github':
      // Sourcing on GitHub profiles with "joined on" footprint
      return `site:github.com "joined on" (${skillsGroup}) "${title}"`;

    case 'stackoverflow':
      // Sourcing contributors on Stack Overflow users list
      return `site:stackoverflow.com/users (${skillsGroup}) "${title}"`;

    case 'naukri':
      // Indian resume databases on Naukri
      return `site:resumes.naukri.com (${titleGroup}) AND (${skillsGroup})`;

    case 'indeed':
      // Indeed resume databases
      return `site:indeed.com/r/ (${titleGroup}) AND (${skillsGroup})`;

    case 'dice':
      // Dice candidate databases
      return `site:dice.com/jobs/ (${titleGroup}) AND (${skillsGroup})`;

    case 'monster':
      // Monster profiles
      return `site:monster.com/profile (${titleGroup}) AND (${skillsGroup})`;

    case 'xing':
      // German professionals on Xing
      return `site:xing.com/profile (${titleGroup}) AND (${skillsGroup})`;

    case 'dribbble':
      // Graphic designers on Dribbble
      return `site:dribbble.com (${titleGroup}) "${skills[0] || 'Portfolio'}"`;

    case 'behance':
      // Portfolio designers on Behance
      return `site:behance.net (${titleGroup}) "${skills[0] || 'Design'}"`;

    case 'wellfound':
      // Startup profiles on Wellfound
      return `site:wellfound.com (${titleGroup}) AND (${skillsGroup})`;

    case 'careerbuilder':
      // CareerBuilder profiles/resumes
      return `site:careerbuilder.com/profiles (${titleGroup}) AND (${skillsGroup})`;

    case 'gitlab':
      // GitLab repositories & users
      return `site:gitlab.com (${skillsGroup}) "${title}"`;

    case 'bitbucket':
      // BitBucket profiles & code
      return `site:bitbucket.org (${skillsGroup}) "${title}"`;

    default:
      // Generic site: search or standard boolean
      return `(${titleGroup}) AND (${skillsGroup})`;
  }
}
