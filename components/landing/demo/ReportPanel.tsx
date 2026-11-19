'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Minus,
  Receipt,
  type LucideIcon,
} from 'lucide-react';
import { tabSwap } from '@/lib/motion';
import {
  DEMO_MONTHS,
  monthLabel,
  money,
  previousMonth,
  type DemoCategoriaResumen,
  type DemoMovement,
  type DemoStats,
} from './demo-data';

type PanelAbierto = 'ingresos' | 'gastos' | 'balance' | null;

interface ReportPanelProps {
  movimientos: DemoMovement[];
  selectedMonth: string;
  onSelectMonth: (mes: string) => void;
  stats: DemoStats;
  ingresosPorCategoria: DemoCategoriaResumen[];
  gastosPorCategoria: DemoCategoriaResumen[];
  variacionIngresos: number | null;
  variacionGastos: number | null;
  reduceMotion: boolean;
}

interface VariacionProps {
  etiqueta: string;
  valor: number | null;
  esGasto?: boolean;
  referencia?: string | null;
}

function Variacion({ etiqueta, valor, esGasto = false, referencia }: VariacionProps) {
  if (valor === null) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <span className="text-xs font-bold text-gray-300">{etiqueta}</span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Minus size={14} aria-hidden="true" /> Sin datos previos
        </span>
      </div>
    );
  }

  const positivo = valor >= 0;
  const bueno = esGasto ? !positivo : positivo;
  const Icono = positivo ? ArrowUpRight : ArrowDownRight;
  const color = bueno ? 'text-[#4ade80]' : 'text-red-400';

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-xs font-bold text-gray-300">{etiqueta}</span>
      <span className={`flex shrink-0 items-center gap-1 text-xs font-black ${color}`}>
        <Icono size={14} aria-hidden="true" />
        {positivo ? '+' : '−'}
        {Math.abs(valor).toFixed(1).replace('.', ',')}%
        {referencia && <span className="ml-1 font-normal text-gray-500">vs. {referencia}</span>}
      </span>
    </div>
  );
}

function Desglose({ datos, reduceMotion }: { datos: DemoCategoriaResumen[]; reduceMotion: boolean }) {
  if (datos.length === 0) {
    return <p className="text-xs text-gray-500">Sin movimientos en este mes.</p>;
  }

  return (
    <div className="space-y-3">
      {datos.map((categoria) => (
        <div key={categoria.nombre}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-bold text-gray-200">{categoria.nombre}</span>
            <span className="text-gray-400">
              {money(categoria.monto)} · {categoria.pct.toFixed(1).replace('.', ',')}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full border border-white/10 bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#22c55e]"
              initial={false}
              animate={{ width: `${categoria.pct}%` }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReportPanel({
  movimientos,
  selectedMonth,
  onSelectMonth,
  stats,
  ingresosPorCategoria,
  gastosPorCategoria,
  variacionIngresos,
  variacionGastos,
  reduceMotion,
}: ReportPanelProps) {
  const [abierto, setAbierto] = useState<PanelAbierto>(null);
  const anterior = previousMonth(selectedMonth);
  const referencia = anterior ? monthLabel(anterior).replace(' 2026', '') : null;
  const textoComparativa = anterior
    ? `Comparando con ${monthLabel(anterior)}.`
    : 'Primer mes del periodo de la demo.';

  const recientes = movimientos
    .filter((movimiento) => movimiento.fecha.startsWith(selectedMonth))
    .slice()
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 4);

  const cards: {
    id: Exclude<PanelAbierto, null>;
    label: string;
    value: number;
    icon: LucideIcon;
    color: string;
  }[] = [
    { id: 'ingresos', label: 'Ingresos', value: stats.ingresos, icon: ArrowUpRight, color: 'text-[#4ade80]' },
    { id: 'gastos', label: 'Gastos', value: stats.gastos, icon: ArrowDownRight, color: 'text-red-400' },
    { id: 'balance', label: 'Balance', value: stats.balance, icon: Receipt, color: 'text-[#60a5fa]' },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[2px] text-[#a78bfa]">Reporte mensual</p>
          <p className="mt-1 text-sm font-bold text-white">{monthLabel(selectedMonth)}</p>
        </div>
        <div role="group" aria-label="Seleccionar mes" className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {DEMO_MONTHS.map((mes) => {
            const activo = mes.value === selectedMonth;
            return (
              <button
                key={mes.value}
                type="button"
                aria-pressed={activo}
                onClick={() => onSelectMonth(mes.value)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                  activo
                    ? 'bg-[#8b5cf6]/20 text-[#c4b5fd] ring-1 ring-inset ring-[#8b5cf6]/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {mes.short}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((card) => {
          const Icono = card.icon;
          const expandido = abierto === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setAbierto(expandido ? null : card.id)}
              aria-expanded={expandido}
              aria-controls={`reporte-detalle-${card.id}`}
              className={`glass-soft rounded-2xl border p-4 text-left transition-colors ${
                expandido ? 'border-[#8b5cf6]/50' : 'border-white/10 hover:border-white/25'
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {card.label}
                </span>
                <span className="flex items-center gap-1">
                  <Icono size={15} className={card.color} aria-hidden="true" />
                  <ChevronDown
                    size={13}
                    className={`text-gray-500 transition-transform ${expandido ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </span>
              </div>
              <p className="text-lg font-extrabold tracking-tight text-white">{money(card.value)}</p>
              {card.id === 'balance' && (
                <p className="mt-1 text-[10px] text-gray-500">{stats.total} movimientos</p>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {abierto && (
          <motion.div
            key={abierto}
            id={`reporte-detalle-${abierto}`}
            variants={tabSwap}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={reduceMotion ? { duration: 0 } : undefined}
            className="mt-4 rounded-2xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 p-4"
          >
            <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-[#c4b5fd]">
              {abierto === 'ingresos'
                ? 'Desglose de ingresos'
                : abierto === 'gastos'
                  ? 'Desglose de gastos'
                  : 'Últimos movimientos del mes'}
            </p>
            {abierto === 'ingresos' && (
              <Desglose datos={ingresosPorCategoria} reduceMotion={reduceMotion} />
            )}
            {abierto === 'gastos' && <Desglose datos={gastosPorCategoria} reduceMotion={reduceMotion} />}
            {abierto === 'balance' && (
              <div className="space-y-2">
                {recientes.length === 0 && <p className="text-xs text-gray-500">Sin movimientos.</p>}
                {recientes.map((movimiento) => (
                  <div
                    key={movimiento.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-gray-200">{movimiento.descripcion}</p>
                      <p className="text-[10px] text-gray-500">
                        {movimiento.categoria} · {movimiento.fecha.slice(5)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-black ${
                        movimiento.tipo === 'ingreso' ? 'text-[#4ade80]' : 'text-red-400'
                      }`}
                    >
                      {movimiento.tipo === 'ingreso' ? '+' : '−'}
                      {money(movimiento.monto)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Variacion
          etiqueta="Ingresos vs. mes anterior"
          valor={variacionIngresos}
          referencia={referencia}
        />
        <Variacion
          etiqueta="Gastos vs. mes anterior"
          valor={variacionGastos}
          esGasto
          referencia={referencia}
        />
      </div>

      <p className="mt-4 text-center text-[10px] text-gray-500">
        {textoComparativa} Los datos se recalculan con cada acción.
      </p>
    </div>
  );
}
