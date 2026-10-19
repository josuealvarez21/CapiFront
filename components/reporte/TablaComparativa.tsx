'use client';

import { motion } from 'framer-motion';
import { PieChart, Table2 } from 'lucide-react';
import { formatCurrency, getCategoryIcon } from '@/lib/utils';
import type { ReporteCategoria } from '@/lib/types';

interface TablaComparativaProps {
  categorias: ReporteCategoria[];
  totalMovimientos: number;
}

const COLOR_INGRESO = '#22c55e';
const COLOR_GASTO = '#ef4444';

const monto = (valor: number) => `${valor < 0 ? '−' : ''}${formatCurrency(Math.abs(valor))}`;

/**
 * Celda numérica con barra de fondo normalizada contra el máximo de la columna.
 * El valor 0 se muestra como guion, sin barra.
 */
function CeldaBarra({ valor, maximo, color }: { valor: number; maximo: number; color: string }) {
  if (valor === 0) {
    return <span className="text-gray-600">—</span>;
  }

  const ancho = maximo > 0 ? Math.min((Math.abs(valor) / maximo) * 100, 100) : 0;

  return (
    <div className="relative inline-block w-full">
      <div
        className="absolute inset-y-1 right-0 rounded-md opacity-20"
        style={{ width: `${ancho}%`, backgroundColor: color }}
      />
      <span
        className={`relative tabular-nums ${valor < 0 ? 'text-red-400' : ''}`}
      >
        {monto(valor)}
      </span>
    </div>
  );
}

export function TablaComparativa({ categorias, totalMovimientos }: TablaComparativaProps) {
  const maxIngresos = Math.max(...categorias.map((c) => c.ingresos), 0);
  const maxGastos = Math.max(...categorias.map((c) => c.gastos), 0);

  const totalIngresos = categorias.reduce((acc, c) => acc + c.ingresos, 0);
  const totalGastos = categorias.reduce((acc, c) => acc + c.gastos, 0);
  const totalBalance = totalIngresos - totalGastos;

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
          <Table2 size={18} className="text-[#60a5fa]" />
          <h3 className="text-lg font-bold text-white">Comparativa por Categoría</h3>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
          {categorias.length} categorías · {totalMovimientos} movimientos
        </span>
      </div>

      {categorias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center relative z-10">
          <PieChart size={64} className="opacity-20 mb-4" />
          <p className="text-lg text-gray-500">No hay movimientos en este mes.</p>
          <p className="text-sm mt-1 text-gray-500">
            Registra ingresos o gastos para ver la comparativa.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar relative z-10">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 p-3">
                  Categoría
                </th>
                <th className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-400 p-3">
                  Ingresos
                </th>
                <th className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-400 p-3">
                  Gastos
                </th>
                <th className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-400 p-3">
                  Balance
                </th>
                <th className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-400 p-3 w-28">
                  % del mes
                </th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((c) => (
                <tr
                  key={c.nombre}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`rounded-xl p-2 flex-shrink-0 border ${
                          c.tipo === 'ingreso'
                            ? 'bg-[#22c55e]/15 border-[#22c55e]/25'
                            : 'bg-red-500/10 border-red-500/20'
                        }`}
                      >
                        {getCategoryIcon(c.nombre, 18)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{c.nombre}</p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {c.movimientos} movimiento{c.movimientos === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 text-right font-bold text-sm">
                    <CeldaBarra
                      valor={c.ingresos}
                      maximo={maxIngresos}
                      color={COLOR_INGRESO}
                    />
                  </td>

                  <td className="p-3 text-right font-bold text-sm">
                    <CeldaBarra valor={c.gastos} maximo={maxGastos} color={COLOR_GASTO} />
                  </td>

                  <td
                    className={`p-3 text-right font-extrabold tabular-nums ${
                      c.balance >= 0 ? 'text-[#4ade80]' : 'text-red-400'
                    }`}
                  >
                    {c.balance >= 0 ? '+' : '−'}
                    {formatCurrency(Math.abs(c.balance))}
                  </td>

                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(c.peso_pct, 100)}%`,
                            backgroundColor: c.color,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-400 w-12 text-right tabular-nums">
                        {c.peso_pct.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="glass-soft">
                <td className="p-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Total
                </td>
                <td className="p-3 text-right font-extrabold tabular-nums text-[#4ade80]">
                  {formatCurrency(totalIngresos)}
                </td>
                <td className="p-3 text-right font-extrabold tabular-nums text-white">
                  {formatCurrency(totalGastos)}
                </td>
                <td
                  className={`p-3 text-right font-extrabold tabular-nums ${
                    totalBalance >= 0 ? 'text-[#4ade80]' : 'text-red-400'
                  }`}
                >
                  {totalBalance >= 0 ? '+' : '−'}
                  {formatCurrency(Math.abs(totalBalance))}
                </td>
                <td className="p-3 text-right text-xs font-bold text-gray-400 tabular-nums">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </motion.section>
  );
}