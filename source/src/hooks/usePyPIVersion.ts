import { useEffect, useState } from 'react';
import { fetchLatestQectorVersion } from '../lib/pypiVersion';

export function usePyPIVersion() {
  const [version, setVersion] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchLatestQectorVersion().then((v) => {
      if (mounted) {
        setVersion(v);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return { version, loading };
}
