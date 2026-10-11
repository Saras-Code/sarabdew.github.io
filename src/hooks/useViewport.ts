import { useEffect, useState } from 'react';

const read = () =>
  typeof window === 'undefined'
    ? { w: 1440, h: 900 }
    : { w: window.innerWidth, h: window.innerHeight };

export function useViewport() {
  const [vp, setVp] = useState(read);
  useEffect(() => {
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => setVp(read()), 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return vp;
}

/** Book geometry: a two-page spread when it stays readable, otherwise one page. */
export function bookLayout(w: number, h: number) {
  const chrome = 96; // bottom bar + breathing room
  const spread = Math.min(1, (w - 64) / 1320, (h - chrome) / 800);
  if (spread >= 0.72) {
    return { mode: 'spread' as const, pageW: Math.round(660 * spread), pageH: Math.round(800 * spread) };
  }
  const single = Math.min(1.1, (w - 48) / 660, (h - chrome) / 800);
  return { mode: 'single' as const, pageW: Math.round(660 * single), pageH: Math.round(800 * single) };
}
