import { useCallback, useEffect, useRef } from 'react';

interface ScrollRevealOptions {
  /** Vertical offset, in pixels, the element rises from. */
  y?: number;
  /** Animation length in milliseconds. */
  duration?: number;
}

/**
 * Reveal-on-scroll for page sections, with no animation library.
 *
 *   const addRef = useScrollReveal();
 *   <div ref={(el) => addRef(el)}>…</div>
 *
 * Each registered element fades and rises into place once, the first time it
 * enters the viewport. Elements are visible by default: without JavaScript,
 * in prerendered HTML, and for visitors who ask for reduced motion, nothing
 * is ever hidden. The second argument of the returned callback is ignored; it
 * exists so call sites written as `addRef(el, index)` keep working.
 */
export function useScrollReveal({ y = 30, duration = 600 }: ScrollRevealOptions = {}) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const registered = useRef(new Set<HTMLElement>());
  const revealed = useRef(new WeakSet<HTMLElement>());

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const done = revealed.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (!entry.isIntersecting) {
            // Below the fold: wait out of sight until it scrolls in.
            el.style.opacity = '0';
            continue;
          }
          observer.unobserve(el);
          done.add(el);
          el.style.opacity = '';
          el.animate(
            [
              { opacity: 0, transform: `translateY(${y}px)` },
              { opacity: 1, transform: 'none' },
            ],
            { duration, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
          );
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    observerRef.current = observer;
    const elements = registered.current;
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      observerRef.current = null;
      // Never leave an element hidden once nothing is watching it.
      elements.forEach((el) => {
        if (!done.has(el)) el.style.opacity = '';
      });
    };
  }, [y, duration]);

  return useCallback((el: HTMLElement | null, index?: number) => {
    void index;
    if (!el || revealed.current.has(el) || registered.current.has(el)) return;
    registered.current.add(el);
    observerRef.current?.observe(el);
  }, []);
}
