import { type ReactNode } from 'react';

interface SectionHeaderProps {
  /** Optional small uppercase pill above the heading, e.g. "Performance" */
  eyebrow?: string;
  /** Main heading text or a component like <NeuralReveal /> */
  heading: ReactNode;
  /** Supporting paragraph beneath the heading */
  description?: ReactNode;
  align?: 'center' | 'left';
  maxWidth?: string;
  className?: string;
}

/**
 * SectionHeader
 * Consistent eyebrow + heading + description pattern for every major
 * section across the site (Platform, Benchmarks, Evidence, Pricing, etc).
 */
export default function SectionHeader({
  eyebrow,
  heading,
  description,
  align = 'center',
  maxWidth = 'max-w-3xl',
  className = '',
}: SectionHeaderProps) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`${maxWidth} ${alignment} mb-12 md:mb-16 ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-medium text-cyan-300 uppercase tracking-wider mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
      {description && <p className="text-secondary text-lg leading-relaxed">{description}</p>}
    </div>
  );
}
