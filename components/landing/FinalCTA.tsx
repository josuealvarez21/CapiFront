'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, viewportOnce } from '@/lib/motion';
import { trackCta } from '@/lib/analytics';

export default function FinalCTA() {
  return (
    <section className="px-4 pb-24 pt-4 sm:px-6 sm:pb-32 lg:px-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-r from-[#3b82f6]/50 via-[#3b82f6]/20 to-[#22c55e]/50 p-px shadow-[0_0_80px_-30px_rgba(59,130,246,0.7)]"
      >
        <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[#0a0e17] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#3b82f6] opacity-20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#22c55e] opacity-20 blur-3xl"
          />
          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[2px] text-[#4ade80]">
              Empieza hoy
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight neon-text sm:text-5xl">
              Tu plata, por fin en orden.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-400 sm:text-base">
              Crea tu cuenta gratis y descubre por qué Cápi es el hub financiero que te acompaña.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register"
                  onClick={() => trackCta('final_cta', 'Crear cuenta gratis')}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#22c55e] px-6 py-4 text-sm font-black text-[#090d16] shadow-[0_10px_30px_-10px_rgba(34,197,94,0.8)] transition-all duration-300 hover:bg-[#16a34a] sm:w-auto"
                >
                  Crear cuenta gratis
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-black text-white transition-all duration-300 hover:bg-white/10 sm:w-auto"
                >
                  Ya tengo cuenta
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
