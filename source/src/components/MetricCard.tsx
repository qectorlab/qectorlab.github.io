import { type ReactNode } from 'react';

type MetricCardVariant = 'default' | 'gold' | 'compact';

interface MetricCardProps {
  /** Short label/headline for the metric, e.g. "+35.7% Advantage" */
  label: string;
  /** Optional large prominent value shown between label and desc, e.g. "d=3-15" */
  value?: string;
  /** Supporting explanation, one to two sentences */
  desc: string;
  /** Optional leading icon/emoji, kept separate from label for consistent spacing */
  icon?: ReactNode;
  variant?: MetricCardVariant;
  centered?: boolean;
  className?: string;
}

/**
 * MetricCard / KeyStat
 * Standardized display for a single validated number or claim.
 * Used for hero stat rows, decoder metrics, benchmark highlights.
 * Pass `value` for a stat-card layout (small label, big value, small desc).
 */
export default function MetricCard({ label, value, desc, icon, variant = 'default', centered = false, className = '' }: MetricCardProps) {
  const isCompact = variant === 'compact';
  const accent = variant === 'gold' ? 'text-gold-400' : 'text-green-400';
  const align = centered ? 'text-center' : '';

  if (value) {
    return (
      <div className={`card-surface ${align} ${className}`}>
        <div className="text-cyan-300 font-mono text-xs uppercase tracking-wider mb-1">{label}</div>
        <div className="text-primary font-bold text-2xl mb-2">{value}</div>
        <p className="text-secondary text-xs leading-relaxed">{desc}</p>
      </div>
    );
  }

  return (
    <div
      className={`${isCompact ? 'p-4' : 'p-5'} bg-void border border-gridline rounded-xl transition-colors duration-300 hover:border-cyan-300/30 ${className}`}
    >
      <div className={`${accent} font-bold text-sm mb-2 flex items-center gap-2`}>
        {icon && <span aria-hidden="true">{icon}</span>}
        <span>{label}</span>
      </div>
      <p className="text-secondary text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

