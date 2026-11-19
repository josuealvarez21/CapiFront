'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles, Wallet } from 'lucide-react';
import { DEMO_CURRENT_MONTH, money, type DemoGoal } from './demo-data';

interface GoalsPanelProps {
  goals: DemoGoal[];
  balance: number;
  onAllocate: (goalId: string, monto: number) => void;
  reduceMotion: boolean;
}

function sugerenciaPara(goal: DemoGoal | undefined, balance: number): number {
  if (!goal) return 0;
  const restante = Math.max(0, goal.objetivo - goal.actual);
  const tope = Math.min(balance, restante);
  const max = Math.max(5000, Math.floor(tope / 5000) * 5000);
  return Math.min(max, Math.max(5000, Math.floor((balance * 0.2) / 5000) * 5000));
}

export default function GoalsPanel({
  goals,
  balance,
  onAllocate,
  reduceMotion,
}: GoalsPanelProps) {
  const [selectedId, setSelectedId] = useState(goals[0]?.id ?? '');
  const [monto, setMonto] = useState(() => sugerenciaPara(goals[0], balance));

  const selected = goals.find((goal) => goal.id === selectedId);

  const seleccionar = (goal: DemoGoal) => {
    setSelectedId(goal.id);
    setMonto(sugerenciaPara(goal, balance));
  };

  const restante = selected ? Math.max(0, selected.objetivo - selected.actual) : 0;
  const max = Math.max(5000, Math.floor(Math.min(balance, restante) / 5000) * 5000);
  const aplicado = Math.min(monto, restante);

  const ejecutar = () => {
    if (!selected || aplicado <= 0) return;
    onAllocate(selected.id, aplicado);
    setMonto(
      sugerenciaPara(
        { ...selected, actual: Math.min(selected.objetivo, selected.actual + aplicado) },
        balance,
      ),
    );
  };
  const porcentajeActual = selected
    ? Math.min(100, Math.round((selected.actual / selected.objetivo) * 100))
    : 0;
  const porcentajeNuevo = selected
    ? Math.min(100, Math.round(((selected.actual + aplicado) / selected.objetivo) * 100))
    : 0;

  const fechaEstimada = useMemo(() => {
    if (!selected || aplicado <= 0) return null;
    if (aplicado >= restante) return '¡Meta completada con este abono!';
    const abonos = Math.ceil((restante - aplicado) / aplicado);
    const [anio, mes] = DEMO_CURRENT_MONTH.split('-').map(Number);
    return new Date(anio, mes - 1 + abonos, 1).toLocaleDateString('es-CO', {
      month: 'long',
      year: 'numeric',
    });
  }, [aplicado, restante, selected]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {goals.map((goal) => {
          const porcentaje = Math.min(100, Math.round((goal.actual / goal.objetivo) * 100));
          const activa = goal.id === selectedId;
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => seleccionar(goal)}
              aria-pressed={activa}
              className={`glass-soft rounded-2xl border p-4 text-left transition-colors ${
                activa
                  ? 'border-[#22c55e]/50 ring-1 ring-inset ring-[#22c55e]/30'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-white">{goal.nombre}</span>
                <span className="rounded-full border border-[#22c55e]/30 bg-[#22c55e]/15 px-2 py-0.5 text-[10px] font-black text-[#4ade80]">
                  {porcentaje}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full border border-white/10 bg-white/5">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${goal.color} shadow-[0_0_15px_rgba(34,197,94,0.4)]`}
                  initial={false}
                  animate={{ width: `${porcentaje}%` }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {money(goal.actual)} <span className="text-gray-600">/</span> {money(goal.objetivo)}
              </p>
              {activa && (
                <p className="mt-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#4ade80]">
                  <Check size={12} aria-hidden="true" /> Meta seleccionada
                </p>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300">
              <Sparkles size={14} className="text-[#a78bfa]" aria-hidden="true" />
              Planificador · {selected.nombre}
            </p>
            <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Wallet size={13} aria-hidden="true" />
              Balance disponible: <span className="font-bold text-white">{money(balance)}</span>
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="demo-slider" className="text-xs font-bold text-gray-300">
                ¿Cuánto quieres abonar?
              </label>
              <span className="text-lg font-extrabold text-white">{money(monto)}</span>
            </div>
            <input
              id="demo-slider"
              type="range"
              min={0}
              max={max}
              step={5000}
              value={Math.min(monto, max)}
              onChange={(event) => setMonto(Number(event.target.value))}
              className="w-full accent-[#22c55e]"
              aria-valuetext={money(monto)}
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>$0</span>
              <span>{money(max)}</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/5 p-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-gray-400">Progreso después del abono</span>
              <span className="font-black text-[#4ade80]">
                {porcentajeActual}% <ArrowRight size={12} className="inline" aria-hidden="true" />{' '}
                {porcentajeNuevo}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-white/5">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${selected.color}`}
                initial={false}
                animate={{ width: `${porcentajeNuevo}%` }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              {fechaEstimada
                ? `Con abonos de ${money(aplicado)} llegarías aproximadamente en ${fechaEstimada}.`
                : 'Mové el slider para simular tu próximo abono.'}
            </p>
          </div>

          <button
            type="button"
            onClick={ejecutar}
            disabled={aplicado <= 0 || restante <= 0}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#22c55e] px-4 py-3 text-sm font-black text-white shadow-[0_0_30px_-10px_rgba(34,197,94,0.8)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check size={16} aria-hidden="true" />
            Ejecutar plan · {money(aplicado)}
          </button>
          <p className="mt-2 text-center text-[10px] text-gray-500">
            Esto crea un movimiento real en la demo y actualiza el Reporte.
          </p>
        </div>
      )}
    </div>
  );
}
