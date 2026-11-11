import { startTransition, useEffect, useState } from 'react';
import { fetchLatestQectorVersion } from '../lib/pypiVersion';
import { APP_CONFIG } from '../lib/config';

export function usePyPIVersion() {
  const [version, setVersion] = useState<string>(APP_CONFIG.version);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchLatestQectorVersion().then((v) => {
      if (!mounted) return;
      // Not urgent, and it can arrive while React is still attaching to the
      // page's static HTML: as a transition it waits for that to finish. An
      // ordinary update would make React discard static content it has not
      // reached yet (the simulator on Home) and render it again.
      startTransition(() => {
        setVersion(v);
        setLoading(false);
      });
    });
    return () => { mounted = false; };
  }, []);

  return { version, loading };
}
