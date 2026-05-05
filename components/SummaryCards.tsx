'use client';

import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { SummaryData } from '@/lib/types';

interface SummaryCardsProps {
  summary: SummaryData;
}

const cards = [
  { key: 'balance', label: 'Balance Total', field: 'balance_total' as const, icon: Wallet, colors: 'from-[#1e1e1e] to-[#252525] border-[#2e2e2e] hover:border-[#3b82f6]', iconColor: 'text-[#3b82f6]', labelColor: 'text-gray-400' },
  { key: 'ingresos', label: 'Total Ingresos', field: 'ingresos_mes' as const, icon: TrendingUp, colors: 'from-[#1C542D] to-[#143B1F] border-green-900 hover:border-[#22c55e]', iconColor: 'text-[#22c55e]', labelColor: 'text-green-300' },
  { key: 'gastos', label: 'Total Gastos', field: 'gastos_mes' as const, icon: TrendingDown, colors: 'from-[#451a1a] to-[#2B1010] border-red-900 hover:border-[#ef4444]', iconColor: 'text-[#ef4444]', labelColor: 'text-red-300' },
];

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {cards.map(({ key, label, field, icon: Icon, colors, iconColor, labelColor }) => (
        <div
          key={key}
          className={`bg-gradient-to-br ${colors} border rounded-3xl p-8 transition-transform hover:scale-105 shadow-xl relative overflow-hidden group`}
        >
          <div className={`absolute -right-4 -top-4 ${iconColor} opacity-10 group-hover:scale-150 transition-transform duration-500`}>
            <Icon size={120} />
          </div>
          <p className={`${labelColor} text-sm font-bold mb-2 uppercase tracking-wider relative z-10`}>{label}</p>
          <h3 className="text-4xl font-extrabold text-white relative z-10 drop-shadow-md">
            {formatCurrency(summary[field])}
          </h3>
        </div>
      ))}
    </div>
  );
}
