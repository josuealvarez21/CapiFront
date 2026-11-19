'use client';

import { motion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CalendarDays,
  Lock,
  Target,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';

interface FeatureBentoProps {
  reduceMotion: boolean;
}

type Visual = 'flow' | 'goal' | 'shield' | 'report' | 'bot' | 'lock';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  chip: string;
  border: string;
  glow: string;
  visual: Visual;
}

const features: Feature[] = [
  {
    title: 'Flujo de caja en vivo',
    description: 'Cada ingreso y cada gasto, organizado al instante con sus categorías reales.',
    icon: TrendingUp,
    accent: '#3b82f6',
    chip: 'text-[#60a5fa] bg-[#3b82f6]/15 border-[#3b82f6]/30',
    border: 'border-[#3b82f6]/40',
    glow: 'hover:border-[#3b82f6]/80 hover:shadow-[0_0_40px_-8px_rgba(59,130,246,0.6)]',
    visual: 'flow',
  },
  {
    title: 'Metas que avanzan',
    description: 'Define un objetivo, reparte tu ahorro y mira cómo se acerca la fecha límite.',
    icon: Target,
    accent: '#22c55e',
    chip: 'text-[#4ade80] bg-[#22c55e]/15 border-[#22c55e]/30',
    border: 'border-[#22c55e]/40',
    glow: 'hover:border-[#22c55e]/80 hover:shadow-[0_0_40px_-8px_rgba(34,197,94,0.6)]',
    visual: 'goal',
  },
  {
    title: 'Límites Escudo',
    description: 'Ponle tope a cada categoría y detecta cuándo tu gasto se sale del plan.',
    icon: Wallet,
    accent: '#60a5fa',
    chip: 'text-[#60a5fa] bg-[#3b82f6]/15 border-[#3b82f6]/30',
    border: 'border-[#3b82f6]/40',
    glow: 'hover:border-[#3b82f6]/80 hover:shadow-[0_0_40px_-8px_rgba(59,130,246,0.6)]',
    visual: 'shield',
  },
  {
    title: 'Reporte mensual',
    description: 'Compara contra el mes anterior y entiende exactamente dónde se fue tu plata.',
    icon: CalendarDays,
    accent: '#a78bfa',
    chip: 'text-[#a78bfa] bg-[#8b5cf6]/15 border-[#8b5cf6]/30',
    border: 'border-[#8b5cf6]/40',
    glow: 'hover:border-[#8b5cf6]/80 hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.6)]',
    visual: 'report',
  },
  {
    title: 'CapiBot con voz',
    description: 'Pídele que registre un gasto o te resuma el mes. Escribe o háblale, tú eliges.',
    icon: Bot,
    accent: '#22c55e',
    chip: 'text-[#4ade80] bg-[#22c55e]/15 border-[#22c55e]/30',
    border: 'border-[#22c55e]/40',
    glow: 'hover:border-[#22c55e]/80 hover:shadow-[0_0_40px_-8px_rgba(34,197,94,0.6)]',
    visual: 'bot',
  },
  {
    title: 'Tu información, tuya',
    description: 'Sesión protegida, acceso por rol y cada dato asociado a tu propia cuenta.',
    icon: Lock,
    accent: '#3b82f6',
    chip: 'text-[#60a5fa] bg-[#3b82f6]/15 border-[#3b82f6]/30',
    border: 'border-white/10',
    glow: 'hover:border-white/30 hover:shadow-[0_0_40px_-8px_rgba(59,130,246,0.4)]',
    visual: 'lock',
  },
];

