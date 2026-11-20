'use client';

import { useEffect, useState } from 'react';

interface ShareButtonsProps {
  title: string;
  path: string;
}

export default function ShareButtons({ title, path }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // El origen solo existe en cliente; se sincroniza como efecto (valor externo).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShareUrl(`${window.location.origin}${path}`);
  }, [path]);

  const share = async () => {
    const url = shareUrl;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // El usuario canceló: se mantiene el fallback.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Compartir</span>
      <button
        type="button"
        onClick={share}
        className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/10"
      >
        {copied ? 'Enlace copiado' : 'Compartir'}
      </button>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/10"
      >
        WhatsApp
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/10"
      >
        X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/10"
      >
        LinkedIn
      </a>
    </div>
  );
}
