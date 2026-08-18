'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Target, PlusCircle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { calculateSavingsDistribution } from '@/lib/savings';
import { api } from '@/lib/api';
import type { DashboardData, SavingsDistributionMode } from '@/lib/types';

interface SavingsPlannerProps {
  data: DashboardData;
  token: string;
  savingsPercentage: number;
  setSavingsPercentage: (v: number) => void;
  savingsDistributionMode: SavingsDistributionMode;
  setSavingsDistributionMode: (m: SavingsDistributionMode) => void;
  manualSavingsAmount: string;
  setManualSavingsAmount: (v: string) => void;
  showSuccessFeedback: string | null;
  showFeedback: (msg: string) => void;
  fetchData: () => Promise<void>;
}

export default function SavingsPlanner({
  data,
  token,
  savingsPercentage,
  setSavingsPercentage,
  savingsDistributionMode,
  setSavingsDistributionMode,
  manualSavingsAmount,
  setManualSavingsAmount,
  showSuccessFeedback,
  showFeedback,
  fetchData,
}: SavingsPlannerProps) {
  const totalToDistribute = manualSavingsAmount
    ? Number(manualSavingsAmount)
    : (Number(data.summary.balance_total) * savingsPercentage) / 100;

  const handleExecutePlan = async () => {
    if (totalToDistribute <= 0) return;

    const allocations = calculateSavingsDistribution(
      totalToDistribute,
      data.metas,
      savingsDistributionMode,
    );

    if (
      confirm(
        `¿Confirmas la distribución de ${formatCurrency(totalToDistribute)} en ${allocations.length} metas?`,
      )
    ) {
      try {
        await api.goals.bulkAllocate(token, allocations);
        showFeedback('¡Inversión exitosa! Tus metas están más cerca.');
        await fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#3b82f6] opacity-5 pointer-events-none" />

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 relative z-10">
        <div className="max-w-md">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-3">
            <Target className="text-[#3b82f6]" /> Planificador de Inversión
          </h3>
          <p className="text-gray-400 text-sm mb-5">
            Optimiza cómo crece tu dinero. Elige un porcentaje o un monto exacto y decide cómo
            distribuirlo entre tus metas.
          </p>

          <div className="flex gap-2 p-1 glass-soft rounded-xl border border-white/10 mb-4">
            <button
              onClick={() => setSavingsDistributionMode('equitativa')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${savingsDistributionMode === 'equitativa' ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:text-white'}`}
            >
              Equitativa
            </button>
            <button
              onClick={() => setSavingsDistributionMode('prioridad')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${savingsDistributionMode === 'prioridad' ? 'bg-[#22c55e] text-[#090d16] shadow-lg shadow-green-900/20' : 'text-gray-500 hover:text-white'}`}
            >
              Por Prioridad
            </button>
          </div>
          <p className="text-[10px] text-gray-500 italic">
            {savingsDistributionMode === 'equitativa'
              ? '* Divide el ahorro en partes iguales entre todas tus metas.'
              : '* Prioriza completar las metas más cercanas a su fecha límite.'}
          </p>
        </div>

        <div className="flex-1 w-full glass-soft p-5 rounded-2xl border border-white/10">
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
              <input
                type="number"
                placeholder="Monto $"
                value={manualSavingsAmount}
                onChange={(e) => {
                  setManualSavingsAmount(e.target.value);
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
              <p className="text-md font-bold text-white">
                {formatCurrency(data.summary.balance_total)}
              </p>
            </div>
            <div className="glass-soft p-4 rounded-xl border border-[#22c55e]/40 bg-[#22c55e]/5">
              <p className="text-[10px] text-[#4ade80] uppercase font-bold mb-1">
                Total a Invertir
              </p>
              <p className="text-md font-bold text-[#4ade80]">
                {formatCurrency(totalToDistribute)}
              </p>
            </div>
            <button
              onClick={handleExecutePlan}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-[#090d16] font-extrabold rounded-xl transition-all shadow-lg shadow-green-900/30 flex items-center justify-center gap-2"
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