function VisualPreview({ kind, reduceMotion }: { kind: Visual; reduceMotion: boolean }) {
  if (kind === 'flow') {
    const bars = [38, 62, 46, 78, 55, 92, 68];
    return (
      <div className="mt-6 flex h-16 items-end gap-1.5" aria-hidden="true">
        {bars.map((height, index) => (
          <motion.div
            key={index}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={viewportOnce}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              delay: reduceMotion ? 0 : index * 0.05,
            }}
            style={{ height: `${height}%`, originY: 1 }}
            className="w-full rounded-full bg-gradient-to-t from-[#3b82f6]/30 to-[#60a5fa]"
          />
        ))}
      </div>
    );
  }

  if (kind === 'goal') {
    return (
      <div className="mt-6" aria-hidden="true">
        <div className="mb-2 flex justify-between text-[10px] font-bold">
          <span className="text-gray-400">Viaje a Cartagena</span>
          <span className="text-[#4ade80]">72%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full border border-white/10 bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '72%' }}
            viewport={viewportOnce}
            transition={{ duration: reduceMotion ? 0 : 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.5)]"
          />
        </div>
      </div>
    );
  }

  if (kind === 'shield') {
    return (
      <div className="mt-6 flex items-center gap-4" aria-hidden="true">
        <div
          className="relative h-20 w-20 shrink-0 rounded-full"
          style={{
            background: 'conic-gradient(#3b82f6 0 68%, rgba(255,255,255,0.06) 68% 100%)',
          }}
        >
          <div className="absolute inset-[7px] flex items-center justify-center rounded-full bg-[#0a0e17] text-xs font-extrabold text-white">
            68%
          </div>
        </div>
        <div className="text-[10px] leading-relaxed text-gray-400">
          <p className="font-bold text-white">Comida · Agosto</p>
          <p>$1.850.000 de $2.700.000</p>
        </div>
      </div>
    );
  }

  if (kind === 'report') {
    const rows = [
      { label: 'Ingresos', value: '$4.200.000', pct: '+12,4%', up: true },
      { label: 'Gastos', value: '$1.850.000', pct: '−3,1%', up: false },
    ];
    return (
      <div className="mt-6 space-y-2" aria-hidden="true">
        {rows.map((row) => (
          <div
            key={row.label}
            className="glass-soft flex items-center justify-between rounded-xl border border-white/10 px-3 py-2"
          >
            <span className="text-[10px] font-bold text-gray-300">{row.label}</span>
            <span className="flex items-center gap-2 text-[10px] font-extrabold text-white">
              {row.value}
              <span
                className={`flex items-center gap-0.5 ${
                  row.up ? 'text-[#4ade80]' : 'text-red-400'
                }`}
              >
                {row.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {row.pct}
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (kind === 'bot') {
    return (
      <div className="mt-6 flex h-16 items-center gap-2" aria-hidden="true">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#22c55e] text-white">
          <Bot size={18} />
        </div>
        <div className="glass-soft flex items-center gap-1 rounded-2xl px-3 py-3">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.span
              key={index}
              animate={reduceMotion ? {} : { scaleY: [1, 1.8, 1] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: index * 0.1,
                ease: 'easeInOut',
              }}
              className="h-4 w-1 rounded-full bg-[#22c55e]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-2" aria-hidden="true">
      <div className="glass-soft flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] text-gray-300">
        <Lock size={13} className="text-[#60a5fa]" /> Sesión protegida con token
      </div>
      <div className="glass-soft flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] text-gray-300">
        <Lock size={13} className="text-[#4ade80]" /> Cada dato, ligado a tu cuenta
      </div>
    </div>
  );
}

export default function FeatureBento({ reduceMotion }: FeatureBentoProps) {
  return (
    <section id="funciones" className="scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[11px] font-black uppercase tracking-[2px] text-[#60a5fa]">
            Todo en un solo lugar
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight neon-text sm:text-5xl">
            Todo lo que tu plata necesita.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400 sm:text-base">
            Herramientas reales del día a día de Cápi, diseñadas para que no necesites cinco apps
            distintas para entender tu dinero.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`glass-card relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 ${feature.border} ${feature.glow}`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl"
                  style={{ backgroundColor: feature.accent }}
                />
                <span className={`inline-flex rounded-xl border p-2.5 ${feature.chip}`}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold neon-text">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{feature.description}</p>
                <VisualPreview kind={feature.visual} reduceMotion={reduceMotion} />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
