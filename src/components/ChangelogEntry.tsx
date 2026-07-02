import { type ReactNode } from 'react';

interface ChangelogEntryProps {
  version: string;
  /** Bullet list of changes for this release */
  items: string[];
  /** Marks this as the current/latest release, shown with a badge and cyan border */
  latest?: boolean;
  /** Optional note shown under the heading, e.g. a link to exact release dates */
  note?: ReactNode;
  className?: string;
}

/**
 * ChangelogEntry
 * Standardized card for a single version/release entry: heading, optional
 * "LATEST" badge, optional note, and a bullet list of changes.
 */
export default function ChangelogEntry({ version, items, latest = false, note, className = '' }: ChangelogEntryProps) {
  return (
    <div className={`card-surface ${latest ? 'border-cyan-300/20' : ''} ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        {latest && (
          <span className="px-3 py-1 bg-cyan-300/10 border border-cyan-300/20 rounded-full text-xs font-bold text-cyan-300">
            LATEST
          </span>
        )}
        <h2 className="text-xl font-bold">{version}</h2>
      </div>
      {note && <p className="text-muted-foreground text-xs mb-3">{note}</p>}
      <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
