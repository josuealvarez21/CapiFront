'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Target, PlusCircle, TrendingUp, Crosshair } from 'lucide-react';
import { formatCurrency, parseAmountForBackend } from '@/lib/utils';
import { calculateSavingsDistribution } from '@/lib/savings';
import { api } from '@/lib/api';
import type { DashboardData, SavingsDistributionMode } from '@/lib/types';
import type { ConfirmOptions } from '@/components/modals/ConfirmDialog';
import CurrencyInput from '@/components/modals/CurrencyInput';

interface SavingsPlannerProps {
  data: DashboardData;
  token: string;
  savingsPercentage: number;
  setSavingsPercentage: (v: number) => void;
  savingsDistributionMode: SavingsDistributionMode;
  setSavingsDistributionMode: (m: SavingsDistributionMode) => void;
  selectedGoalIds: string[];
  setSelectedGoalIds: (ids: string[]) => void;
  manualSavingsAmount: string;
  setManualSavingsAmount: (v: string) => void;
  showSuccessFeedback: string | null;
  showFeedback: (msg: string) => void;
  fetchData: () => Promise<unknown>;
  onRequestConfirm: (options: ConfirmOptions) => void;
}

export default function SavingsPlanner({
  data,
  token,
  savingsPercentage,
  setSavingsPercentage,
  savingsDistributionMode,
  setSavingsDistributionMode,
  selectedGoalIds,
  setSelectedGoalIds,
  manualSavingsAmount,
  setManualSavingsAmount,
  showSuccessFeedback,
  showFeedback,
  fetchData,
  onRequestConfirm,
}: SavingsPlannerProps) {
  const manualAmount = parseAmountForBackend(manualSavingsAmount);
  const totalToDistribute =
    manualAmount > 0
      ? manualAmount
      : (Number(data.summary.balance_total) * savingsPercentage) / 100;

  const activeMetas = data.metas.filter((m) => m.ahorro_actual < m.monto_objetivo);
  const selectedIds = selectedGoalIds.filter((id) => activeMetas.some((m) => m.id === id));

  const toggleGoal = (id: string) => {
    setSelectedGoalIds(
      selectedIds.includes(id)
        ? selectedIds.filter((goalId) => goalId !== id)
        : [...selectedIds, id],
    );
  };

  const changeMode = (mode: SavingsDistributionMode) => {
    setSavingsDistributionMode(mode);
  };

  const handleExecutePlan = () => {
    if (totalToDistribute <= 0 || activeMetas.length === 0) return;
    if (savingsDistributionMode === 'especifica' && selectedIds.length === 0) return;

    const allocations = calculateSavingsDistribution(
      totalToDistribute,
      data.metas,
      savingsDistributionMode,
      selectedIds,
    );
    if (allocations.length === 0) return;

    const allocated = allocations.reduce((sum, allocation) => sum + allocation.monto, 0);
    const unallocated = totalToDistribute - allocated;
    const isSpecific = savingsDistributionMode === 'especifica';

    onRequestConfirm({
      title: 'Ejecutar plan de inversión',
      description: `¿Confirmas ${isSpecific ? 'asignar' : 'distribuir'} ${formatCurrency(allocated)} en ${isSpecific ? (selectedIds.length === 1 ? '1 meta seleccionada' : `${selectedIds.length} metas seleccionadas`) : `${allocations.length} metas`}?${unallocated > 0 ? ` Quedarían ${formatCurrency(unallocated)} sin distribuir.` : ''}`,
      confirmLabel: isSpecific ? 'Asignar' : 'Distribuir',
      onConfirm: async () => {
        try {
          await api.goals.bulkAllocate(token, allocations);
          showFeedback('¡Inversión exitosa! Tus metas están más cerca.');
          await fetchData();
        } catch (e) {
          console.error(e);
        }
      },
    });
  };

  return (
    <div className="glass-card relative mb-6 overflow-hidden rounded-3xl p-4 sm:mb-8 sm:p-6">
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#3b82f6] opacity-5 pointer-events-none" />

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 relative z-10">
        <div className="w-full max-w-md">
          <h3 className="mb-2 flex items-center gap-2 text-base font-extrabold tracking-tight neon-text sm:gap-3 sm:text-lg">
            <Target className="text-[#60a5fa]" aria-hidden="true" /> Planificador de Inversión
          </h3>
          <p className="text-gray-400 text-sm mb-5">
            Optimiza cómo crece tu dinero. Elige un porcentaje o un monto exacto y decide cómo
            distribuirlo entre tus metas.
          </p>

          <div className="grid grid-cols-1 gap-2 p-1 glass-soft rounded-xl border border-white/10 mb-4 sm:flex sm:gap-2">
            <button
              onClick={() => changeMode('equitativa')}
              className={`w-full flex-1 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all sm:w-auto ${savingsDistributionMode === 'equitativa' ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:text-white'}`}
            >
              Equitativa
            </button>
            <button
              onClick={() => changeMode('prioridad')}
              className={`w-full flex-1 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all sm:w-auto ${savingsDistributionMode === 'prioridad' ? 'bg-[#22c55e] text-[#090d16] shadow-lg shadow-green-900/20' : 'text-gray-500 hover:text-white'}`}
            >
              Por Prioridad
            </button>
            <button
              onClick={() => changeMode('especifica')}
              className={`w-full flex-1 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all sm:w-auto ${savingsDistributionMode === 'especifica' ? 'bg-[#f59e0b] text-[#090d16] shadow-lg shadow-amber-900/20' : 'text-gray-500 hover:text-white'}`}
            >
              <Crosshair size={12} className="mr-1 inline-block align-middle" aria-hidden="true" />
              Meta Específica
            </button>
          </div>
          <p className="text-[10px] text-gray-500 italic">
            {savingsDistributionMode === 'equitativa'
              ? '* Divide el ahorro en partes iguales entre todas tus metas, sin exceder sus objetivos.'
              : savingsDistributionMode === 'prioridad'
                ? '* Prioriza completar las metas más cercanas a su fecha límite.'
                : '* Divide el monto entre las metas elegidas, sin exceder sus objetivos.'}
          </p>
          {savingsDistributionMode === 'especifica' && (
            <div className="mt-3">
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Metas destino
                </span>
                <span className="text-[10px] text-gray-500">
                  {selectedIds.length} seleccionada{selectedIds.length === 1 ? '' : 's'}
                </span>
              </div>
              {activeMetas.length === 0 ? (
                <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-gray-500">
                  No hay metas activas.
                </p>
              ) : (
                <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {activeMetas.map((meta) => {
                    const isSelected = selectedIds.includes(meta.id);
                    return (
                      <label
                        key={meta.id}
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm transition-all ${isSelected ? 'border-[#f59e0b]/60 bg-[#f59e0b]/10 text-white' : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'}`}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleGoal(meta.id)}
                            className="h-4 w-4 shrink-0 accent-[#f59e0b]"
                          />
                          <span className="truncate">{meta.nombre}</span>
                        </span>
                        <span className="shrink-0 text-[11px] text-gray-500">
                          {formatCurrency(meta.monto_objetivo - meta.ahorro_actual)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
              {activeMetas.length > 0 && selectedIds.length === 0 && (
                <p className="mt-2 text-[10px] text-[#f59e0b]">Elige al menos una meta.</p>
              )}
            </div>
          )}
        </div>

        <div className="w-full flex-1 glass-soft rounded-2xl border border-white/10 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                  Porcentaje de Balance
                </span>
                <span className="text-[#4ade80] font-extrabold">{savingsPercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={savingsPercentage}
                onChange={(e) => {
                  setSavingsPercentage(parseInt(e.target.value));
                  setManualSavingsAmount('');
                }}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
              />
            </div>
            <div className="w-full sm:w-48">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                  O monto exacto
                </span>
              </div>
              <CurrencyInput
                value={manualSavingsAmount}
                onChange={(amount) => {
                  setManualSavingsAmount(amount);
                  setSavingsPercentage(0);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-soft p-4 rounded-xl border border-white/10">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                Balance Disponible
              </p>
              <p className="text-sm font-bold text-white sm:text-base">
                {formatCurrency(data.summary.balance_total)}
              </p>
            </div>
            <div className="glass-soft p-4 rounded-xl border border-[#22c55e]/40 bg-[#22c55e]/5">
              <p className="text-[10px] text-[#4ade80] uppercase font-bold mb-1">
                Total a Invertir
              </p>
              <p className="text-sm font-bold text-[#4ade80] sm:text-base">
                {formatCurrency(totalToDistribute)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleExecutePlan}
              disabled={
                activeMetas.length === 0 ||
                totalToDistribute <= 0 ||
                (savingsDistributionMode === 'especifica' && selectedIds.length === 0)
              }
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PlusCircle size={18} /> Ejecutar Plan
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessFeedback && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#22c55e] text-white px-6 py-2 rounded-full font-bold text-sm shadow-xl z-20 flex items-center gap-2"
          >
            <TrendingUp size={16} /> {showSuccessFeedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
