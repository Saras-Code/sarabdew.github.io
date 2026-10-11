import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { ReaderHandle, ReaderProps } from './types';

/** "Read as one page": the whole issue as a normal scrolling page. */
export const ScrollReader = forwardRef<ReaderHandle, ReaderProps & { reduced: boolean }>(function ScrollReader(
  { pages, start, onChange, reduced },
  ref,
) {
  const root = useRef<HTMLDivElement>(null);
  const cur = useRef(start);

  const go = (i: number, smooth = !reduced) => {
    const el = root.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  };

  useEffect(() => {
    if (start > 0) go(start, false);
    onChange([start]);
    const kids = Array.from(root.current!.children);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = kids.indexOf(e.target);
            if (i !== cur.current) {
              cur.current = i;
              onChange([i]);
            }
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    kids.forEach((k) => io.observe(k));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    goTo: (i) => go(i),
    next: () => go(cur.current + 1),
    prev: () => go(cur.current - 1),
  }));

  return (
    <div className="scroll" ref={root}>
      {pages.map((p, i) => (
        <div className="scroll__page" key={i}>
          {p}
        </div>
      ))}
    </div>
  );
});
