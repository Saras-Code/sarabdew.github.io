import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { issuePages } from './issue/Pages';
import { PAGE_COUNT, hashForPages, indexForHash } from './issue/sections';
import { useMediaQuery, useReducedMotion } from './hooks/useMediaQuery';
import { bookLayout, useViewport } from './hooks/useViewport';
import type { ReaderHandle } from './readers/types';
import { FlipReader } from './readers/FlipReader';
import { FadeReader } from './readers/FadeReader';
import { SwipeReader } from './readers/SwipeReader';
import { ScrollReader } from './readers/ScrollReader';
import { ui } from './content/copy';

const initialIndex = () => indexForHash(window.location.hash) ?? 0;

export function App() {
  const reduced = useReducedMotion();
  const phone = useMediaQuery('(max-width: 767px)');
  const { w, h } = useViewport();
  const layout = bookLayout(w, h);
  const [onePage, setOnePage] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).has('one');
    } catch {
      return false;
    }
  });
  const [visible, setVisible] = useState<number[]>(() => [initialIndex()]);
  const startRef = useRef(initialIndex());
  const reader = useRef<ReaderHandle>(null);
  const pages = useMemo(() => issuePages(reduced), [reduced]);

  const onChange = useCallback((v: number[]) => {
    setVisible(v);
    startRef.current = v[0];
    const hash = hashForPages(v);
    const url = hash ? `#${hash}` : window.location.pathname + window.location.search;
    if (window.location.hash !== (hash ? `#${hash}` : '')) history.replaceState(null, '', url);
  }, []);

  // Deep links and Contents clicks both arrive as hash changes.
  useEffect(() => {
    const onHash = () => {
      const i = indexForHash(window.location.hash);
      if (i !== null) reader.current?.goTo(i);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (onePage || e.altKey || e.metaKey || e.ctrlKey) return;
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        reader.current?.next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        reader.current?.prev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onePage]);

  const toggle = () => {
    setOnePage((v) => !v);
    window.scrollTo(0, 0);
  };

  const goContents = () => reader.current?.goTo(1);

  const common = { pages, start: startRef.current, onChange };
  let body;
  if (onePage) body = <ScrollReader ref={reader} {...common} reduced={reduced} />;
  else if (phone) body = <SwipeReader ref={reader} {...common} reduced={reduced} />;
  else if (reduced) body = <FadeReader ref={reader} {...common} {...layout} key={layout.mode} />;
  else body = <FlipReader ref={reader} {...common} {...layout} />;

  const counter =
    visible.length > 1
      ? `${String(visible[0] + 1).padStart(2, '0')}-${String(visible[1] + 1).padStart(2, '0')}`
      : String(visible[0] + 1).padStart(2, '0');

  return (
    <div className={`app ${onePage ? 'app--scroll' : phone ? 'app--swipe' : 'app--book'}`}>
      <main className="stage" aria-label="SARA, Issue 01">
        {body}
      </main>
      <nav className="bar" aria-label="Magazine">
        <button type="button" className="bar__btn" onClick={goContents}>
          {ui.contents}
        </button>
        {!onePage && (
          <div className="bar__pager">
            <button type="button" className="bar__arrow" aria-label={ui.prev} onClick={() => reader.current?.prev()}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
            </button>
            <p className="bar__count" aria-live="polite">
              <span className="sr-only">Page </span>
              {counter} <span className="bar__of">/ {PAGE_COUNT}</span>
            </p>
            <button type="button" className="bar__arrow" aria-label={ui.next} onClick={() => reader.current?.next()}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
            </button>
          </div>
        )}
        <button type="button" className="bar__btn" aria-pressed={onePage} onClick={toggle}>
          {onePage ? ui.readMagazine : ui.readOnePage}
        </button>
      </nav>
    </div>
  );
}
