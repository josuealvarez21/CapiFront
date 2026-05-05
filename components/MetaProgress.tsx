'use client';

import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Meta } from '@/lib/types';

interface MetaProgressProps {
  meta: Meta;
  onDelete: (id: string) => void;
  projectedAmount?: number;
}

export default function MetaProgress({ meta, onDelete, projectedAmount = 0 }: MetaProgressProps) {
  const currentActual = Number(meta.ahorro_actual || 0);
  const target = Number(meta.monto_objetivo || 0);
  const projected = Number(projectedAmount || 0);

  const currentPercentage = target > 0 ? Math.min((currentActual / target) * 100, 100) : 0;
  const projectedPercentage = target > 0 ? Math.min(((currentActual + projected) / target) * 100, 100) : 0;

  const isCompleted = currentActual >= target;
  const willBeCompleted = (currentActual + projected) >= target;
  const color = meta.color || '#f59e0b';

  const calculateMonthsRemaining = () => {
    if (isCompleted) return 0;
    if (projectedAmount <= 0) return null;
    const remaining = meta.monto_objetivo - meta.ahorro_actual;
    return Math.ceil(remaining / projectedAmount);
  };

  const months = calculateMonthsRemaining();

  return (
    <div className={`mb-4 bg-[#121212] p-5 rounded-2xl border transition-all duration-500 relative overflow-hidden group ${isCompleted ? 'border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-[#2e2e2e] hover:border-[#f59e0b]'}`}>
      <div className="flex justify-between mb-3 relative z-10">
        <div className="flex flex-col">
          <span className="text-white font-bold tracking-wide flex items-center gap-2">
            {meta.nombre}
            {isCompleted && <span className="text-[#22c55e] text-[10px] bg-[#1C542D] px-2 py-0.5 rounded-full uppercase">Completada</span>}
          </span>
          {months !== null && !isCompleted && (
            <span className="text-[10px] text-gray-500 font-medium">Faltan aprox. {months} meses</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium mr-2">
            <span className="text-white">{formatCurrency(Number(meta.ahorro_actual || 0) + Number(projectedAmount || 0))}</span> / {formatCurrency(meta.monto_objetivo)}
          </span>
          <button onClick={() => onDelete(meta.id)} className="text-gray-500 hover:text-red-500 transition-colors p-1">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="w-full bg-[#1e1e1e] rounded-full h-3 border border-[#2e2e2e] overflow-hidden mb-3 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(projectedPercentage, (projectedAmount > 0 ? 1 : 0))}%` }}
          className={`h-3 rounded-full absolute top-0 left-0 opacity-40 ${willBeCompleted ? 'bg-[#22c55e]' : 'bg-[#f59e0b]'}`}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(currentPercentage, (meta.ahorro_actual > 0 ? 1 : 0))}%` }}
          className={`h-3 rounded-full absolute top-0 left-0 z-10 shadow-[0_0_15px_rgba(245,158,11,0.6)] ${isCompleted ? 'bg-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.8)]' : ''}`}
          style={{ backgroundColor: !isCompleted ? color : undefined }}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${willBeCompleted ? 'bg-[#22c55e]' : 'bg-[#f59e0b]'} text-[#121212]`}>
          {projectedPercentage < 1 && projectedPercentage > 0 ? projectedPercentage.toFixed(2) : projectedPercentage.toFixed(0)}% {willBeCompleted ? 'Logrado' : 'Proyectado'}
        </span>
        {projectedAmount > 0 && !isCompleted && (
          <span className="text-[#22c55e] text-xs font-bold animate-pulse">
            +{formatCurrency(projectedAmount)} proyectados
          </span>
        )}
      </div>
    </div>
  );
}
