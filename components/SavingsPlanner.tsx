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
  data, token,
  savingsPercentage, setSavingsPercentage,
  savingsDistributionMode, setSavingsDistributionMode,
  manualSavingsAmount, setManualSavingsAmount,
  showSuccessFeedback, showFeedback, fetchData,
}: SavingsPlannerProps) {
  const totalToDistribute = manualSavingsAmount
    ? Number(manualSavingsAmount)
    : (Number(data.summary.balance_total) * savingsPercentage) / 100;

  const handleExecutePlan = async () => {
    if (totalToDistribute <= 0) return;

    const allocations = calculateSavingsDistribution(
      totalToDistribute, data.metas, savingsDistributionMode
    );

    if (confirm(`¿Confirmas la distribución de ${formatCurrency(totalToDistribute)} en ${allocations.length} metas?`)) {
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
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-3xl p-8 mb-10 shadow-2xl relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#f59e0b] opacity-5 pointer-events-none" />

      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 relative z-10">
        <div className="max-w-md">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <Target className="text-[#f59e0b]" /> Planificador de Inversión
          </h3>
          <p className="text-gray-400 mb-6">
            Optimiza cómo crece tu dinero. Elige un porcentaje o un monto exacto y decide cómo distribuirlo entre tus metas.
          </p>

          <div className="flex gap-2 p-1 bg-[#121212] rounded-xl border border-[#2e2e2e] mb-4">
            <button
              onClick={() => setSavingsDistributionMode('equitativa')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${savingsDistributionMode === 'equitativa' ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:text-white'}`}
            >
              Equitativa
            </button>
            <button
              onClick={() => setSavingsDistributionMode('prioridad')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${savingsDistributionMode === 'prioridad' ? 'bg-[#f59e0b] text-white shadow-lg shadow-yellow-900/20' : 'text-gray-500 hover:text-white'}`}
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

        <div className="flex-1 w-full bg-[#121212] p-6 rounded-2xl border border-[#2e2e2e]">
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Porcentaje de Balance</span>
                <span className="text-[#f59e0b] font-extrabold">{savingsPercentage}%</span>
              </div>
              <input
                type="range"
                min="0" max="100"
                value={savingsPercentage}
                onChange={(e) => { setSavingsPercentage(parseInt(e.target.value)); setManualSavingsAmount(''); }}
                className="w-full h-1.5 bg-[#1e1e1e] rounded-lg appearance-none cursor-pointer accent-[#f59e0b]"
              />
            </div>
            <div className="w-full sm:w-48">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">O monto exacto</span>
              </div>
              <input
                type="number"
                placeholder="Monto $"
                value={manualSavingsAmount}
                onChange={(e) => { setManualSavingsAmount(e.target.value); setSavingsPercentage(0); }}
                className="w-full bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f59e0b]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1e1e1e] p-4 rounded-xl border border-[#2e2e2e]">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Balance Disponible</p>
              <p className="text-md font-bold text-white">{formatCurrency(data.summary.balance_total)}</p>
            </div>
            <div className="bg-[#1e1e1e] p-4 rounded-xl border border-[#f59e0b] bg-opacity-10">
              <p className="text-[10px] text-[#f59e0b] uppercase font-bold mb-1">Total a Invertir</p>
              <p className="text-md font-bold text-[#f59e0b]">{formatCurrency(totalToDistribute)}</p>
            </div>
            <button
              onClick={handleExecutePlan}
              className="bg-[#f59e0b] hover:bg-yellow-500 text-black font-extrabold rounded-xl transition-all shadow-lg shadow-yellow-900/20 flex items-center justify-center gap-2"
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
