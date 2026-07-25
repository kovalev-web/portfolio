/**
 * Single source of truth for homepage copy.
 * Everything the site renders comes from here — swapping content should never
 * mean touching a component.
 */

export const profile = {
  name: 'Dmitrii Kovalev',
  role: 'Senior Product Designer',
  location: 'SE Asia',
  email: 'weerdmolls@gmail.com',
  avatar: '/media/avatar.jpg',
  headline: 'Product designer with 9 years in SaaS, CRM systems, and admin interfaces',
  bio: "I'm a product designer with 9 years of practice, currently based in SE Asia. I work on the unglamorous end of software — fintech CRMs, admin panels, internal tools — where a design system and a clear flow are worth more than a hero animation.",
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kovalev-web/' },
    { label: 'Behance', href: 'https://www.behance.net/kovalev-web' },
    { label: 'Telegram', href: 'https://t.me/weerdmolls' },
    { label: 'CV', href: '/cv' },
  ],
};

/**
 * Product shot sitting in the hero card.
 */
export const heroMedia: { src: string; alt: string }[] = [
  { src: '/media/screela%201.png', alt: 'QuestTick — altcoin pump monitor' },
  { src: '/media/screela%201.png', alt: 'Project screenshot 2' },
  { src: '/media/screela%201.png', alt: 'Project screenshot 3' },
];

/* `stats` and `highlights` fed the old right-hand rail in the hero, which is
   gone. Kept here in case they come back somewhere else. */
export const stats = [
  { value: '9', label: 'Years designing products' },
  { value: '3', label: 'Design systems built and maintained' },
  { value: '40+', label: 'Features shipped end-to-end' },
  { value: '150+', label: 'Components documented' },
];

/** Right-hand hero slider — side projects, writing, whatever is current. */
export const highlights = [
  {
    kicker: 'Side project · Live',
    title: 'QuestTick — altcoin pump monitor',
    href: 'https://questtick.com',
    image: '/media/questtick.webp',
    tint: '#5b53f5',
  },
  {
    kicker: 'Design system',
    title: 'One component library across three product surfaces',
    href: '/work/design-system',
    image: '/media/system.webp',
    tint: '#1f6feb',
  },
  {
    kicker: 'Case study',
    title: 'Cohort analysis that traffic managers actually read',
    href: '/work/cohort',
    image: '/media/cohort.webp',
    tint: '#0f766e',
  },
];

export const projects = [
  { title: 'Trade Scope', kicker: 'Fintech · Mobile + Web', href: '/work/trade-scope' },
  { title: 'Brokerage CRM', kicker: 'Fintech · Dashboard', href: '/work/brokerage-crm' },
  { title: 'My Path', kicker: 'EdTech · Mobile app', href: '/work/my-path' },
  { title: 'Control Panel', kicker: 'Fintech · Admin panel', href: '/work/control-panel' },
  { title: 'FlowForge', kicker: 'SaaS · Workflow tool', href: '/work/flowforge' },
];

/** Big type rows in the skills band. `media` expands inline on scroll-in. */
export const skills = [
  { before: 'Product', after: 'design', media: '/media/skill-product.mp4' },
  { before: 'Design', after: 'systems', media: '/media/skill-systems.mp4' },
  { before: 'Complex', after: 'dashboards', media: '/media/skill-dashboards.mp4' },
  { before: 'UX', after: 'research', media: '/media/skill-research.mp4' },
  { before: 'Prototyping', after: '& handoff', media: '/media/skill-handoff.mp4' },
];

export type Job = {
  company: string;
  role: string;
  period: string;
  /** Fallback shown while the logo loads or if the file is missing. */
  initials: string;
  logo?: string;
  summary?: string;
  bullets: string[];
};

