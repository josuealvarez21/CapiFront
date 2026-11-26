'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Mic, UserPlus, type LucideIcon } from 'lucide-react';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';

interface HowItWorksProps {
  reduceMotion: boolean;
}

const steps: { number: string; title: string; description: string; icon: LucideIcon }[] = [
  {
    number: '01',
    title: 'Crea tu cuenta',
    description:
      'Regístrate con tu correo o con Google y entra a tu dashboard en cuestión de segundos.',
    icon: UserPlus,
  },
  {
    number: '02',
    title: 'Registra o dicta',
    description:
      'Agrega ingresos y gastos a mano, o pídele al CapiBot que lo haga por ti. También con voz.',
    icon: Mic,
  },
  {
    number: '03',
    title: 'Mide y decide',
    description:
      'Revisa tu reporte mensual, ajusta tus Límites Escudo y reparte tu ahorro entre metas.',
    icon: CalendarDays,
  },
];

export default function HowItWorks({ reduceMotion }: HowItWorksProps) {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-24 border-y border-white/5 bg-[#0a0e17]/40 px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[11px] font-black uppercase tracking-[2px] text-[#4ade80]">
            Cómo funciona
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight neon-text sm:text-5xl">
            Tres pasos y ya estás al mando.
          </h2>
        </motion.div>

        <div className="relative mt-14">
          <motion.div
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={viewportOnce}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease: 'easeOut' }}
            className="absolute left-5 top-6 h-[calc(100%-3rem)] w-px origin-top bg-gradient-to-b from-[#3b82f6] to-[#22c55e] md:hidden"
          />
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: reduceMotion ? 0 : 1, ease: 'easeOut' }}
            className="absolute left-[16%] top-6 hidden h-px w-[68%] origin-left bg-gradient-to-r from-[#3b82f6] to-[#22c55e] md:block"
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="relative grid grid-cols-1 gap-10 md:grid-cols-3"
          >
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.number} variants={fadeUp} className="relative pl-14 md:pl-0">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#3b82f6] to-[#22c55e] text-xs font-black text-white shadow-[0_0_25px_-8px_rgba(59,130,246,0.9)] md:static md:mb-6">
                    {step.number}
                  </div>
                  <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-2 text-[#60a5fa] md:hidden">
                    <Icon size={16} aria-hidden="true" />
                  </div>
                  <div className="hidden md:block">
                    <Icon size={22} aria-hidden="true" className="text-[#4ade80]" />
                  </div>
                  <h3 className="mt-3 text-lg font-bold neon-text md:mt-3">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
