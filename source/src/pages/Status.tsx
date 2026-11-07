import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import { CLAUDE_PLUGIN_RELEASE, PYPI_VERSION } from '../lib/releases';

// Live status, checked from the visitor's browser on each load: the licence
// service health endpoint, the published PyPI version, and the revocation
// list. Licence verification itself never depends on any of these: tokens are
// verified offline, so an outage here never stops installed software.

type State = 'checking' | 'ok' | 'degraded' | 'down';
interface Check { name: string; detail: string; state: State; note?: string }

const LABEL: Record<State, string> = { checking: 'Checking…', ok: 'Operational', degraded: 'Degraded', down: 'Unavailable' };
const DOT: Record<State, string> = { checking: 'bg-slate-500', ok: 'bg-green-400', degraded: 'bg-amber-400', down: 'bg-red-400' };

async function timed<T>(fn: () => Promise<T>): Promise<[T, number]> {
  const t0 = performance.now();
  const v = await fn();
  return [v, Math.round(performance.now() - t0)];
}

export default function Status() {
  const [checks, setChecks] = useState<Check[]>([
    { name: 'Licence fulfilment', detail: 'Issues licence tokens after payment', state: 'checking' },
    { name: 'Package index (PyPI)', detail: 'qector-decoder-v3 downloads', state: 'checking' },
    { name: 'Revocation list', detail: 'Published list of revoked licences', state: 'checking' },
  ]);
  const [checkedAt, setCheckedAt] = useState<string>('');

  useEffect(() => {
    // Build-time prerender: keep the neutral "Checking…" state in static HTML.
    if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return;
    const ctrl = new AbortController();
    const set = (i: number, patch: Partial<Check>) => setChecks((c) => c.map((x, j) => (j === i ? { ...x, ...patch } : x)));
    (async () => {
      try {
        const [h, ms] = await timed(async () => (await fetch('/stripe/health', { signal: ctrl.signal, cache: 'no-store' })).json());
        const healthy = h?.ok && h?.key_matches_decoder !== false && h?.signing_key;
        set(0, { state: healthy ? 'ok' : 'degraded', note: `v${h?.version ?? '?'} · ${ms} ms${h?.key_matches_decoder ? ' · signing key matches the decoder' : ''}` });
      } catch {
        if (!ctrl.signal.aborted) set(0, { state: 'down', note: 'No response. Payments are kept and fulfilled when it recovers.' });
      }
      try {
        const [j, ms] = await timed(async () => (await fetch('https://pypi.org/pypi/qector-decoder-v3/json', { signal: ctrl.signal })).json());
        const v = j?.info?.version;
        set(1, { state: v ? 'ok' : 'degraded', note: `latest ${v ?? '?'} · ${ms} ms` });
      } catch {
        if (!ctrl.signal.aborted) set(1, { state: 'down', note: 'PyPI did not respond from your network.' });
      }
      try {
        const [t, ms] = await timed(async () => (await fetch('/stripe/revoked.txt', { signal: ctrl.signal, cache: 'no-store' })).text());
        const n = t.split('\n').filter((l) => l.trim() && !l.startsWith('#')).length;
        set(2, { state: t.startsWith('#') ? 'ok' : 'degraded', note: `${n} revoked · ${ms} ms` });
      } catch {
        if (!ctrl.signal.aborted) set(2, { state: 'down' });
      }
      if (!ctrl.signal.aborted) setCheckedAt(new Date().toLocaleString());
    })();
    return () => ctrl.abort();
  }, []);

  const overall: State = checks.some((c) => c.state === 'checking') ? 'checking' : checks.every((c) => c.state === 'ok') ? 'ok' : checks.some((c) => c.state === 'down') ? 'down' : 'degraded';

  return (
    <>
      <SEO title="Status · QECTOR" description="Live status of QECTOR's licence fulfilment, package index and revocation list. Installed software never depends on these: licences verify offline." />
      <section className="relative pt-32 pb-12 md:pt-36 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300/5 via-surface/30 to-void" />
        <div className="relative z-10 section-padding max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6">Status</h1>
          <p className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gridline bg-surface text-primary" role="status" aria-live="polite">
            <span className={`w-2.5 h-2.5 rounded-full ${DOT[overall]}`} aria-hidden="true" />
            {overall === 'ok' ? 'All systems operational' : overall === 'checking' ? 'Checking…' : overall === 'down' ? 'Some systems unavailable' : 'Some systems degraded'}
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          <ul className="bg-[#0b1329]/40 border border-slate-800/80 rounded-2xl divide-y divide-slate-800/80">
            {checks.map((c) => (
              <li key={c.name} className="flex items-start justify-between gap-4 p-5">
                <div>
                  <p className="text-primary font-semibold">{c.name}</p>
                  <p className="text-secondary text-sm">{c.detail}</p>
                  {c.note && <p className="text-muted-foreground text-xs mt-1 font-mono">{c.note}</p>}
                </div>
                <span className="inline-flex items-center gap-2 text-sm text-secondary whitespace-nowrap">
                  <span className={`w-2 h-2 rounded-full ${DOT[c.state]}`} aria-hidden="true" />{LABEL[c.state]}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-xs text-center">{checkedAt ? `Checked from your browser at ${checkedAt}.` : 'Checking from your browser…'} Reload to check again.</p>

          <div className="bg-[#0b1329]/40 border border-slate-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3">Your installed software is not affected by outages</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Licence tokens are verified offline against a key inside the package, so decoding never waits on any service on this page.
              If fulfilment is down when you pay, Stripe keeps the payment event and the token is issued as soon as the service recovers.
              Current releases: decoder <span className="font-mono text-cyan-300">{PYPI_VERSION}</span>, Claude plugin{' '}
              <span className="font-mono text-cyan-300">{CLAUDE_PLUGIN_RELEASE.version}</span>. Problems? E-mail{' '}
              <a href="mailto:admin@qector.store" className="text-cyan-300 hover:underline">admin@qector.store</a> or see <Link to="/security" className="text-cyan-300 hover:underline">Security</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
