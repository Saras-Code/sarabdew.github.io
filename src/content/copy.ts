// All of Sara's copy, verbatim from the brief. Do not edit wording here
// without Sara's sign-off. Anything not from the brief is marked // NEW COPY.
import { links } from './links';

export const cover = {
  topLine: 'Issue 01 · Seattle',
  masthead: 'SARA',
  subtitle: 'The Barthel de Weydenthal Issue',
  lines: [
    'How a math paper turned into a dating app',
    '220+ users, zero ad spend',
    'From Goldman Sachs to PIMCO',
    'Fashion, poetry and emerging tech',
  ],
  bottom: 'Mathematics · Founder · Product',
};

export const contents = {
  label: 'Contents',
  items: [
    { folio: '04', title: 'Cover Story: Posy', hash: 'posy' },
    { folio: '06', title: 'Work', hash: 'work' },
    { folio: '07', title: 'Projects', hash: 'projects' },
    { folio: '08', title: 'Fashion Scholarship Fund', hash: 'style' },
    { folio: '09', title: 'Say Hi', hash: 'contact' },
  ],
};

export const letter = {
  label: "Editor's Letter",
  heading: "Hi, I'm Sara, and welcome to my website!",
  body: [
    "I grew up in Warsaw and now study Mathematics and Economics at the University of Washington. As a dual citizen of the US and Poland, I learned early to move between two ways of seeing the world, and I've been bridging worlds ever since: math and markets, tech and finance, analysis and creativity.",
    "What I love most is connecting ideas across fields, and I want to put that, along with my entrepreneurial drive, toward building consumer products. Outside of work, you'll find me immersed in fashion, writing poetry, or exploring the Pacific Northwest.",
  ],
  signature: 'Sara',
  signoff: 'Sara Barthel de Weydenthal, Editor-in-Chief',
};

export const posy = {
  stats: [
    { value: 220, decimals: 0, suffix: '+', label: 'users' },
    { value: 50, decimals: 0, suffix: '', label: 'matches' },
    { value: 35, decimals: 0, suffix: '', label: 'users surveyed' },
    { value: 10, decimals: 0, suffix: '%', label: 'top of YC Fall 2026 applicants' },
  ],
  asOf: '',
  label: 'Cover Story',
  headline: 'How a math paper turned into a dating app',
  subhead: 'Co-Founder & CEO, Posy Social Inc. · Feb 2025 to present · Seattle',
  body: [
    'I co-founded Posy and built it end to end: I wrote the product spec for every feature and user flow, ran sprint planning and reviews, and shipped a three-tier app (React Native, Firebase, Python) with my co-founder, built on a compatibility algorithm adapted from my graph theory research.',
    'A 35-user survey and a two-month closed beta set the roadmap. Posy grew from 0 to 220+ users and 50 matches at UW, placed in the top 10% of Y Combinator Fall 2026 applicants, and was featured in The Daily.',
  ],
  buttons: [
    { label: 'Download Posy', href: links.appStore },
    { label: 'Watch the demo', href: links.demo },
    { label: "Read The Daily's article", href: links.dailyArticle },
    { label: 'Investors: request our deck', href: links.deck },
  ],
};

export const work = {
  label: 'Work',
  heading: "Where I've worked",
  buttons: [
    { label: 'My resume (PDF)', href: links.resume },
    { label: 'LinkedIn', href: links.linkedin },
  ],
  roles: [
    {
      year: '2026',
      company: 'PIMCO',
      title: 'Product Strategy Summer Analyst',
      location: 'Newport Beach, CA',
      line: "Built the business case for a new ETF and authored the team's AI strategy roadmap on Microsoft Copilot.",
    },
    {
      year: '2025',
      company: 'Goldman Sachs',
      title: 'Summer Analyst',
      location: 'New York, NY',
      line: 'Modeled deposit betas and stress-tested credit risk scenarios in Transaction Banking.',
    },
    {
      year: '2025',
      company: 'Dorm Room Fund',
      title: 'Venture Capital Fellow',
      location: 'Remote',
      line: 'Sourced and evaluated student-led startups.',
    },
    {
      year: '2022',
      company: 'Crystal Equation (Meta)',
      title: 'Junior Data Operations Engineer',
      location: 'Warsaw, Poland',
      line: 'Built Python data pipelines and Presto SQL analytics for global product teams.',
    },
  ],
};

export const projects = {
  label: 'Projects',
  heading: "Things I've built",
  items: [
    {
      name: 'Kids Code Fun / Girls Code Fun',
      meta: 'Coding Instructor & Curriculum Developer · Jan 2018 to Jun 2021',
      line: 'Taught weekly coding classes to students ages 8 to 16 and designed the curriculum.',
    },
    {
      name: 'Web Impact UW',
      meta: 'Product Manager & Engineer · Jan 2024 to Jul 2024',
      line: 'Led a 5-person team building a full-stack educational web app (React, Firebase).',
    },
    {
      name: 'PhysicsBeyond',
      meta: 'Quantum Computing Research Scholar · Apr 2024 to Jun 2024',
      line: 'Quantum neural networks on IBM hardware that beat classical ML sales forecasts by 15%.',
      button: { label: 'GitHub', href: links.iqrg },
    },
    {
      name: 'UW Department of Mathematics',
      meta: 'Mathematics Researcher · Jan 2024 to Mar 2024',
      line: "Modeled matchmaking with graph theory in Python; the basis for Posy's engine.",
      button: { label: 'Paper', href: links.mathPaper },
    },
    {
      name: 'UW CareerWomin',
      meta: 'Founder & President',
      line: 'Grew it from zero to 149+ members in 6 months.',
    },
  ],
};

export const style = {
  label: 'Style',
  heading: 'Fashion Scholarship Fund',
  body: 'Named a Fashion Scholarship Fund scholar in 2025 and 2026.',
  caseStudies: [
    { year: '2026', name: 'Be My Valentino: Raya x Valentino', img: 'fsf-2026.png', href: links.fsf2026 },
    { year: '2025', name: "DKNY: You Can't Spell It Girl Without I.T.", img: 'fsf-2025.png', href: links.fsf2025 },
  ],
  alsoLabel: 'Also honored',
  also: ['Top Analyst, UW Investment Group', 'Speaker, Perspektywy Women in STEM Summit'],
};

export const contact = {
  masthead: 'SARA',
  heading: 'Want to learn more?',
  body: 'Send me a message:',
  buttons: [
    { label: 'saraannabdw@gmail.com', href: links.email },
    { label: 'My resume (PDF)', href: links.resume },
    { label: 'LinkedIn', href: links.linkedin },
    { label: 'GitHub', href: links.github },
  ],
  footer:
    '© 2026 Sara Barthel de Weydenthal. Designed and built with ❤️',
};

// NEW COPY: interface labels only
export const ui = {
  contents: 'Contents',
  readOnePage: 'Read as one page',
  readMagazine: 'Read as a magazine',
  comingSoon: 'Coming soon',
  prev: 'Previous page',
  next: 'Next page',
};
