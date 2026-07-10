import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export default function CodeBlock({ code, language = 'python', filename, className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`my-4 border border-gridline rounded-xl overflow-hidden bg-void/50 ${className}`}>
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gridline bg-surface/50 text-xs font-mono text-muted-foreground">
          <span>{filename}</span>
          <span className="uppercase text-[10px] bg-cyan-300/10 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-300/20">
            {language}
          </span>
        </div>
      )}
      <div className="relative group">
        <pre className="p-4 overflow-x-auto font-mono text-sm leading-relaxed text-secondary bg-void/30 max-h-[400px]">
          <code className={`language-${language}`}>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 bg-surface border border-gridline rounded-lg text-secondary hover:text-cyan-300 hover:border-cyan-300/30 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
