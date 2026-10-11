// Every URL on the site lives here. `null` means the link is still a TODO
// and renders as a disabled "Coming soon" button, never a dead link.

export const EMAIL = 'saraannabdw@gmail.com';

export const links = {
  appStore: 'https://apps.apple.com/us/app/posy-dating/id6757773162',
  demo: 'https://drive.google.com/file/d/1QahR5AsCooDNUJF5oY2LuMIYVnlfDGUM/view?usp=sharing',
  dailyArticle:
    'https://www.dailyuw.com/article/student-built-app-posy-enters-the-seattle-dating-scene-20260526',
  deck: `mailto:${EMAIL}?subject=Posy%20deck`,
  email: `mailto:${EMAIL}`,
  resume: 'resume.pdf',
  linkedin: 'https://www.linkedin.com/in/sara-barthel-de-weydenthal',
  github: 'https://github.com/Saras-Code',
  iqrg: 'https://github.com/Saras-Code/iqrg',
  mathPaper: 'https://drive.google.com/file/d/1MWI40mSaprWfuS9-9A6hmHMArJJhNxjt/view?usp=sharing',
  fsf2025: 'https://drive.google.com/file/d/1fWYJC7nfUNiDnbxytJeNgRGQQdM2XYyw/view?usp=sharing',
  fsf2026: 'https://drive.google.com/file/d/1qY2NbgS7XlgdU1ci67PSCq0tVDCfVIc6/view?usp=sharing',
} as const satisfies Record<string, string | null>;
