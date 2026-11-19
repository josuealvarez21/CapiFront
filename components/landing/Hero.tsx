'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import DashboardMockup from '@/components/landing/DashboardMockup';
import { fadeUp, stagger } from '@/lib/motion';

interface HeroProps {
  reduceMotion: boolean;
}

export default function Hero({ reduceMotion }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl text-center"
      >
        <motion.div
          variants={fadeUp}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass-soft px-4 py-2 text-[10px] font-black uppercase tracking-[2px] text-gray-300"
        >
          <span className="h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.9)]" />
          Finanzas personales con inteligencia
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl font-extrabold leading-[1.05] tracking-tight neon-text sm:text-6xl lg:text-7xl"
        >
          Controla tu destino financiero.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg"
        >
          Ingresos, gastos, metas y presupuestos en un solo lugar. Y un asistente que te entiende,
          incluso cuando le hablas.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/register"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#22c55e] px-6 py-4 text-sm font-black text-[#090d16] shadow-[0_10px_30px_-10px_rgba(34,197,94,0.8)] transition-all duration-300 hover:bg-[#16a34a] hover:shadow-[0_14px_36px_-10px_rgba(34,197,94,0.9)] sm:w-auto"
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
              className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-6 py-4 text-sm font-black text-white transition-all duration-300 hover:shadow-[0_8px_24px_-8px_rgba(59,130,246,0.5)] sm:w-auto"
            >
              Entrar a la Bóveda
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="mx-auto mt-14 max-w-6xl sm:mt-20">
        <DashboardMockup reduceMotion={reduceMotion} />
      </div>
    </section>
  );
}
