'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

interface TurnstileFieldProps {
  onToken: (token: string) => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
    };
  }
}

export default function TurnstileField({ onToken }: TurnstileFieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteKey || !ref.current) return;

    const render = () => {
      if (!window.turnstile || !ref.current) return;
      window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token: string) => onToken(token),
        'error-callback': () => trackEvent('turnstile_error', {}),
      });
    };

    if (window.turnstile) {
      render();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = render;
    document.head.appendChild(script);
  }, [onToken]);

  if (!siteKey) return null;

  return (
    <div className="my-2 flex justify-center" data-sitekey={siteKey}>
      <div ref={ref} />
    </div>
  );
}
