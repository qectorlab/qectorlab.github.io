import { useEffect, useId, useState, type ReactNode } from 'react';

// On phones, long sections show a short preview and a "Show more" button.
// From the md breakpoint up, the content is always shown in full. The full
// content is always in the DOM (prerendered HTML, search engines, no-JS);
// the clamp is CSS scoped to .js-enabled, so it applies on first paint.
const MOBILE = '(max-width: 767px)';

export default function MobileCollapse({
  children,
  more = 'Show more',
  less = 'Show less',
}: {
  children: ReactNode;
  more?: string;
  less?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const clamped = mobile && !open;
  return (
    <div className="mobile-collapse" data-open={open ? 'true' : 'false'}>
      {/* inert keeps clipped links out of the tab order while collapsed. */}
      <div id={id} className="mobile-collapse__body" inert={clamped}>
        {children}
      </div>
      <div className="mobile-collapse__bar">
        <button
          type="button"
          className="btn-outline"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? less : more}
        </button>
      </div>
    </div>
  );
}
