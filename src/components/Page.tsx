import type { ReactNode } from 'react';

export type PageVariant = 'cream' | 'burgundy' | 'blush' | 'navy';

type Props = {
  n: number;
  side: 'left' | 'right';
  variant?: PageVariant;
  label: string;
  folio?: boolean;
  className?: string;
  children: ReactNode;
};

export function Page({ n, side, variant = 'cream', label, folio = true, className = '', children }: Props) {
  return (
    <article
      className={`page page--${variant} page--${side} ${className}`}
      data-page={n}
      aria-label={`Page ${n}: ${label}`}
    >
      <div className="page__inner">
        {children}
        {folio && (
          <footer className="folio" aria-hidden="true">
            <span className="folio__num">{String(n).padStart(2, '0')}</span>
            <span className="folio__mast">SARA</span>
          </footer>
        )}
      </div>
    </article>
  );
}
