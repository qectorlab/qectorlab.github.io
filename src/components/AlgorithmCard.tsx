type BadgeColor = 'cyan' | 'green' | 'purple' | 'gold';

interface AlgorithmCardProps {
  /** e.g. "Exact MWPM — Validated" */
  title: string;
  /** Short technical tag shown as small mono text above the title, e.g. "Blossom + Belief-Matching" */
  tag?: string;
  /** Colored pill shown next to the title instead of `tag`, e.g. { label: 'Best LER', color: 'cyan' } */
  badge?: { label: string; color: BadgeColor };
  /** What it is and why it matters, plain language first */
  desc: string;
  /** Optional single concrete fact/number to anchor the claim, e.g. "d = 3–15, exact parity" */
  proof?: string;
  /** Dims the card for research-stage / experimental entries */
  muted?: boolean;
  className?: string;
}

const BADGE_STYLES: Record<BadgeColor, string> = {
  cyan: 'bg-cyan-300/10 text-cyan-300 border border-cyan-300/20',
  green: 'bg-green-400/10 text-green-400 border border-green-400/20',
  purple: 'bg-purple-400/10 text-purple-400 border border-purple-400/20',
  gold: 'bg-gold-400/10 text-gold-400 border border-gold-400/20',
};

/**
 * AlgorithmCard
 * Standardized card for describing one decoding algorithm: what it is,
 * a technical tag or status badge, and (optionally) the concrete evidence
 * backing it. Keeping `proof` separate from `desc` stops the copy from
 * reading as a wall of undifferentiated claims. Use `muted` for
 * research-stage entries that shouldn't compete visually with production ones.
 */
export default function AlgorithmCard({ title, tag, badge, desc, proof, muted = false, className = '' }: AlgorithmCardProps) {
  return (
    <div className={`card-surface group ${muted ? 'border-gridline/50 opacity-80' : ''} ${className}`}>
      {tag && <div className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-2">{tag}</div>}

      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className={`font-semibold text-lg transition-colors ${muted ? 'text-gold-400/80' : 'text-cyan-300 group-hover:text-cyan-200'}`}>
          {title}
        </h3>
        {badge && (
          <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${muted ? 'bg-gold-400/5 text-gold-400/60 border border-gold-400/20' : BADGE_STYLES[badge.color]}`}>
            {badge.label}
          </span>
        )}
      </div>

      <p className={`leading-relaxed ${muted ? 'text-muted-foreground text-sm' : 'text-secondary'}`}>{desc}</p>

      {proof && (
        <div className="mt-4 pt-4 border-t border-gridline/60 flex items-center gap-2 text-xs">
          <span className="text-green-400">✓</span>
          <span className="text-muted-foreground font-mono">{proof}</span>
        </div>
      )}
    </div>
  );
}
