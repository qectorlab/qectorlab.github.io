import { type ReactNode } from 'react';

interface EvidenceBlockProps {
  /** e.g. "Validation Report" */
  title: string;
  /** Plain-language statement of what was validated and how */
  statement: ReactNode;
  /** Link out to the primary artifact, e.g. Zenodo DOI record */
  href?: string;
  linkLabel?: string;
  className?: string;
}

/**
 * EvidenceBlock
 * Surfaces a single piece of reproducible evidence (Zenodo DOI, test suite
 * results, hardware validation) as a distinct, citable unit rather than
 * folding it into general marketing copy. Use one per concrete artifact.
 */
export default function EvidenceBlock({ title, statement, href, linkLabel = 'View evidence →', className = '' }: EvidenceBlockProps) {
  return (
    <div className={`relative rounded-2xl border border-cyan-300/20 bg-void p-6 overflow-hidden ${className}`}>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-cyan-300/5 to-transparent" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300">{title}</span>
        </div>
        <p className="text-secondary leading-relaxed mb-4">{statement}</p>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 text-sm font-medium hover:underline underline-offset-4"
          >
            {linkLabel}
          </a>
        )}
      </div>
    </div>
  );
}
