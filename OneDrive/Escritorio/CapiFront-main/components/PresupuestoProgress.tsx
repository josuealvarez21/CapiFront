'use client';

import { motion } from 'framer-motion';
import { Trash2, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Presupuesto } from '@/lib/types';

interface PresupuestoProgressProps {
  presupuesto: Presupuesto;
  onDelete: (id: string) => void;
}

export default function PresupuestoProgress({ presupuesto, onDelete }: PresupuestoProgressProps) {
  const gastado = Number(presupuesto.gastado || 0);
  const limite = Number(presupuesto.limite || 0);
  const porcentaje = limite > 0 ? (gastado / limite) * 100 : 0;
  const esExcedido = gastado > limite;
  const montoDiferencia = Math.abs(limite - gastado);

  return (
    <div
      className={`mb-4 bg-[#121212] p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${esExcedido ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-[#2e2e2e] hover:border-[#8b5cf6]'}`}
    >
      <div className="flex justify-between mb-4 relative z-10">
        <div className="flex flex-col">
          <span className="text-white font-bold tracking-wide flex items-center gap-2">
            {presupuesto.categoria}
            {esExcedido && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                EXCEDIDO
              </span>
            )}
          </span>
          <p
            className={`text-[11px] mt-1 ${esExcedido ? 'text-red-400 font-bold' : 'text-gray-500'}`}
          >
            {esExcedido
              ? `¡Te has pasado por ${formatCurrency(montoDiferencia)}!`
              : `Te quedan ${formatCurrency(montoDiferencia)} disponibles`}
          </p>
        </div>
        <button
          onClick={() => onDelete(presupuesto.id)}
          className="text-gray-600 hover:text-red-500 transition-colors p-1"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <div className="flex justify-between items-end mb-3 relative z-10">
        <span className={`text-2xl font-black ${esExcedido ? 'text-red-500' : 'text-white'}`}>
          {formatCurrency(gastado)}
        </span>
        <span className="text-gray-500 text-xs font-bold mb-1">de {formatCurrency(limite)}</span>
      </div>
      <div className="w-full bg-[#1e1e1e] rounded-full h-3.5 border border-[#2e2e2e] overflow-hidden relative z-10 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(porcentaje, 100)}%` }}
          className={`h-full transition-all duration-1000 ${esExcedido ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.4)]'}`}
        />
      </div>
      <div className="mt-3 flex justify-between items-center relative z-10">
        <span
          className={`text-[10px] font-black uppercase tracking-widest ${esExcedido ? 'text-red-500' : 'text-[#8b5cf6]'}`}
        >
          {porcentaje.toFixed(1)}% Consumido
        </span>
        {esExcedido && <TrendingUp size={14} className="text-red-500" />}
      </div>
    </div>
  );
}
