import { useEffect, useRef, useState } from 'react';

/** Counts from 0 to `target` the first time the element becomes visible. */
export function useCountUp<T extends Element>(target: number, reduced: boolean, duration = 1400) {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(target);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') {
      setValue(target);
      return;
    }
    done.current = false;
    setValue(0);
    let raf = 0;
    const io = new IntersectionObserver((entries) => {
      if (done.current || !entries.some((e) => e.isIntersecting)) return;
      done.current = true;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, reduced, duration]);

  return { ref, value };
}
