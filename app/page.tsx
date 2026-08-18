'use client';

import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  PlusCircle,
  MinusCircle,
  Target,
  Wallet,
} from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/utils';
import { getProjectedForMeta } from '@/lib/savings';
import { api } from '@/lib/api';

import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SummaryCards from '@/components/SummaryCards';
import IncomeExpenseChart from '@/components/charts/IncomeExpenseChart';
import MovementsList from '@/components/MovementsList';
import MetaProgress from '@/components/MetaProgress';
import PresupuestoProgress from '@/components/PresupuestoProgress';
import SavingsPlanner from '@/components/SavingsPlanner';
import MovementModal from '@/components/modals/MovementModal';
import GoalModal from '@/components/modals/GoalModal';
import BudgetModal from '@/components/modals/BudgetModal';
import SettingsModal from '@/components/modals/SettingsModal';
import { ChatWidget } from '@/components/chat/ChatWidget';

const tabVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function SinglePageApp() {
  const dashboard = useDashboard();
  const [monthFilter, setMonthFilter] = useState('');

  const {
    token,
    authLoading,
    logout,
    data,
    loading,
    categories,
    currentTab,
    setCurrentTab,
    isModalOpen,
    setIsModalOpen,
    modalType,
    isGoalModalOpen,
    setIsGoalModalOpen,
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isSubmitting,
    openMovementModal,
    handleAddMovement,
    handleAddGoal,
    handleAddBudget,
    handleUpdateProfile,
    handleDeleteMovement,
    handleDeleteGoal,
    handleDeleteBudget,
    formData,
    setFormData,
    goalFormData,
    setGoalFormData,
    budgetFormData,
    setBudgetFormData,
    profilePicUrl,
    setProfilePicUrl,
    profilePicFile,
    setProfilePicFile,
    profileName,
    setProfileName,
    isUploadingProfilePic,
    savingsPercentage,
    setSavingsPercentage,
    savingsDistributionMode,
    setSavingsDistributionMode,
    manualSavingsAmount,
    setManualSavingsAmount,
    showSuccessFeedback,
    showFeedback,
    fetchData,
  } = dashboard;

  // --- Loading / Auth states ---
  if (authLoading || !token) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-medium font-sans animate-pulse">
            Sincronizando cuentas con Cápi...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-white space-y-4">
        <h2 className="text-xl text-red-400 font-bold">Error de Conexión</h2>
        <p className="text-gray-400">No se pudo cargar el Dashboard. Comprueba tu backend.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#3b82f6] px-6 py-2 rounded-xl text-white mt-4 hover:bg-blue-500 transition shadow-lg shadow-blue-900/20"
        >
          Reintentar
        </button>
        <ChatWidget />
      </div>
    );
  }

  // --- Derived data ---
  const movementsFiltered = data.ultimos_movimientos
    .filter((m) =>
      currentTab === 'ingresos' ? m.tipo === 'ingreso' : m.tipo === 'egreso' || m.tipo === 'gasto',
    )
    .filter((m) => !monthFilter || m.fecha.startsWith(monthFilter));

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const currentYear = new Date().getFullYear();
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: `${currentYear}-${String(i + 1).padStart(2, '0')}`,
    label: `${monthNames[i]} ${currentYear}`,
  }));

  const totalToDistribute = manualSavingsAmount
    ? Number(manualSavingsAmount)
    : (Number(data.summary.balance_total) * savingsPercentage) / 100;

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex font-sans">
      <Sidebar
        user={data.user}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onLogout={logout}
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 relative min-h-screen">
        {/* TAB: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <motion.div variants={tabVariants} initial="hidden" animate="show">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">
                  Resumen General
                </h2>
                <p className="text-gray-400 text-sm">
                  Monitoreo de flujo de caja en tiempo real.
                </p>
              </div>
              <div className="flex flex-row w-full sm:w-auto gap-3">
                <button
                  onClick={() => openMovementModal('ingreso')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#22c55e]/15 hover:bg-[#22c55e] hover:text-[#090d16] text-[#22c55e] border border-[#22c55e]/30 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-green-900/20 active:scale-95 text-sm"
                >
                  <PlusCircle size={18} /> Ingreso
                </button>
                <button
                  onClick={() => openMovementModal('gasto')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-red-900/20 active:scale-95 text-sm"
                >
                  <MinusCircle size={18} /> Gasto
                </button>
              </div>
            </header>
            <SummaryCards summary={data.summary} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <IncomeExpenseChart
                summary={data.summary}
                movements={data.ultimos_movimientos}
              />
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 }}
                className="glass-card rounded-3xl p-5"
              >
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-white">Últimos Movimientos</h3>
                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="glass-soft bg-[#0a0e17] text-xs font-bold text-white border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#3b82f6] [color-scheme:dark] cursor-pointer"
                  >
                    <option value="">Todos los meses</option>
                    {monthOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <MovementsList
                  movements={data.ultimos_movimientos
                    .filter((m) => !monthFilter || m.fecha.startsWith(monthFilter))
                    .slice(0, 5)}
                  onDelete={handleDeleteMovement}
                  emptyMessage="No hay movimientos. Agrega uno."
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* TAB: INGRESOS / GASTOS */}
        {(currentTab === 'ingresos' || currentTab === 'gastos') && (
          <motion.div variants={tabVariants} initial="hidden" animate="show">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">
                  Registro de {currentTab === 'ingresos' ? 'Ingresos' : 'Gastos'}
                </h2>
                <p className="text-gray-400 text-sm">Historial completo detallado.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="glass-soft bg-[#0a0e17] text-sm font-bold text-white border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3b82f6] [color-scheme:dark] cursor-pointer"
                >
                  <option value="">Todos los meses</option>
                  {monthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => openMovementModal(currentTab === 'ingresos' ? 'ingreso' : 'gasto')}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 text-white shadow-xl active:scale-95 text-sm ${currentTab === 'ingresos' ? 'bg-[#22c55e] hover:bg-[#16a34a] shadow-green-900/20' : 'bg-red-500 hover:bg-red-600 shadow-red-900/20'}`}
                >
                  <Plus size={18} /> Añadir {currentTab === 'ingresos' ? 'ingreso' : 'gasto'}
                </button>
              </div>
            </header>
            <div className="glass-card rounded-3xl p-5">
              <MovementsList
                movements={movementsFiltered}
                onDelete={handleDeleteMovement}
                variant="full"
                emptyIcon={
                  currentTab === 'ingresos' ? (
                    <TrendingUp size={64} className="opacity-20 mb-4" />
                  ) : (
                    <TrendingDown size={64} className="opacity-20 mb-4" />
                  )
                }
                emptyMessage={`Aún no hay registros en la categoría de ${currentTab}.`}
              />
            </div>
          </motion.div>
        )}

        {/* TAB: METAS */}
        {currentTab === 'metas' && (
          <motion.div variants={tabVariants} initial="hidden" animate="show">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">
                  Tus Metas de Ahorro
                </h2>
                <p className="text-gray-400 text-sm">
                  Define un horizonte para tus ahorros con acento esmeralda.
                </p>
              </div>
              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-[#090d16] px-5 py-2.5 rounded-xl font-bold transition-all shadow-xl shadow-green-900/40 active:scale-95 text-sm"
              >
                <Plus size={18} /> Definir Objetivo
              </button>
            </header>

            <SavingsPlanner
              data={data}
              token={token}
              savingsPercentage={savingsPercentage}
              setSavingsPercentage={setSavingsPercentage}
              savingsDistributionMode={savingsDistributionMode}
              setSavingsDistributionMode={setSavingsDistributionMode}
              manualSavingsAmount={manualSavingsAmount}
              setManualSavingsAmount={setManualSavingsAmount}
              showSuccessFeedback={showSuccessFeedback}
              showFeedback={showFeedback}
              fetchData={fetchData}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.metas.length === 0 ? (
                <div className="col-span-full border-2 border-dashed border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center text-gray-500 glass-soft">
                  <Target size={64} className="opacity-20 mb-4" />
                  <p className="text-lg">No has establecido ninguna meta financiera aún.</p>
                </div>
              ) : (
                data.metas.map((meta) => {
                  const projectedAmount = getProjectedForMeta(
                    meta,
                    data.metas,
                    totalToDistribute,
                    savingsDistributionMode,
                  );
                  return (
                    <motion.div
                      key={meta.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="glass-card rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#22c55e]/50 hover:shadow-[0_0_35px_-10px_rgba(34,197,94,0.35)] relative group overflow-hidden"
                    >
                      <div className="absolute -right-6 -top-6 text-[#22c55e] opacity-10 group-hover:scale-125 transition-transform duration-500 pointer-events-none">
                        <Target size={120} />
                      </div>
                      <MetaProgress
                        meta={meta}
                        onDelete={handleDeleteGoal}
                        projectedAmount={projectedAmount}
                      />
                      <button
                        onClick={async () => {
                          if (
                            confirm(
                              `¿Quieres abonar ${formatCurrency(projectedAmount)} a esta meta?`,
                            )
                          ) {
                            try {
                              await api.goals.update(token, meta.id, projectedAmount);
                              showFeedback(
                                `¡Abono de ${formatCurrency(projectedAmount)} realizado!`,
                              );
                              await fetchData();
                            } catch (e) {
                              console.error(e);
                            }
                          }
                        }}
                        className={`w-full mt-3 py-2.5 border transition-all rounded-xl font-bold uppercase tracking-wider text-sm shadow-md ${projectedAmount > 0 ? 'bg-[#22c55e] text-[#090d16] border-[#22c55e] hover:bg-[#16a34a]' : 'bg-[#0a0e17] border-white/10 text-gray-500 cursor-not-allowed'}`}
                        disabled={projectedAmount <= 0}
                      >
                        {projectedAmount > 0 ? 'Abonar Plan' : 'Sin Alocación'}
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {/* TAB: PRESUPUESTOS */}
        {currentTab === 'presupuestos' && (
          <motion.div variants={tabVariants} initial="hidden" animate="show">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">
                  Manejo de Presupuestos
                </h2>
                <p className="text-gray-400 text-sm">
                  Control estricto de fuga de capital con analítica.
                </p>
              </div>
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-xl shadow-blue-900/40 active:scale-95 text-sm"
              >
                <Wallet size={18} /> Nuevo Límite Escudo
              </button>
            </header>
            <div className="glass-card rounded-3xl p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.presupuestos.length === 0 ? (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-500">
                    <Wallet size={64} className="opacity-20 mb-4" />
                    <p className="text-lg">Tus finanzas no tienen barreras activas actualmente.</p>
                  </div>
                ) : (
                  data.presupuestos.map((p) => (
                    <PresupuestoProgress
                      key={p.id}
                      presupuesto={p}
                      onDelete={handleDeleteBudget}
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* MODALS */}
      <MovementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddMovement}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        modalType={modalType}
        currentTab={currentTab}
        isSubmitting={isSubmitting}
      />
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSubmit={handleAddGoal}
        formData={goalFormData}
        setFormData={setGoalFormData}
        isSubmitting={isSubmitting}
      />
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSubmit={handleAddBudget}
        formData={budgetFormData}
        setFormData={setBudgetFormData}
        categories={categories}
        isSubmitting={isSubmitting}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSubmit={handleUpdateProfile}
        user={data.user}
        profileName={profileName}
        setProfileName={setProfileName}
        profilePicUrl={profilePicUrl}
        setProfilePicUrl={setProfilePicUrl}
        profilePicFile={profilePicFile}
        setProfilePicFile={setProfilePicFile}
        isUploading={isUploadingProfilePic}
      />
      <ChatWidget onDataChange={fetchData} />
    </div>
  );
}