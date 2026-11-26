'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { EvolucionAhorro } from '@/lib/types';

interface EvolucionAhorroChartProps {
  data: EvolucionAhorro | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function EvolucionAhorroChart({
  data,
  loading,
  error,
  onRetry,
}: EvolucionAhorroChartProps) {
  const tendencia = data?.tendencia_balance_pct ?? null;
  const positiva = tendencia !== null && tendencia >= 0;

  return (
    <section className="glass-card rounded-3xl p-5 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Evolución del ahorro</h3>
          <p className="text-xs text-gray-400 mt-1">Balance mensual de los últimos 12 meses.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="glass-soft rounded-full px-3 py-1.5 text-xs font-bold text-gray-300">
            Promedio: {data ? `${data.promedio_ahorro.toFixed(1)}%` : '—'}
          </span>
          {tendencia !== null && (
            <span
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${
                positiva
                  ? 'bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/25'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {positiva ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {tendencia > 0 ? '+' : ''}
              {tendencia.toFixed(1)}%
            </span>
          )}
          <button
            type="button"
            onClick={() => void onRetry()}
            disabled={loading}
            aria-label="Actualizar evolución del ahorro"
            className="p-2 rounded-xl glass-soft border border-white/10 text-gray-400 hover:text-white hover:border-[#3b82f6]/50 transition disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className="py-8 text-center">
          <p role="alert" className="text-sm font-bold text-red-400">
            {error}
          </p>
          <button
            type="button"
            onClick={() => void onRetry()}
            className="mt-3 rounded-xl bg-[#3b82f6] px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Reintentar
          </button>
        </div>
      )}

      {!error && loading && !data && (
        <div className="py-14 text-center text-sm text-gray-500">Calculando tendencias…</div>
      )}

      {!error && data && data.meses.length === 0 && (
        <div className="py-14 text-center text-sm text-gray-500">
          Aún no hay movimientos para mostrar tendencias.
        </div>
      )}

      {!error && data && data.meses.length > 0 && (
        <div className="w-full" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.meses} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="etiqueta"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                tickFormatter={(value: string) => value.split(' ')[0].slice(0, 3)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                tickFormatter={(value: number) => formatCurrency(value)}
                axisLine={false}
                tickLine={false}
                width={72}
              />
              <Tooltip
                contentStyle={{
                  background: '#0a0e17',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  color: '#fff',
                }}
                labelStyle={{ color: '#fff', fontWeight: 700 }}
                formatter={(value) => formatCurrency(Number(value))}
              />
              <Line
                type="monotone"
                dataKey="balance"
                name="Balance"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 3, fill: '#22c55e' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
