'use client';

import { Trash2 } from 'lucide-react';
import { formatCurrency, getCategoryIcon, getCategoryBadgeClass } from '@/lib/utils';
import type { Transaccion } from '@/lib/types';

interface MovementsListProps {
  movements: Transaccion[];
  onDelete: (id: string) => void;
  emptyIcon?: React.ReactNode;
  emptyMessage?: string;
  variant?: 'compact' | 'full';
}

export default function MovementsList({
  movements,
  onDelete,
  emptyIcon,
  emptyMessage = 'No hay movimientos. Agrega uno.',
  variant = 'compact',
}: MovementsListProps) {
  if (movements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        {emptyIcon}
        <p className={variant === 'full' ? 'text-lg' : ''}>{emptyMessage}</p>
      </div>
    );
  }

  const isCompact = variant === 'compact';
  const padding = isCompact ? 'p-4' : 'p-5';
  const textSize = isCompact ? 'text-base' : 'text-xl';
  const amountSize = isCompact ? 'text-lg' : 'text-2xl';
  const iconPadding = isCompact ? 'p-3' : 'p-4';

  return (
    <div className="space-y-4">
      {movements.map((mov) => (
        <div
          key={mov.id}
          className={`flex items-center justify-between bg-[#121212] ${padding} rounded-2xl border border-[#2e2e2e] hover:border-gray-700 transition-colors group`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`${iconPadding} rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 ${
                mov.tipo === 'ingreso'
                  ? 'bg-[#1C542D] text-[#22c55e]'
                  : 'bg-[#451a1a] text-[#ef4444]'
              }`}
            >
              {getCategoryIcon(mov.categoria)}
            </div>
            <div>
              <p className={`${textSize} font-bold text-white`}>{mov.descripcion}</p>
              <p className="text-xs text-gray-400 font-medium mt-1">
                <span
                  className={`mr-2 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${getCategoryBadgeClass(mov.tipo)}`}
                >
                  {mov.categoria}
                </span>
                {isCompact ? mov.fecha : `Registrado el ${mov.fecha}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`font-extrabold ${amountSize} ${mov.tipo === 'ingreso' ? 'text-[#22c55e]' : 'text-white'}`}
            >
              {mov.tipo === 'ingreso' ? '+' : '-'}
              {formatCurrency(mov.monto)}
            </span>
            <button
              onClick={() => onDelete(mov.id)}
              className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={isCompact ? 18 : 22} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
