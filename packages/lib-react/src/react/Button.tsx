import type { ReactNode, CSSProperties } from 'react';

export type ButtonProps = {
  label?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  children?: ReactNode;
};

export function Button({ label, onClick, variant = 'primary', className, children }: ButtonProps) {
  const base: CSSProperties = {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid',
    cursor: 'pointer',
    fontSize: 14
  };

  const style: CSSProperties =
    variant === 'secondary'
      ? { ...base, background: 'white', color: '#333', borderColor: '#999' }
      : variant === 'ghost'
      ? { ...base, background: 'transparent', color: '#444', borderColor: 'transparent' }
      : { ...base, background: '#2563eb', color: 'white', borderColor: '#1d4ed8' };

  return (
    <button style={style} onClick={onClick} className={className}>
      {children ?? label}
    </button>
  );
}
