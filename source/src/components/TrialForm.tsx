import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { TRIAL_ENDPOINT, PRICES } from '../lib/pricing';

type State = 'idle' | 'sending' | 'done' | 'error';

const TEXT = {
  en: {
    label: 'Work e-mail',
    placeholder: 'you@company.com',
    terms: 'I accept the',
    termsLink: 'licence terms',
    termsTail: `(${PRICES.trialDays}-day commercial evaluation, internal use only).`,
    submit: `Start ${PRICES.trialDays}-day trial`,
    sending: 'Sending…',
    done: 'Check your inbox: your trial token arrives within a few minutes.',
    error: 'Something went wrong. Please retry, or email admin@qector.store.',
    termsRequired: 'Please accept the licence terms.',
  },
  fr: {
    label: 'Courriel professionnel',
    placeholder: 'vous@entreprise.com',
    terms: 'J’accepte les',
    termsLink: 'conditions de licence',
    termsTail: `(évaluation commerciale de ${PRICES.trialDays} jours, usage interne seulement).`,
    submit: `Commencer l’essai de ${PRICES.trialDays} jours`,
    sending: 'Envoi…',
    done: 'Vérifiez votre boîte de réception : votre jeton d’essai arrive d’ici quelques minutes.',
    error: 'Une erreur est survenue. Réessayez ou écrivez à admin@qector.store.',
    termsRequired: 'Veuillez accepter les conditions de licence.',
  },
} as const;

/**
 * Self-serve commercial trial: posts {email, accept_terms} to the fulfilment
 * Worker, which e-mails a 14-day Pro token (one per address per year). The
 * response is the same whether or not the address already had a trial, so the
 * form never reveals who is a customer.
 */
export default function TrialForm({ lang = 'en' }: { lang?: 'en' | 'fr' }) {
  const t = TEXT[lang];
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!form.get('accept_terms')) {
      setState('error');
      setMessage(t.termsRequired);
      return;
    }
    setState('sending');
    try {
      const response = await fetch(TRIAL_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: String(form.get('email') || ''),
          accept_terms: true,
          website: String(form.get('website') || ''),
        }),
      });
      if (response.ok) {
        setState('done');
        setMessage(t.done);
      } else {
        const body = await response.json().catch(() => ({}));
        setState('error');
        setMessage(typeof body.error === 'string' ? body.error : t.error);
      }
    } catch {
      setState('error');
      setMessage(t.error);
    }
  }

  if (state === 'done') {
    return (
      <p role="status" className="text-cyan-200 text-sm font-medium max-w-sm">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 text-left" noValidate={false}>
      <label className="block text-xs uppercase tracking-wider text-secondary" htmlFor={`trial-email-${lang}`}>
        {t.label}
      </label>
      <input
        id={`trial-email-${lang}`}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder={t.placeholder}
        className="w-full rounded-lg bg-void/80 border border-cyan-300/30 px-4 py-3 text-primary placeholder:text-muted-foreground focus:outline-none focus:border-cyan-300"
      />
      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="flex items-start gap-2 text-xs text-secondary">
        <input type="checkbox" name="accept_terms" className="mt-0.5 accent-cyan-400" />
        <span>
          {t.terms}{' '}
          <Link to={lang === 'fr' ? '/license' : '/license'} className="text-cyan-300 hover:underline">
            {t.termsLink}
          </Link>{' '}
          {t.termsTail}
        </span>
      </label>
      <button type="submit" disabled={state === 'sending'} className="btn-cyan w-full py-3 font-bold disabled:opacity-60">
        {state === 'sending' ? t.sending : t.submit}
      </button>
      {state === 'error' && (
        <p role="alert" className="text-red-300 text-xs">
          {message}
        </p>
      )}
    </form>
  );
}
