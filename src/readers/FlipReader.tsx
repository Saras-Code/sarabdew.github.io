import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PageFlip } from 'page-flip';
import type { ReaderHandle, ReaderProps } from './types';
import { spreadOf } from '../issue/sections';
import { ui } from '../content/copy';

type Props = ReaderProps & { mode: 'spread' | 'single'; pageW: number; pageH: number };

/**
 * Desktop and tablet reader with realistic page curl (StPageFlip).
 * page-flip owns the page wrapper elements; React renders into them through portals,
 * so the two never fight over the same DOM nodes.
 */
export const FlipReader = forwardRef<ReaderHandle, Props>(function FlipReader(
  { pages, start, onChange, mode, pageW, pageH },
  ref,
) {
  const host = useRef<HTMLDivElement>(null);
  const flip = useRef<PageFlip | null>(null);
  const current = useRef(start);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Wrapper elements are created once; page-flip moves them into its own container.
  const wrappers = useMemo(
    () =>
      pages.map((_, i) => {
        const el = document.createElement('div');
        el.className = 'flip-page';
        if (i === 0 || i === pages.length - 1) el.dataset.density = 'hard';
        return el;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pages.length],
  );
  const [, force] = useState(0);

  const visible = (i: number) => (mode === 'spread' ? spreadOf(i) : [i]);

  useEffect(() => {
    if (!host.current) return;
    // page-flip's destroy() removes its root element, so each init gets a fresh one.
    const root = document.createElement('div');
    root.className = 'flipbook__root';
    host.current.appendChild(root);
    const pf = new PageFlip(root, {
      width: pageW,
      height: pageH,
      size: 'fixed',
      showCover: true,
      usePortrait: mode === 'single',
      startPage: current.current,
      flippingTime: 900,
      maxShadowOpacity: 0.35,
      mobileScrollSupport: true,
      disableFlipByClick: true,
      showPageCorners: true,
      autoSize: true,
    } as never);
    pf.loadFromHTML(wrappers);
    pf.on('flip', (e) => {
      current.current = e.data as number;
      onChangeRef.current(visible(current.current));
    });
    flip.current = pf;
    force((n) => n + 1);
    onChangeRef.current(visible(current.current));
    return () => {
      // The wrappers survive (detached) and are re-attached on the next init.
      try {
        // destroy() leaves the requestAnimationFrame loop running; mute it so a stale
        // instance can't keep restyling the shared page wrappers.
        const r = (pf as unknown as { render?: { render: () => void } }).render;
        if (r) r.render = () => {};
        pf.destroy();
      } catch {
        /* already gone */
      }
      flip.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, pageW, pageH, wrappers]);

  useImperativeHandle(ref, () => ({
    goTo: (i) => {
      const pf = flip.current;
      if (!pf) return;
      if (visible(current.current).includes(i)) return;
      const dist = Math.abs(i - current.current);
      if (dist <= 2) pf.flip(i);
      else {
        pf.turnToPage(i);
        current.current = i;
        onChangeRef.current(visible(i));
      }
    },
    next: () => flip.current?.flipNext(),
    prev: () => flip.current?.flipPrev(),
  }));

  const width = mode === 'spread' ? pageW * 2 : pageW;
  const atStart = current.current === 0;
  const atEnd = visible(current.current).includes(pages.length - 1);

  return (
    <div
      className={`flipbook flipbook--${mode} ${atStart ? 'at-cover' : ''} ${atEnd && current.current === pages.length - 1 ? 'at-back' : ''}`}
      style={{ width, height: pageH }}
    >
      <div ref={host} className="flipbook__host" style={{ width, height: pageH }} />
      <button
        type="button"
        className="edge edge--prev"
        aria-label={ui.prev}
        disabled={atStart}
        onClick={() => flip.current?.flipPrev()}
      />
      <button
        type="button"
        className="edge edge--next"
        aria-label={ui.next}
        disabled={atEnd}
        onClick={() => flip.current?.flipNext()}
      />
      {wrappers.map((w, i) => createPortal(pages[i], w, `p${i}`))}
    </div>
  );
});
