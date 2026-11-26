'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Presupuesto } from '@/lib/types';

interface PresupuestoProgressProps {
  presupuesto: Presupuesto;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, limite: number) => Promise<void> | void;
}

export default function PresupuestoProgress({ presupuesto, onDelete, onUpdate }: PresupuestoProgressProps) {
  const gastado = Number(presupuesto.gastado || 0);
  const limite = Number(presupuesto.limite || 0);
  const porcentaje = limite > 0 ? (gastado / limite) * 100 : 0;
  const esExcedido = gastado > limite;
  const montoDiferencia = Math.abs(limite - gastado);
  const [editando, setEditando] = useState(false);
  const [nuevoLimite, setNuevoLimite] = useState(String(limite));
  const [guardando, setGuardando] = useState(false);

  const guardarLimite = async () => {
    const valor = Number(nuevoLimite);
    if (!Number.isFinite(valor) || valor <= 0 || !onUpdate) return;
    setGuardando(true);
    await onUpdate(presupuesto.id, valor);
    setGuardando(false);
    setEditando(false);
  };

  return (
    <div
      className={`mb-4 glass-soft rounded-2xl border p-4 transition-all duration-300 relative overflow-hidden group sm:p-5 ${esExcedido ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-white/10 hover:border-[#3b82f6]/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.35)]'}`}
    >
      <div className="relative z-10 mb-4 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <span className="flex min-w-0 items-center gap-2 font-bold tracking-wide text-white">
            <span className="truncate">{presupuesto.categoria}</span>
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
        <div className="flex shrink-0 items-center gap-2">
          {onUpdate && (
            <button
              type="button"
              onClick={() => {
                setNuevoLimite(String(limite));
                setEditando((valor) => !valor);
              }}
              className="text-xs font-bold text-[#60a5fa] transition-colors hover:text-white"
            >
              Editar
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(presupuesto.id)}
            aria-label={`Eliminar presupuesto de ${presupuesto.categoria}`}
            className="p-1 text-gray-600 transition-colors hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      {editando && (
        <div className="relative z-10 mb-3 flex flex-wrap items-center gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            aria-label={`Nuevo límite para ${presupuesto.categoria}`}
            value={nuevoLimite}
            onChange={(e) => setNuevoLimite(e.target.value)}
            className="glass-soft w-32 rounded-lg bg-[#0a0e17] px-3 py-1.5 text-sm font-bold text-white border border-white/10 focus:outline-none focus:border-[#3b82f6]"
          />
          <button
            type="button"
            disabled={guardando}
            onClick={() => void guardarLimite()}
            className="btn-primary px-3 py-1.5 text-xs disabled:opacity-40"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setEditando(false)}
            className="btn-ghost px-3 py-1.5 text-xs"
          >
            Cancelar
          </button>
        </div>
      )}
      <div className="relative z-10 mb-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <span
          className={`truncate text-xl font-black sm:text-2xl ${esExcedido ? 'text-red-500' : 'text-white'}`}
        >
          {formatCurrency(gastado)}
        </span>
        <span className="shrink-0 text-xs font-bold text-gray-500 sm:mb-1">
          de {formatCurrency(limite)}
        </span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-3.5 border border-white/10 overflow-hidden relative z-10 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(porcentaje, 100)}%` }}
          className={`h-full transition-all duration-1000 ${esExcedido ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-gradient-to-r from-[#3b82f6] to-[#22c55e] shadow-[0_0_15px_rgba(59,130,246,0.4)]'}`}
        />
      </div>
      <div className="relative z-10 mt-3 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`text-[10px] font-black uppercase tracking-widest ${esExcedido ? 'text-red-500' : 'text-[#60a5fa]'}`}
        >
          {porcentaje.toFixed(1)}% Consumido
        </span>
        {esExcedido && <TrendingUp size={14} className="text-red-400" />}
      </div>
    </div>
  );
}
