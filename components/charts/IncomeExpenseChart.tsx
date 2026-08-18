'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { SummaryData, Transaccion } from '@/lib/types';

interface IncomeExpenseChartProps {
  summary: SummaryData;
  movements: Transaccion[];
}

const GREEN = '#22c55e';
const RED = '#ef4444';

const MONTH_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseDate(value: string): number | null {
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return Date.UTC(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  }
  const prettyMatch = value.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (prettyMatch) {
    const month = MONTH_INDEX[prettyMatch[2]];
    if (month !== undefined) {
      return Date.UTC(Number(prettyMatch[3]), month, Number(prettyMatch[1]));
    }
  }
  return null;
}

function toKey(ms: number): string {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
    d.getUTCDate(),
  ).padStart(2, '0')}`;
}

const MAX_RANGE_DAYS = 92;

function buildFlujoSeries(movements: Transaccion[]) {
  const todayMs = Date.now();
  const todayKey = toKey(todayMs);

  const buckets = new Map<string, { ingresos: number; gastos: number }>();
  let minKey = todayKey;

  for (const m of movements) {
    const ms = parseDate(m.fecha);
    if (ms === null) continue;
    const key = toKey(ms);
    if (key < minKey) minKey = key;
    const bucket = buckets.get(key) ?? { ingresos: 0, gastos: 0 };
    if (m.tipo === 'ingreso') bucket.ingresos += Number(m.monto);
    else bucket.gastos += Number(m.monto);
    buckets.set(key, bucket);
  }

  const series: { dia: string; ingresos: number; gastos: number }[] = [];
  const cursor = new Date(`${minKey}T00:00:00Z`);
  const last = new Date(`${todayKey}T00:00:00Z`);
  let guard = 0;

  while (cursor.getTime() <= last.getTime() && guard < MAX_RANGE_DAYS) {
    const key = toKey(cursor.getTime());
    const bucket = buckets.get(key);
    series.push({
      dia: `${String(cursor.getUTCDate()).padStart(2, '0')}/${String(
        cursor.getUTCMonth() + 1,
      ).padStart(2, '0')}`,
      ingresos: bucket?.ingresos ?? 0,
      gastos: bucket?.gastos ?? 0,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    guard++;
  }

  return series;
}

export default function IncomeExpenseChart({ summary, movements }: IncomeExpenseChartProps) {
  const [view, setView] = useState<'pastel' | 'linea'>('pastel');
  const ingresos = Number(summary.ingresos_mes);
  const gastos = Number(summary.gastos_mes);
  const total = ingresos + gastos;
  const hasData = ingresos > 0 || gastos > 0;
  const weekSeries = buildFlujoSeries(movements);

  const chartData = [
    { nombre: 'Ingresos', valor: ingresos, color: GREEN },
    { nombre: 'Gastos', valor: gastos, color: RED },
  ].filter((d) => d.valor > 0);

  const tooltipStyle = {
    backgroundColor: 'rgba(15,23,42,0.92)',
    backdropFilter: 'blur(12px)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: '16px',
    color: '#fff',
    fontWeight: 'bold' as const,
    boxShadow: '0 12px 40px -12px rgba(0,0,0,0.8)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-3xl p-5 flex flex-col relative overflow-hidden group"
    >
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#3b82f6] blur-3xl opacity-10 pointer-events-none" />
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-white">Ingresos vs Gastos</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-[#22c55e] to-[#ef4444]" />
            Flujo Mensual
          </span>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 w-fit">
          <button
            type="button"
            onClick={() => setView('pastel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              view === 'pastel'
                ? 'bg-[#22c55e]/15 text-[#22c55e] ring-1 ring-inset ring-[#22c55e]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <PieChartIcon size={13} />
            Pastel
          </button>
          <button
            type="button"
            onClick={() => setView('linea')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              view === 'linea'
                ? 'bg-[#3b82f6]/15 text-[#3b82f6] ring-1 ring-inset ring-[#3b82f6]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LineChartIcon size={13} />
            Línea
          </button>
        </div>
      </header>

      {!hasData ? (
        <div className="relative z-10 flex flex-col items-center justify-center h-64 text-gray-500">
          <PieChartIcon size={56} className="opacity-20 mb-4" />
          <p>Registra movimientos para ver el análisis.</p>
        </div>
      ) : view === 'pastel' ? (
        <div className="relative z-10 flex flex-col items-center flex-1">
          <div className="h-64 w-full max-w-md">
            <ResponsiveContainer width="99%" height={256}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={74}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="valor"
                  nameKey="nombre"
                  stroke="rgba(255,255,255,0.08)"
                  animationBegin={150}
                  animationDuration={900}
                  animationEasing="ease-out"
                  cornerRadius={10}
                >
                  <Label
                    value={formatCurrency(summary.balance_total)}
                    position="center"
                    fill="#ffffff"
                    style={{ fontSize: '17px', fontWeight: 800 }}
                  />
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: unknown) => formatCurrency(Number(value))} contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <div className="flex items-center gap-2 glass-soft px-3 py-1.5 rounded-full">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: GREEN }} />
              <span className="text-xs sm:text-sm font-bold text-gray-300">
                Ingresos: {((ingresos / total) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2 glass-soft px-3 py-1.5 rounded-full">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: RED }} />
              <span className="text-xs sm:text-sm font-bold text-gray-300">
                Gastos: {((gastos / total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Flujo Reciente
          </span>
          <div className="h-64 w-full">
            <ResponsiveContainer width="99%" height={256}>
              <AreaChart data={weekSeries} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="flowGradIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GREEN} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="flowGradGastos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={RED} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={RED} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="dia"
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${v}`}
                />
                <Tooltip formatter={(value: unknown) => formatCurrency(Number(value))} contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
                <Area
                  type="monotone"
                  dataKey="ingresos"
                  name="Ingresos"
                  stroke={GREEN}
                  strokeWidth={2.5}
                  fill="url(#flowGradIngresos)"
                  animationBegin={250}
                  animationDuration={1200}
                  activeDot={{ r: 4, fill: GREEN }}
                />
                <Area
                  type="monotone"
                  dataKey="gastos"
                  name="Gastos"
                  stroke={RED}
                  strokeWidth={2.5}
                  fill="url(#flowGradGastos)"
                  animationBegin={400}
                  animationDuration={1200}
                  activeDot={{ r: 4, fill: RED }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </motion.div>
  );
}