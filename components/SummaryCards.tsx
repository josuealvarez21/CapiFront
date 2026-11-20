'use client';

import { motion, type Variants } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { SummaryData } from '@/lib/types';

interface SummaryCardsProps {
  summary: SummaryData;
}

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const ingresos = Number(summary.ingresos_mes) || 0;
  const gastos = Number(summary.gastos_mes) || 0;
  const totalFlujo = ingresos + gastos;

  const barWidth = (key: string) => {
    if (key === 'balance') return '100%';
    if (totalFlujo <= 0) return '0%';
    const valor = key === 'ingresos' ? ingresos : gastos;
    return `${Math.max((valor / totalFlujo) * 100, valor > 0 ? 2 : 0)}%`;
  };

  const cards = [
    {
      key: 'balance',
      label: 'Balance Total',
      field: 'balance_total' as const,
      icon: Wallet,
      accentColor: '#3b82f6',
      iconChip: 'text-[#60a5fa] bg-[#3b82f6]/15 border-[#3b82f6]/30',
      border: 'border-[#3b82f6]/40',
      glow: 'hover:border-[#3b82f6]/80 hover:shadow-[0_0_40px_-8px_rgba(59,130,246,0.6)]',
      wash: 'from-[#3b82f6]/20',
      bar: 'from-[#3b82f6] to-[#60a5fa]',
    },
    {
      key: 'ingresos',
      label: 'Total Ingresos',
      field: 'ingresos_mes' as const,
      icon: TrendingUp,
      accentColor: '#22c55e',
      iconChip: 'text-[#4ade80] bg-[#22c55e]/15 border-[#22c55e]/30',
      border: 'border-[#22c55e]/40',
      glow: 'hover:border-[#22c55e]/80 hover:shadow-[0_0_40px_-8px_rgba(34,197,94,0.6)]',
      wash: 'from-[#22c55e]/20',
      bar: 'from-[#22c55e] to-[#4ade80]',
    },
    {
      key: 'gastos',
      label: 'Total Gastos',
      field: 'gastos_mes' as const,
      icon: TrendingDown,
      accentColor: '#ef4444',
      iconChip: 'text-red-400 bg-red-500/15 border-red-500/30',
      border: 'border-red-500/40',
      glow: 'hover:border-red-500/80 hover:shadow-[0_0_40px_-8px_rgba(239,68,68,0.5)]',
      wash: 'from-red-500/20',
      bar: 'from-[#ef4444] to-[#f87171]',
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
    >
      {cards.map(({ key, label, field, icon: Icon, accentColor, iconChip, border, glow, wash, bar }) => (
        <motion.div
          key={key}
          variants={item}
          whileHover={{ y: -4 }}
          className={`glass-card relative overflow-hidden rounded-3xl p-4 transition-all duration-300 group sm:p-5 ${border} ${glow}`}
        >
          <div
            className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${wash} to-transparent blur-2xl pointer-events-none group-hover:opacity-100 opacity-70 transition-opacity duration-500`}
          />
          <div className="absolute top-0 left-0 h-full w-1 rounded-l-3xl opacity-80 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: accentColor }} />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
              {label}
            </p>
            <div
              className={`rounded-xl p-2 border transition-transform duration-300 group-hover:scale-110 ${iconChip}`}
            >
              <Icon size={18} />
            </div>
          </div>
          <h2
            className={`stat-value relative z-10 text-2xl font-extrabold tracking-tight sm:text-3xl ${
              key === 'balance' ? 'neon-text' : 'text-white'
            }`}
          >
            {formatCurrency(summary[field])}
          </h2>
          <div
            className="relative z-10 mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5"
            aria-hidden="true"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: barWidth(key) }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${bar} opacity-80`}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}