'use client';

import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { ReportePeriodo, ReporteResumen } from '@/lib/types';
import Delta from './Delta';

interface ResumenMesProps {
  resumen: ReporteResumen;
  periodo: ReportePeriodo;
}

export function ResumenMes({ resumen, periodo }: ResumenMesProps) {
  const { ingresos, gastos, balance, tasa_ahorro, total_movimientos, variacion } = resumen;

  const balanceNegativo = balance < 0;

  return (
    <>
      <motion.div
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12 } },
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
      >
        {/* Ingresos del Mes */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-5 relative overflow-hidden group border border-[#22c55e]/40 hover:shadow-[0_0_40px_-8px_rgba(34,197,94,0.6)] transition-all duration-300"
        >
          <div
            className="absolute top-0 left-0 h-full w-1 rounded-l-3xl opacity-80 group-hover:opacity-100"
            style={{ backgroundColor: '#22c55e' }}
          />
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#22c55e]/20 to-transparent blur-2xl pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
              Ingresos del Mes
            </span>
            <span className="rounded-xl p-2 border transition-transform duration-300 group-hover:scale-110 text-[#4ade80] bg-[#22c55e]/15 border-[#22c55e]/30">
              <TrendingUp size={18} />
            </span>
          </div>

          <div className="flex items-end justify-between gap-3 relative z-10">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4ade80] tabular-nums">
              {formatCurrency(ingresos)}
            </span>
            <Delta pct={variacion?.ingresos_pct ?? null} subirEsBueno />
          </div>
        </motion.div>

        {/* Gastos del Mes */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-5 relative overflow-hidden group border border-red-500/40 hover:shadow-[0_0_40px_-8px_rgba(239,68,68,0.5)] transition-all duration-300"
        >
          <div
            className="absolute top-0 left-0 h-full w-1 rounded-l-3xl opacity-80 group-hover:opacity-100"
            style={{ backgroundColor: '#ef4444' }}
          />
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-red-500/20 to-transparent blur-2xl pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
              Gastos del Mes
            </span>
            <span className="rounded-xl p-2 border transition-transform duration-300 group-hover:scale-110 text-red-400 bg-red-500/15 border-red-500/30">
              <TrendingDown size={18} />
            </span>
          </div>

          <div className="flex items-end justify-between gap-3 relative z-10">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums">
              {formatCurrency(gastos)}
            </span>
            <Delta pct={variacion?.gastos_pct ?? null} subirEsBueno={false} />
          </div>
        </motion.div>
      </motion.div>

      {/* Balance Total */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileHover={{ y: -4 }}
        className="glass-card rounded-3xl p-6 mb-4 border-[#3b82f6]/40 hover:border-[#3b82f6]/80 hover:shadow-[0_0_50px_-8px_rgba(59,130,246,0.55)] transition-all duration-300 relative overflow-hidden group"
      >
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#3b82f6] blur-3xl opacity-10 pointer-events-none" />
        <div
          className="absolute top-0 left-0 h-full w-1 rounded-l-3xl opacity-80 group-hover:opacity-100"
          style={{ backgroundColor: '#3b82f6' }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative z-10">
          <div>
            <span className="inline-flex rounded-xl p-2 border border-[#3b82f6]/30 bg-[#3b82f6]/15 text-[#60a5fa] mb-3">
              <Wallet size={18} />
            </span>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Balance Total
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {periodo.etiqueta}
              </span>
            </div>

            <div
              className={`text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums mt-1 ${
                balanceNegativo ? 'text-red-400' : 'neon-text'
              }`}
            >
              {formatCurrency(balance)}
            </div>

            <p className="text-gray-400 text-sm mt-2">
              Ingresos {formatCurrency(ingresos)}{' '}
              <span className="text-gray-600">−</span> Gastos {formatCurrency(gastos)}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="glass-soft rounded-2xl px-5 py-4 border border-white/10 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
                Tasa de Ahorro
              </p>
              <p
                className={`text-2xl font-extrabold tabular-nums ${
                  tasa_ahorro >= 0 ? 'text-[#4ade80]' : 'text-red-400'
                }`}
              >
                {tasa_ahorro.toFixed(1)}%
              </p>
            </div>

            <div className="glass-soft rounded-2xl px-5 py-4 border border-white/10 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
                Movimientos
              </p>
              <p className="text-2xl font-extrabold text-white tabular-nums">
                {total_movimientos}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}