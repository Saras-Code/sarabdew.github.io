import { useState } from 'react';

type Props = { src: string; alt: string; placeholder: string; className?: string; eager?: boolean };

/** Shows a labeled placeholder until the asset exists in /public. */
export function Img({ src, alt, placeholder, className = '', eager = false }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`placeholder ${className}`} role="img" aria-label={alt}>
        <span>{placeholder}</span>
      </div>
    );
  }
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}
