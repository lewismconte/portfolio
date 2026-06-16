// Site-wide constants. Edit these in one place.

export const SITE = {
  title: 'Lewis Conte',
  tagline: 'Architectural Designer',
  description:
    'Architecture, computational design and BIM tooling by Lewis Conte — selected projects and an ongoing notebook on design, technology and the building craft.',
  author: 'Lewis Conte',
  // Used for absolute URLs in OG tags / RSS. Must match astro.config `site`.
  url: 'https://lewismconte.github.io',
  locale: 'en',
  ogImage: 'og-default.png',
} as const;

export const SOCIAL = {
  email: 'lewismconte@gmail.com',
  github: 'https://github.com/lewismconte',
  linkedin: 'https://www.linkedin.com/in/lewis-conte-514aa7174',
} as const;

// Project categories — the single source of truth, mirrored by the Zod enum
// in src/content.config.ts. Order here is the order shown in the filter.
export const CATEGORIES = [
  'Built Projects & Professional Work',
  'Computational Design',
  'BIM',
  'Research & Concept Projects',
  'Technical Documentation',
  'Creative Practice',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const NAV = [
  { label: 'Work', href: '/projects' },
  { label: 'Lab', href: '/lab' },
  { label: 'Notebook', href: '/blog' },
  { label: 'About', href: '/about' },
] as const;
