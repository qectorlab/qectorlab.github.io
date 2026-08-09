import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedPage({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
    if (!containerRef.current) return;
    
    // Select all major sections or cards to animate
    const elements = containerRef.current.querySelectorAll('.card-surface, .section-padding > div, section > div.max-w-3xl, section > div.max-w-4xl, section > div.max-w-5xl, section > div.max-w-7xl, .prose');
    
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });

    });

    return () => {
      ctx.revert();
    };


  return (
    <div ref={containerRef} className={`animated-page-wrapper ${className}`}>
      {children}
    </div>
  );
}
