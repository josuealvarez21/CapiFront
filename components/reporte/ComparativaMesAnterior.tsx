'use client';

import { motion } from 'framer-motion';
import { GitCompareArrows, Minus } from 'lucide-react';
import { formatCurrency, MESES_ES } from '@/lib/utils';
import type { ReportePeriodo, ReporteResumen } from '@/lib/types';

interface ComparativaMesAnteriorProps {
  resumen: ReporteResumen;
  periodo: ReportePeriodo;
}

interface Fila {
  label: string;
  actual: number;
  anterior: number;
  pct: number | null;
  color: string;
  subirEsBueno: boolean;
}

function Variacion({ pct, subirEsBueno }: { pct: number | null; subirEsBueno: boolean }) {
  if (pct === null) {
    return <span className="text-xs font-black text-gray-600">Sin datos</span>;
  }

  if (Math.abs(pct) < 0.05) {
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-black border bg-white/5 text-gray-500 border-white/10">
        <Minus size={12} />
        0%
      </span>
    );
  }

  const favorable = (pct > 0) === subirEsBueno;

  return (
    <span
      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-black border ${
        favorable
          ? 'bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/25'
          : 'bg-red-500/15 text-red-400 border-red-500/25'
      }`}
    >
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

export function ComparativaMesAnterior({ resumen, periodo }: ComparativaMesAnteriorProps) {
  const { ingresos, gastos, balance, variacion, mes_anterior } = resumen;

  let indice = periodo.mes - 2;
  let anio = periodo.anio;
  if (indice < 0) {
    indice = 11;
    anio -= 1;
  }
  const etiquetaMesAnterior = `${MESES_ES[indice]} ${anio}`;

  const filas: Fila[] = [
    {
      label: 'Ingresos',
      actual: ingresos,
      anterior: mes_anterior?.ingresos ?? 0,
      pct: variacion?.ingresos_pct ?? null,
      color: '#22c55e',
      subirEsBueno: true,
    },
    {
      label: 'Gastos',
      actual: gastos,
      anterior: mes_anterior?.gastos ?? 0,
      pct: variacion?.gastos_pct ?? null,
      color: '#ef4444',
      subirEsBueno: false,
    },
    {
      label: 'Balance',
      actual: balance,
      anterior: mes_anterior?.balance ?? 0,
      pct: variacion?.balance_pct ?? null,
      color: '#3b82f6',
      subirEsBueno: true,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="glass-card rounded-3xl p-5 relative overflow-hidden"
    >
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#3b82f6] blur-3xl opacity-10 pointer-events-none" />

      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <GitCompareArrows size={18} className="text-[#60a5fa]" />
          <h3 className="text-lg font-bold text-white">Comparativa vs Mes Anterior</h3>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">
          contra {etiquetaMesAnterior}
        </span>
      </div>

      {!mes_anterior ? (
        <div className="flex flex-col items-center justify-center py-10 text-center relative z-10">
          <GitCompareArrows size={48} className="opacity-20 mb-3" />
          <p className="text-base text-gray-500">
            No hay movimientos en {etiquetaMesAnterior}.
          </p>
          <p className="text-sm mt-1 text-gray-500">No se puede calcular la variación.</p>
        </div>
      ) : (
        <div className="space-y-3 relative z-10">
          {filas.map(({ label, actual, anterior, pct, color, subirEsBueno }) => {
            const escala = Math.max(Math.abs(actual), Math.abs(anterior), 0);
            const pctActual = escala > 0 ? Math.min((Math.abs(actual) / escala) * 100, 100) : 0;
            const pctAnterior = escala > 0 ? Math.min((Math.abs(anterior) / escala) * 100, 100) : 0;

            return (
              <div
                key={label}
                className="glass-soft rounded-2xl border border-white/10 p-4 hover:border-[#3b82f6]/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {label}
                  </span>
                  <Variacion pct={pct} subirEsBueno={subirEsBueno} />
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">
                  <span className="w-14 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Actual
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pctActual}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="w-28 text-right tabular-nums font-extrabold text-white">
                      {formatCurrency(actual)}
                    </span>
                  </div>

                  <span className="w-14 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Anterior
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-white/25"
                        initial={{ width: 0 }}
                        animate={{ width: `${pctAnterior}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                      />
                    </div>
                    <span className="w-28 text-right tabular-nums font-bold text-gray-400">
                      {formatCurrency(anterior)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}