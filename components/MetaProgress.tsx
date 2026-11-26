'use client';

import { motion } from 'framer-motion';
import { History, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Meta } from '@/lib/types';

interface MetaProgressProps {
  meta: Meta;
  onDelete: (id: string) => void;
  onVerHistorial?: (id: string) => void;
  projectedAmount?: number;
}

export default function MetaProgress({
  meta,
  onDelete,
  onVerHistorial,
  projectedAmount = 0,
}: MetaProgressProps) {
  const currentActual = Number(meta.ahorro_actual || 0);
  const target = Number(meta.monto_objetivo || 0);
  const projected = Number(projectedAmount || 0);

  const currentPercentage = target > 0 ? Math.min((currentActual / target) * 100, 100) : 0;
  const projectedPercentage =
    target > 0 ? Math.min(((currentActual + projected) / target) * 100, 100) : 0;

  const isCompleted = currentActual >= target;
  const willBeCompleted = currentActual + projected >= target;
  const color = meta.color || '#3b82f6';

  const calculateMonthsRemaining = () => {
    if (isCompleted) return 0;
    if (projectedAmount <= 0) return null;
    const remaining = meta.monto_objetivo - meta.ahorro_actual;
    return Math.ceil(remaining / projectedAmount);
  };

  const months = calculateMonthsRemaining();

  return (
    <div
      className={`mb-3 glass-soft p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden group ${isCompleted ? 'border-[#22c55e]/50 shadow-[0_0_25px_rgba(34,197,94,0.12)]' : 'border-white/10 hover:border-[#3b82f6]/40'}`}
    >
      <div className="relative z-10 mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="flex min-w-0 items-center gap-2 font-bold tracking-wide text-white">
            <span className="truncate">{meta.nombre}</span>
            {isCompleted && (
              <span className="text-[#22c55e] text-[10px] bg-[#22c55e]/15 px-2 py-0.5 rounded-full uppercase border border-[#22c55e]/25">
                Completada
              </span>
            )}
          </span>
          {months !== null && !isCompleted && (
            <span className="text-[10px] text-gray-500 font-medium">
              Faltan aprox. {months} meses
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center justify-between gap-2 sm:justify-end sm:gap-3">
          <span className="mr-2 whitespace-nowrap text-xs font-medium text-gray-400 sm:text-sm">
            <span className="text-white">
              {formatCurrency(Number(meta.ahorro_actual || 0) + Number(projectedAmount || 0))}
            </span>{' '}
            / {formatCurrency(meta.monto_objetivo)}
          </span>
          {onVerHistorial && (
            <button
              onClick={() => onVerHistorial(meta.id)}
              aria-label={`Ver historial de aportes de ${meta.nombre}`}
              className="shrink-0 p-1 text-gray-500 transition-colors hover:text-[#3b82f6]"
            >
              <History size={16} />
            </button>
          )}
          <button
            onClick={() => onDelete(meta.id)}
            aria-label={`Eliminar meta ${meta.nombre}`}
            className="shrink-0 p-1 text-gray-500 transition-colors hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="w-full bg-white/5 rounded-full h-3 border border-white/10 overflow-hidden mb-3 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(projectedPercentage, projectedAmount > 0 ? 1 : 0)}%` }}
          className={`h-3 rounded-full absolute top-0 left-0 opacity-40 ${willBeCompleted ? 'bg-gradient-to-r from-[#3b82f6] to-[#22c55e]' : 'bg-[#3b82f6]'}`}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(currentPercentage, meta.ahorro_actual > 0 ? 1 : 0)}%` }}
          className={`h-3 rounded-full absolute top-0 left-0 z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)] ${isCompleted ? 'bg-gradient-to-r from-[#3b82f6] to-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.8)]' : ''}`}
          style={{ backgroundColor: !isCompleted ? color : undefined }}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${willBeCompleted ? 'bg-[#22c55e] text-[#090d16]' : 'bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/25'}`}
        >
          {projectedPercentage < 1 && projectedPercentage > 0
            ? projectedPercentage.toFixed(2)
            : projectedPercentage.toFixed(0)}
          % {willBeCompleted ? 'Logrado' : 'Proyectado'}
        </span>
        {projectedAmount > 0 && !isCompleted && (
          <span className="text-[11px] font-bold text-[#22c55e] animate-pulse sm:text-xs">
            +{formatCurrency(projectedAmount)} proyectados
          </span>
        )}
      </div>
    </div>
  );
}
