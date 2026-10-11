import { useCountUp } from '../hooks/useCountUp';

type Props = { value: number; decimals: number; suffix: string; label: string; reduced: boolean };

export function StatCard({ value, decimals, suffix, label, reduced }: Props) {
  const { ref, value: v } = useCountUp<HTMLDivElement>(value, reduced);
  const shown = v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const final = value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <div className="stat" ref={ref}>
      <p className="stat__num" aria-hidden="true">
        {shown}
        {suffix}
      </p>
      <p className="stat__label">
        <span className="sr-only">
          {final}
          {suffix}{' '}
        </span>
        {label}
      </p>
    </div>
  );
}
