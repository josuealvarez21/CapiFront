'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { trackCta } from '@/lib/analytics';

export default function MobileCTA() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#090d16]/95 px-4 backdrop-blur-lg md:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))', paddingTop: '0.75rem' }}
    >
      <Link
        href="/register"
        onClick={() => trackCta('mobile_sticky', 'Crear cuenta gratis')}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#22c55e] px-5 py-3 text-sm font-black text-[#090d16]"
      >
        Crear cuenta gratis
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
