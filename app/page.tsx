'use client';

import { motion } from 'framer-motion';
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

export default function SinglePageApp() {
  const dashboard = useDashboard();
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
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
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
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
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white space-y-4">
        <h2 className="text-xl text-red-500 font-bold">Error de Conexión</h2>
        <p className="text-gray-400">No se pudo cargar el Dashboard. Comprueba tu backend.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#3b82f6] px-6 py-2 rounded-xl text-white mt-4 hover:bg-blue-600 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // --- Derived data ---
  const movementsFiltered =
    currentTab === 'ingresos'
      ? data.ultimos_movimientos.filter((m) => m.tipo === 'ingreso')
      : data.ultimos_movimientos.filter((m) => m.tipo === 'egreso' || m.tipo === 'gasto');

  const totalToDistribute = manualSavingsAmount
    ? Number(manualSavingsAmount)
    : (Number(data.summary.balance_total) * savingsPercentage) / 100;

  return (
    <div className="min-h-screen bg-[#121212] text-white flex font-sans">
      <Sidebar
        user={data.user}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onLogout={logout}
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 pb-24 md:pb-10 relative min-h-screen bg-gradient-to-b from-[#181818] to-[#121212]">
        {/* TAB: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <div className="animate-in fade-in duration-300 slide-in-from-bottom-4">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                  Resumen General
                </h2>
                <p className="text-gray-400 text-sm sm:text-lg">
                  Monitoreo de flujo de caja en tiempo real.
                </p>
              </div>
              <div className="flex flex-row w-full sm:w-auto gap-3">
                <button
                  onClick={() => openMovementModal('ingreso')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1C542D] hover:bg-[#22c55e] hover:text-[#121212] text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-green-900/20 active:scale-95 text-sm sm:text-base"
                >
                  <PlusCircle size={20} /> Ingreso
                </button>
                <button
                  onClick={() => openMovementModal('gasto')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#451a1a] hover:bg-red-500 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-red-900/20 active:scale-95 text-sm sm:text-base"
                >
                  <MinusCircle size={20} /> Gasto
                </button>
              </div>
            </header>
            <SummaryCards summary={data.summary} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <IncomeExpenseChart summary={data.summary} />
              <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Últimos Movimientos</h3>
                <MovementsList
                  movements={data.ultimos_movimientos.slice(0, 5)}
                  onDelete={handleDeleteMovement}
                  emptyMessage="No hay movimientos. Agrega uno."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: INGRESOS / GASTOS */}
        {(currentTab === 'ingresos' || currentTab === 'gastos') && (
          <div className="animate-in fade-in duration-300 slide-in-from-bottom-4">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                  Registro de {currentTab === 'ingresos' ? 'Ingresos' : 'Gastos'}
                </h2>
                <p className="text-gray-400 text-sm sm:text-lg">Historial completo detallado.</p>
              </div>
              <button
                onClick={() => openMovementModal(currentTab === 'ingresos' ? 'ingreso' : 'gasto')}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 text-white shadow-xl active:scale-95 text-sm sm:text-base ${currentTab === 'ingresos' ? 'bg-[#1C542D] hover:bg-[#22c55e] hover:text-[#121212] shadow-green-900/20' : 'bg-[#451a1a] hover:bg-red-600 shadow-red-900/20'}`}
              >
                <Plus size={20} /> Añadir {currentTab === 'ingresos' ? 'ingreso' : 'gasto'}
              </button>
            </header>
            <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-3xl p-8 shadow-2xl">
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
          </div>
        )}

        {/* TAB: METAS */}
        {currentTab === 'metas' && (
          <div className="animate-in fade-in duration-300 slide-in-from-bottom-4">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                  Tus Metas de Ahorro
                </h2>
                <p className="text-gray-400 text-sm sm:text-lg">
                  Define un horizonte para tus ahorros.
                </p>
              </div>
              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-yellow-400 hover:text-black text-white px-6 py-3 rounded-xl font-bold transition-all shadow-xl shadow-yellow-900/20 active:scale-95 text-sm sm:text-base"
              >
                <Plus size={20} /> Definir Objetivo
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.metas.length === 0 ? (
                <div className="col-span-full border-2 border-dashed border-[#2e2e2e] rounded-3xl p-20 flex flex-col items-center justify-center text-gray-500">
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
                    <div
                      key={meta.id}
                      className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-3xl p-6 shadow-xl hover:border-[#f59e0b] transition-colors relative group overflow-hidden"
                    >
                      <div className="absolute -right-6 -top-6 text-[#f59e0b] opacity-5 group-hover:scale-125 transition-transform duration-500 pointer-events-none">
                        <Target size={150} />
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
                        className={`w-full mt-4 py-3 border transition-all rounded-xl font-bold uppercase tracking-wider text-sm shadow-md ${projectedAmount > 0 ? 'bg-[#f59e0b] text-black border-[#f59e0b] hover:bg-yellow-500' : 'bg-[#121212] border-[#2e2e2e] text-gray-500 cursor-not-allowed'}`}
                        disabled={projectedAmount <= 0}
                      >
                        {projectedAmount > 0 ? 'Abonar Plan' : 'Sin Alocación'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB: PRESUPUESTOS */}
        {currentTab === 'presupuestos' && (
          <div className="animate-in fade-in duration-300 slide-in-from-bottom-4">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                  Manejo de Presupuestos
                </h2>
                <p className="text-gray-400 text-sm sm:text-lg">
                  Control estricto de fuga de capital.
                </p>
              </div>
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#8b5cf6] hover:bg-purple-500 hover:text-white text-white px-6 py-3 rounded-xl font-bold transition-all shadow-xl shadow-purple-900/20 active:scale-95 text-sm sm:text-base"
              >
                <Wallet size={20} /> Nuevo Límite Escudo
              </button>
            </header>
            <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.presupuestos.length === 0 ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500">
                    <Wallet size={64} className="opacity-20 mb-4" />
                    <p className="text-lg">Tus finanzas no tienen barreras activas actualmente.</p>
                  </div>
                ) : (
                  data.presupuestos.map((p) => (
                    <PresupuestoProgress key={p.id} presupuesto={p} onDelete={handleDeleteBudget} />
                  ))
                )}
              </div>
            </div>
          </div>
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
