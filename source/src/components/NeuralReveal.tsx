import { useState, useEffect, useRef, useCallback } from 'react';

interface NeuralRevealProps {
  text: string;
  triggerOnView?: boolean;
  scrambleDuration?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

export default function NeuralReveal({
  text,
  triggerOnView = true,
  scrambleDuration = 1500,
  className = '',
  as: Tag = 'span',
}: NeuralRevealProps) {
  const [displayChars, setDisplayChars] = useState<string[]>(text.split('').map(() => '_'));
  const [resolved, setResolved] = useState<boolean[]>(text.split('').map(() => false));
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startAnimation = useCallback(() => {
    if (started) return;
    setStarted(true);

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayChars(text.split(''));
      setResolved(text.split('').map(() => true));
      return;
    }

    const totalChars = text.length;
    const charDelay = scrambleDuration / totalChars;

    // Scramble interval
    intervalRef.current = setInterval(() => {
      setDisplayChars((prev) => {
        const next = [...prev];
        const unresolvedIndices = next
          .map((_, i) => i)
          .filter((i) => !resolved[i] && text[i] !== ' ');
        if (unresolvedIndices.length === 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return next;
        }
        const idx = unresolvedIndices[Math.floor(Math.random() * unresolvedIndices.length)];
        next[idx] = CHARS[Math.floor(Math.random() * CHARS.length)];
        return next;
      });
    }, 20);

    // Resolve characters left to right
    for (let i = 0; i < totalChars; i++) {
      if (text[i] === ' ') {
        setResolved((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        setDisplayChars((prev) => {
          const next = [...prev];
          next[i] = ' ';
          return next;
        });
        continue;
      }
      const timeout = setTimeout(() => {
        setResolved((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        setDisplayChars((prev) => {
          const next = [...prev];
          next[i] = text[i];
          return next;
        });
      }, i * charDelay + 100);
      timeoutsRef.current.push(timeout);
    }

    // Cleanup interval after duration
    const cleanup = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, scrambleDuration + 500);
    timeoutsRef.current.push(cleanup);
  }, [text, scrambleDuration, started, resolved]);

  useEffect(() => {
    if (!triggerOnView) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [triggerOnView, startAnimation]);

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      <Tag className="font-mono" aria-label={text}>
        <span aria-hidden="true">
          {displayChars.map((char, i) => (
            <span
              key={i}
              className={`inline-block transition-opacity duration-100 ${
                resolved[i] ? 'opacity-100' : 'opacity-70'
              }`}
              style={{
                color: resolved[i] ? undefined : '#67e8f9',
                textShadow: resolved[i] ? undefined : '0 0 8px rgba(103, 232, 249, 0.5)',
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </Tag>
    </div>
  );
}
