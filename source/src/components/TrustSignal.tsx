import type { ReactNode } from 'react';

interface TrustSignalProps {
  icon: ReactNode;
  label: string;
  href: string;
  variant?: 'default' | 'gold';
  className?: string;
}

/**
 * TrustSignal
 * Single pill used in trust bars linking out to external, verifiable
 * artifacts (PyPI, GitHub, ORCID, published books, etc).
 */
export default function TrustSignal({ icon, label, href, variant = 'default', className = '' }: TrustSignalProps) {
  const styles =
    variant === 'gold'
      ? 'bg-gold-400/10 border border-gold-400/30 text-gold-400 hover:bg-gold-400/20'
      : 'bg-surface border border-gridline text-secondary hover:text-cyan-300 hover:border-cyan-300/30';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm transition-all duration-300 ${styles} ${className}`}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </a>
  );
}
