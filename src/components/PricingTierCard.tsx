import { Link } from 'react-router';

interface PricingTierCardProps {
  name: string;
  price: string;
  period?: string;
  desc: string;
  /** Included features, shown with a checkmark in the accent color. Omit for a compact price-only card. */
  features?: string[];
  /** Explicitly excluded/limited items, shown dimmed with a cross, not a checkmark */
  excluded?: string[];
  /** Highlights this tier as the recommended one */
  featured?: boolean;
  /** Whether to show the ribbon badge when featured (set false for border-only emphasis) */
  showRibbon?: boolean;
  /** Label shown on the featured ribbon, defaults to "Most Popular" */
  featuredLabel?: string;
  accent?: 'cyan' | 'gold';
  ctaLabel?: string;
  ctaHref?: string;
  centered?: boolean;
  className?: string;
}

/**
 * PricingTierCard
 * Shared card for a single pricing tier: name, price, description,
 * included/excluded features, and a CTA. Used across the Decoder, SATI OS,
 * and SATI CODEX pricing tables, which previously duplicated this markup
 * three times with only minor styling drift between them.
 *
 * Accessibility: included items use a checkmark, excluded items use a cross
 * (never a dimmed checkmark, which reads as "included" to a quick scan and
 * is meaningless to screen readers). Decorative glyphs are aria-hidden with
 * an sr-only label carrying the actual semantics.
 */
export default function PricingTierCard({
  name,
  price,
  period = '',
  desc,
  features,
  excluded,
  featured = false,
  showRibbon = true,
  featuredLabel = 'Most Popular',
  accent = 'cyan',
  ctaLabel = 'Contact Sales',
  ctaHref = '/contact',
  centered = false,
  className = '',
}: PricingTierCardProps) {
  const accentBorder = accent === 'gold' ? 'border-gold-400/30 neon-border-gold' : 'border-cyan-300/30 neon-border-cyan';
  const accentCheck = accent === 'gold' ? 'text-gold-400' : 'text-cyan-300';
  const accentRibbon = accent === 'gold' ? 'bg-gold-400 text-void' : 'bg-cyan-300 text-void';
  const ctaClass = accent === 'gold' ? 'btn-gold' : 'btn-cyan';

  return (
    <div className={`card-surface flex flex-col relative ${centered ? 'text-center' : ''} ${featured ? accentBorder : ''} ${className}`}>
      {featured && showRibbon && (
        <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${accentRibbon}`}>
          {featuredLabel}
        </span>
      )}
      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-2">{name}</div>
      <div className="text-primary font-bold text-3xl mb-1">
        {price}
        <span className="text-muted-foreground text-sm font-normal">{period}</span>
      </div>
      <p className="text-secondary text-sm mb-4">{desc}</p>
      {features && (
        <ul className="space-y-2 flex-1 mb-6">
          {features.map((f) => (
            <li key={f} className={`flex items-start gap-2 text-sm text-secondary ${centered ? 'text-left' : ''}`}>
              <span className={`${accentCheck} mt-0.5`} aria-hidden="true">✓</span>
              <span><span className="sr-only">Included: </span>{f}</span>
            </li>
          ))}
          {excluded?.map((f) => (
            <li key={f} className={`flex items-start gap-2 text-sm text-muted-foreground/70 ${centered ? 'text-left' : ''}`}>
              <span className="text-muted-foreground/60 mt-0.5" aria-hidden="true">✕</span>
              <span><span className="sr-only">Not included: </span>{f}</span>
            </li>
          ))}
        </ul>
      )}
      <Link to={ctaHref} className={`w-full text-center py-2.5 rounded-lg font-medium text-sm transition-all ${featured ? ctaClass : 'btn-outline'}`}>
        {ctaLabel}
      </Link>
    </div>
  );
}
