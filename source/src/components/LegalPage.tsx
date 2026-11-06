import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';
import NeuralReveal from './NeuralReveal';
import { alternatesFor, tokenize, type LegalDoc } from '../lib/legal';

function Inline({ text }: { text: string }) {
  return (
    <>
      {tokenize(text).map((t, i) => {
        if (t.kind === 'bold') return <strong key={i} className="text-primary">{t.text}</strong>;
        if (t.kind === 'code') return <code key={i} className="font-mono text-[0.9em] text-cyan-200">{t.text}</code>;
        if (t.kind === 'link') {
          const href = t.href ?? '#';
          if (href.startsWith('/')) return <Link key={i} to={href} className="text-cyan-300 hover:underline">{t.text}</Link>;
          const external = href.startsWith('http');
          return (
            <a key={i} href={href} className="text-cyan-300 hover:underline [overflow-wrap:anywhere]" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {t.text}
            </a>
          );
        }
        return <span key={i}>{t.text}</span>;
      })}
    </>
  );
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const fr = doc.lang === 'fr';
  return (
    <>
      <SEO title={doc.seoTitle} description={doc.description} lang={doc.lang} alternates={alternatesFor(doc)} />

      <section className="relative py-24 md:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/30 to-void" />
        <div className="relative z-10 section-padding">
          <div className="inline-flex flex-wrap justify-center items-center gap-2 px-3 py-1.5 bg-surface border border-gridline rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            {doc.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <NeuralReveal text={doc.title} className="text-4xl md:text-6xl font-extrabold" />
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            <Inline text={doc.intro} />
          </p>
          {doc.version && <p className="text-xs text-muted-foreground mt-4">{doc.version}</p>}
          <p className="text-sm mt-4">
            <Link to={doc.twin} hrefLang={fr ? 'en' : 'fr'} className="text-cyan-300 hover:underline">
              {fr ? 'English version' : 'Version française'}
            </Link>
          </p>
        </div>
      </section>

      <section className="section-padding pb-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <nav aria-label={fr ? 'Sommaire' : 'Contents'} className="card-surface">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">{fr ? 'Sommaire' : 'Contents'}</h2>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm list-none pl-0">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-secondary hover:text-cyan-300">{s.heading}</a>
                </li>
              ))}
            </ul>
          </nav>

          {doc.sections.map((s) => (
            <div key={s.id} id={s.id} className={`card-surface scroll-mt-24 ${s.accent ? 'border-cyan-300/25' : ''}`}>
              <h2 className="text-xl font-bold mb-4">{s.heading}</h2>
              {s.paras?.map((p, i) => (
                <p key={i} className="text-secondary text-sm leading-relaxed mb-3 last:mb-0">
                  <Inline text={p} />
                </p>
              ))}
              {s.bullets && (
                <ul className="space-y-2 text-secondary text-sm leading-relaxed list-disc pl-5 mt-2">
                  {s.bullets.map((b, i) => (
                    <li key={i}><Inline text={b} /></li>
                  ))}
                </ul>
              )}
              {s.table && (
                <div className="overflow-x-auto mt-3" tabIndex={0} role="region" aria-label={s.heading}>
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-gridline">
                        <th className="py-2 pr-4 font-semibold text-primary">{s.table.head[0]}</th>
                        <th className="py-2 font-semibold text-primary">{s.table.head[1]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map(([a, b], i) => (
                        <tr key={i} className="border-b border-gridline/50 align-top">
                          <td className="py-2 pr-4 text-primary md:whitespace-nowrap"><Inline text={a} /></td>
                          <td className="py-2 text-secondary"><Inline text={b} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
