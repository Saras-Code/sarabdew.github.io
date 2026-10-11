// Decorative barcode, generated deterministically so it never changes between renders.
export function Barcode({ code = '0120261SARA' }: { code?: string }) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  let seed = 7;
  for (const ch of code + code) {
    seed = (seed * 31 + ch.charCodeAt(0)) % 997;
    for (let k = 0; k < 3; k++) {
      const w = 1 + ((seed >> k) % 3);
      bars.push({ x, w });
      x += w + 1 + ((seed >> (k + 2)) % 2);
    }
  }
  return (
    <div className="barcode" aria-hidden="true">
      <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none">
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={0} width={b.w} height={40} />
        ))}
      </svg>
      <span>0 12026 00101 7</span>
    </div>
  );
}