/** Newest first — the accordion renders them in this order. */
export const experience: Job[] = [
  {
    company: '01.tech',
    role: 'Senior Product Designer',
    period: 'Jun 2025 – May 2026',
    initials: '01',
    logo: '/media/logos/logo-01tech.webp',
    bullets: [
      'Designed features end-to-end — discovery, user flows, Figma specs, and developer handoff',
      'Contributed to and maintained the internal design system across 3 product surfaces',
      'Partnered with PMs and engineers in sprint cycles; led design reviews and established documentation standards',
    ],
  },
  {
    company: 'Proscom',
    role: 'Senior Product Designer',
    period: 'Jan 2025 – Jul 2025',
    initials: 'PS',
    logo: '/media/logos/logo-proscom.png',
    bullets: [
      'Designed product features for an education platform end-to-end — discovery, user flows, Figma specs, and developer handoff',
      'Designed interfaces for an investment product — onboarding, dashboards, and key user flows',
    ],
  },
  {
    company: 'IREV',
    role: 'Lead Product Designer',
    period: 'Oct 2019 – Jun 2024',
    initials: 'IR',
    logo: '/media/logos/logo-irev.webp',
    summary:
      'Worked on developing and maintaining internal design systems to improve user experience and streamline workflows.',
    bullets: [
      'Created a unified design system for internal CRM platforms.',
      'Analyzed user behavior to optimize workflows and product usability.',
      'Standardized UI components for consistency across products.',
      'Managed a team of designers, improving processes with Scrum methodologies.',
      'Updated project documentation to simplify collaboration with developers.',
      'Prepared presentations to communicate design updates to stakeholders.',
    ],
  },
  {
    company: 'qmobi',
    role: 'UX/UI Designer, Product Designer',
    period: 'Aug 2017 – Apr 2018',
    initials: 'qm',
    logo: '/media/logos/logo-qmobi.webp',
    summary:
      'Full-time position. Development of CMS product concepts and company product interfaces.',
    bullets: [
      'Designed a CMS product for Facebook to streamline asset management for advertising creatives.',
      'Implemented features for creative assembly and moderation to enhance workflow efficiency.',
      'Improved user interfaces for company products, ensuring usability and consistency.',
    ],
  },
  {
    company: 'QIWI Ltd',
    role: 'UX/UI Designer',
    period: 'Feb 2017 – Apr 2017',
    initials: 'QW',
    logo: '/media/logos/logo-qiwi.webp',
    summary:
      'Project work. Experimental development of interface concepts. Implementation of successful solutions into the product\'s current interfaces.',
    bullets: [
      'Developed and tested interface concepts to improve usability and design.',
      'Implemented successful solutions into existing product interfaces.',
      'Designed application concepts for A/B testing to optimize online banking patterns.',
    ],
  },
  {
    company: 'Optionlift',
    role: 'UI Designer',
    period: 'Aug 2016 – Apr 2017',
    initials: 'OL',
    logo: '/media/logos/logo-optionlift.webp',
    summary:
      'Project work focused on designing and developing corporate websites and a CRM system for broker brands.',
    bullets: [
      'Designed and developed corporate websites for broker brands, including custom branding and logo creation.',
      'Created a CRM system for managing trading platforms, focusing on usability and efficiency.',
      'Worked on enhancing user experience and visual consistency across web projects.',
      'Collaborated with a remote team in a virtual office environment to deliver high-quality designs on time.',
    ],
  },
  {
    company: 'Goodwork',
    role: 'UX/UI Designer',
    period: 'May 2014 – Apr 2015',
    initials: 'GW',
    logo: '/media/logos/logo-goodwork.webp',
    summary:
      'Full-time position. Designing and developing websites for local businesses, including major clients like Gazprom\'s regional office.',
    bullets: [
      'Created logos, brand identities, landing pages, and website redesigns tailored to client needs.',
      'Prototyped interfaces and workflows in Axure to ensure usability and functionality.',
      'Provided design consulting and guided clients through the design process.',
    ],
  },
  {
    company: 'inogroup',
    role: 'Graphic / Print Designer',
    period: 'Nov 2011 – Feb 2012',
    initials: 'in',
    logo: '/media/logos/logo-inogroup.webp',
    summary:
      'Full-time position. Designed printed materials for the company and corporate clients within established brand guidelines.',
    bullets: [
      'Created layouts for flyers, banners, calendars, business cards, and other promotional materials.',
      'Developed designs aligned with corporate identity standards for both in-house and client projects.',
      'Delivered high-quality print-ready files, ensuring consistency and attention to detail.',
    ],
  },
];
