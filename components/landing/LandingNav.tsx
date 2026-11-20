'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LandingLogo from '@/components/landing/LandingLogo';
import { fadeUpSmall } from '@/lib/motion';

const anchors = [
  { href: '#funciones', label: 'Funciones' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#demo', label: 'Demo' },
];

export default function LandingNav() {
  const { token, loading } = useAuth();
  const ctaHref = token ? '/app' : '/login';
  const ctaLabel = token ? 'Ir al dashboard' : 'Entrar a la Bóveda';

  return (
    <motion.header
      variants={fadeUpSmall}
      initial="hidden"
      animate="show"
      className="sticky top-0 z-50 border-b border-white/10 bg-[#090d16]/80 backdrop-blur-xl"
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
      >
        <Link href="/" aria-label="Cápi, inicio" className="flex items-center rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6]">
          <LandingLogo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {anchors.map((anchor) => (
            <a
              key={anchor.href}
              href={anchor.href}
              className="text-xs font-bold uppercase tracking-wider text-gray-400 transition-colors hover:text-white"
            >
              {anchor.label}
            </a>
          ))}
        </div>

        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          <Link
            href={ctaHref}
            aria-disabled={loading}
            tabIndex={loading ? -1 : undefined}
            className={`group inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-wider transition-all duration-300 sm:px-5 sm:text-xs ${
              token
                ? 'bg-[#22c55e] text-[#090d16] hover:bg-[#16a34a] hover:shadow-[0_8px_24px_-8px_rgba(34,197,94,0.6)]'
                : 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:shadow-[0_8px_24px_-8px_rgba(59,130,246,0.5)]'
            } ${loading ? 'pointer-events-none opacity-60' : ''}`}
          >
            {loading ? 'Cargando…' : ctaLabel}
            {!loading && (
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            )}
          </Link>
        </motion.div>
      </nav>
    </motion.header>
  );
}
