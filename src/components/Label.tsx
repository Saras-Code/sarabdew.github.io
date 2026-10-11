import type { ReactNode } from 'react';

export const Label = ({ children, as: Tag = 'p' }: { children: ReactNode; as?: 'p' | 'h2' }) => (
  <Tag className="label">{children}</Tag>
);
