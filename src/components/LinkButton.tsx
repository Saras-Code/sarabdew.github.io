import { ui } from '../content/copy';

type Props = {
  label: string;
  href: string | null;
  variant?: 'solid' | 'outline' | 'text';
  className?: string;
};

/** External links open in a new tab; a null href renders a disabled "Coming soon" button. */
export function LinkButton({ label, href, variant = 'solid', className = '' }: Props) {
  const cls = `btn btn--${variant} ${className}`;
  if (!href) {
    return (
      <span className={`${cls} btn--soon`} role="link" aria-disabled="true" title={ui.comingSoon}>
        {label}
        <small className="btn__soon">{ui.comingSoon}</small>
      </span>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a
      className={cls}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      {...(href.endsWith('.pdf') ? { target: '_blank', rel: 'noopener' } : {})}
    >
      {label}
    </a>
  );
}
