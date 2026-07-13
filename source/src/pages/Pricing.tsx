import { useEffect } from 'react';
import { SEO } from '../lib/seo';

export default function Pricing() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <SEO
        title="Pricing · QECTOR"
        description="Purchase QECTOR Decoder v3. Transparent commercial licensing."
      />
      <div className="flex min-h-[60vh] items-center justify-center p-8 bg-void">
        <div
          dangerouslySetInnerHTML={{
            __html: `<stripe-buy-button
              buy-button-id="buy_btn_1TsoKxRsa9cg9l8A7ExMmc77"
              publishable-key="pk_live_51TslzuRsa9cg9l8AusKfWUqqji6ewsc5fIg04BCsvxHtZUhYJ84YXV7Xa9RPvBXTPdAx5vC3xtKRuxJ1hwZFioAl00axAE5v3I"
            ></stripe-buy-button>`
          }}
        />
      </div>
    </>
  );
}
