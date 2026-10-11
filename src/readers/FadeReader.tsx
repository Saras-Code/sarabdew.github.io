import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import type { ReaderHandle, ReaderProps } from './types';
import { spreadOf } from '../issue/sections';
import { ui } from '../content/copy';

type Props = ReaderProps & { mode: 'spread' | 'single'; pageW: number; pageH: number };

/** Reduced-motion reader: same spreads, a simple crossfade instead of a page curl. */
export const FadeReader = forwardRef<ReaderHandle, Props>(function FadeReader(
  { pages, start, onChange, mode, pageW, pageH },
  ref,
) {
  const group = (i: number) => (mode === 'spread' ? spreadOf(i) : [i]);
  const [cur, setCur] = useState(start);
  const vis = group(cur);

  useEffect(() => onChange(group(cur)), [cur, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = (dir: 1 | -1) =>
    setCur((c) => {
      const g = group(c);
      const n = dir === 1 ? g[g.length - 1] + 1 : g[0] - 1;
      return Math.max(0, Math.min(pages.length - 1, n));
    });

  useImperativeHandle(ref, () => ({
    goTo: (i) => setCur(i),
    next: () => step(1),
    prev: () => step(-1),
  }));

  const width = mode === 'spread' ? pageW * 2 : pageW;
  return (
    <div
      className={`fadebook fadebook--${mode} ${cur === 0 ? 'at-cover' : ''} ${vis.length === 1 && vis[0] === pages.length - 1 ? 'at-back' : ''}`}
      style={{ width, height: pageH }}
    >
      <div className="fadebook__spread" key={vis.join('-')}>
        {vis.map((i) => (
          <div
            key={i}
            className="flip-page fadebook__page"
            style={{
              width: pageW,
              height: pageH,
              marginLeft: mode === 'spread' && i === 0 ? pageW : undefined,
            }}
          >
            {pages[i]}
          </div>
        ))}
      </div>
      <button type="button" className="edge edge--prev" aria-label={ui.prev} disabled={vis[0] === 0} onClick={() => step(-1)} />
      <button
        type="button"
        className="edge edge--next"
        aria-label={ui.next}
        disabled={vis.includes(pages.length - 1)}
        onClick={() => step(1)}
      />
    </div>
  );
});
