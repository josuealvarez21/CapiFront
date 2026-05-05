'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { SummaryData } from '@/lib/types';

interface IncomeExpenseChartProps {
  summary: SummaryData;
}

export default function IncomeExpenseChart({ summary }: IncomeExpenseChartProps) {
  const ingresos = Number(summary.ingresos_mes);
  const gastos = Number(summary.gastos_mes);
  const total = ingresos + gastos;
  const hasData = ingresos > 0 || gastos > 0;

  const chartData = [
    { nombre: 'Ingresos', valor: ingresos, color: '#22c55e' },
    { nombre: 'Gastos', valor: gastos, color: '#ef4444' },
  ].filter((d) => d.valor > 0);

  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-3xl p-8 shadow-2xl relative">
      <h3 className="text-2xl font-bold text-white mb-6">Ingresos vs Gastos</h3>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <PieChartIcon size={64} className="opacity-20 mb-4" />
          <p>Registra movimientos para ver el análisis.</p>
        </div>
      ) : (
        <>
          <div className="h-72 w-full">
            <ResponsiveContainer width="99%" height={288}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={125}
                  paddingAngle={5}
                  dataKey="valor"
                  nameKey="nombre"
                  stroke="none"
                  isAnimationActive={false}
                >
                  <Label
                    value={formatCurrency(summary.balance_total)}
                    position="center"
                    fill="#ffffff"
                    style={{ fontSize: '22px', fontWeight: 'bold' }}
                    className="drop-shadow-md"
                  />
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: '#121212',
                    borderColor: '#2e2e2e',
                    borderRadius: '16px',
                    color: '#fff',
                    fontWeight: 'bold',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 bg-[#1C542D] bg-opacity-20 px-4 py-2 rounded-full border border-green-900">
              <div className="w-4 h-4 rounded-full bg-[#22c55e]" />
              <span className="text-sm font-bold text-green-400">
                Ingresos: {((ingresos / total) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#451a1a] bg-opacity-20 px-4 py-2 rounded-full border border-red-900">
              <div className="w-4 h-4 rounded-full bg-[#ef4444]" />
              <span className="text-sm font-bold text-red-400">
                Gastos: {((gastos / total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
