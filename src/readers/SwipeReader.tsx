import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { ReaderHandle, ReaderProps } from './types';

/** Phones: one page at a time, native horizontal swipe via CSS scroll-snap. */
export const SwipeReader = forwardRef<ReaderHandle, ReaderProps & { reduced: boolean }>(function SwipeReader(
  { pages, start, onChange, reduced },
  ref,
) {
  const track = useRef<HTMLDivElement>(null);
  const cur = useRef(start);

  const go = (i: number, smooth = !reduced) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(pages.length - 1, i));
    el.scrollTo({ left: n * el.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    go(start, false);
    onChange([start]);
    const el = track.current!;
    let t: number | undefined;
    const onScroll = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth);
        if (i !== cur.current) {
          cur.current = i;
          onChange([i]);
          // Each page starts at its top when you arrive on it.
          el.children[i]?.scrollTo?.({ top: 0 });
        }
      }, 80);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    goTo: (i) => go(i),
    next: () => go(cur.current + 1),
    prev: () => go(cur.current - 1),
  }));

  return (
    <div className="swipe" ref={track}>
      {pages.map((p, i) => (
        <div className="swipe__slide" key={i} aria-roledescription="page">
          {p}
        </div>
      ))}
    </div>
  );
});
