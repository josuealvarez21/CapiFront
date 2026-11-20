'use client';

import { motion } from 'framer-motion';
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
  const padding = isCompact ? 'p-3 sm:p-4' : 'p-4 sm:p-5';
  const textSize = isCompact ? 'text-sm sm:text-base' : 'text-lg sm:text-xl';
  const amountSize = isCompact ? 'text-sm sm:text-lg' : 'text-base sm:text-2xl';
  const iconPadding = isCompact ? 'p-2.5 sm:p-3' : 'p-3 sm:p-4';

  return (
    <div className="space-y-4">
      {movements.map((mov) => (
        <motion.div
          key={mov.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`flex min-w-0 items-start justify-between gap-2 glass-soft ${padding} rounded-2xl border border-white/10 hover:border-[#3b82f6]/40 hover:bg-[#0f172a]/40 transition-all duration-300 group sm:items-center sm:gap-4`}
        >
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div
              className={`${iconPadding} rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 ${
                mov.tipo === 'ingreso'
                  ? 'bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/25'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {getCategoryIcon(mov.categoria)}
            </div>
            <div className="min-w-0">
              <p className={`${textSize} truncate font-bold text-white`}>{mov.descripcion}</p>
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
          <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
            <span
              className={`stat-value whitespace-nowrap font-extrabold tabular-nums ${amountSize} ${mov.tipo === 'ingreso' ? 'text-[#4ade80]' : 'text-white'}`}
            >
              {mov.tipo === 'ingreso' ? '+' : '-'}
              {formatCurrency(mov.monto)}
            </span>
            <button
              type="button"
              onClick={() => onDelete(mov.id)}
              aria-label={`Eliminar movimiento ${mov.descripcion}`}
              className="-mr-1 shrink-0 rounded-lg p-1 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] sm:p-1.5 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <Trash2 size={isCompact ? 16 : 18} className="sm:h-[22px] sm:w-[22px]" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
