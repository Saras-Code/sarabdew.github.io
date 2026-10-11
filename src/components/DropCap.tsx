/** Paragraph with a drop cap on the first letter only (not trailing punctuation). */
export function DropCap({ text, className = '' }: { text: string; className?: string }) {
  return (
    <p className={`has-dropcap ${className}`}>
      <span className="dropcap">{text.charAt(0)}</span>
      {text.slice(1)}
    </p>
  );
}
