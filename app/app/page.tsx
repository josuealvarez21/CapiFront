'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
import { tabSwap } from '@/lib/motion';

import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardInsights from '@/components/DashboardInsights';
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
import ConfirmDialog, { type ConfirmOptions } from '@/components/modals/ConfirmDialog';
import { ReporteMensualTab } from '@/components/reporte/ReporteMensual';
import { ChatWidget } from '@/components/chat/ChatWidget';

export default function SinglePageApp() {
  const dashboard = useDashboard();
  const reduceMotion = useReducedMotion() ?? false;
  const [monthFilter, setMonthFilter] = useState('');
  const [pendingConfirm, setPendingConfirm] = useState<ConfirmOptions | null>(null);

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
      <div className="flex min-h-screen items-center justify-center bg-[#090d16] p-6">
        <div className="glass-card flex flex-col items-center gap-4 rounded-3xl px-10 py-8">
          <motion.div
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="h-10 w-10 rounded-full border-4 border-[#3b82f6] border-t-transparent"
          />
          <p className="eyebrow neon-text">Cápi</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16] p-6">
        <div className="glass-card flex flex-col items-center gap-4 rounded-3xl px-10 py-9 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3b82f6] border-t-transparent motion-reduce:animate-none" />
          <p className="eyebrow neon-text">Cápi</p>
          <p className="text-sm text-gray-400">Sincronizando cuentas con Cápi...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#090d16] p-6 text-center text-white">
        <div className="glass-card flex max-w-md flex-col items-center gap-4 rounded-3xl px-8 py-10">
          <h2 className="text-2xl font-extrabold tracking-tight text-red-400">
            Error de conexión
          </h2>
          <p className="text-sm text-gray-400">
            No se pudo cargar el dashboard. Comprueba tu backend e inténtalo de nuevo.
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-2">
            Reintentar
          </button>
        </div>
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

      <main className="relative min-h-screen flex-1 overflow-y-auto px-4 pt-4 pb-[calc(9rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-6 md:pb-8 lg:px-8 lg:pt-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <AnimatePresence mode="wait" initial={false}>
            {/* TAB: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <motion.div
              key={currentTab}
              variants={tabSwap}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={reduceMotion ? { duration: 0 } : undefined}
            >
            <DashboardHeader
              userName={data.user.nombre}
              title="Resumen General"
              description="Monitoreo de flujo de caja en tiempo real."
              reduceMotion={reduceMotion}
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => openMovementModal('ingreso')}
                    className="btn-ghost flex-1 text-[#4ade80] sm:flex-none"
                  >
                    <PlusCircle size={18} /> Ingreso
                  </button>
                  <button
                    type="button"
                    onClick={() => openMovementModal('gasto')}
                    className="btn-danger flex-1 sm:flex-none"
                  >
                    <MinusCircle size={18} /> Gasto
                  </button>
                </>
              }
            />
            <SummaryCards summary={data.summary} />
            <DashboardInsights data={data} reduceMotion={reduceMotion} />
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
                  <h3 className="text-lg font-extrabold tracking-tight neon-text">
                    Últimos Movimientos
                  </h3>
                  <select
                    aria-label="Filtrar movimientos por mes"
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
          <motion.div
              key={currentTab}
              variants={tabSwap}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={reduceMotion ? { duration: 0 } : undefined}
            >
            <DashboardHeader
              userName={data.user.nombre}
              title={`Registro de ${currentTab === 'ingresos' ? 'Ingresos' : 'Gastos'}`}
              description="Historial completo detallado."
              reduceMotion={reduceMotion}
              actions={
                <>
                  <select
                    aria-label="Filtrar por mes"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="glass-soft min-w-44 bg-[#0a0e17] text-sm font-bold text-white border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3b82f6] [color-scheme:dark] cursor-pointer"
                  >
                    <option value="">Todos los meses</option>
                    {monthOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => openMovementModal(currentTab === 'ingresos' ? 'ingreso' : 'gasto')}
                    className={currentTab === 'ingresos' ? 'btn-primary' : 'btn-danger'}
                  >
                    <Plus size={18} /> Añadir {currentTab === 'ingresos' ? 'ingreso' : 'gasto'}
                  </button>
                </>
              }
            />
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
          <motion.div
              key={currentTab}
              variants={tabSwap}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={reduceMotion ? { duration: 0 } : undefined}
            >
            <DashboardHeader
              userName={data.user.nombre}
              title="Tus Metas de Ahorro"
              description="Define un horizonte para tus ahorros con acento esmeralda."
              reduceMotion={reduceMotion}
              actions={
                <button type="button" onClick={() => setIsGoalModalOpen(true)} className="btn-primary">
                  <Plus size={18} /> Definir Objetivo
                </button>
              }
            />

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
              onRequestConfirm={setPendingConfirm}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.metas.length === 0 ? (
                <div className="col-span-full border-2 border-dashed border-white/10 rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center text-gray-500 glass-soft">
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
                        type="button"
                        onClick={() =>
                          setPendingConfirm({
                            title: 'Confirmar abono',
                            description: `¿Quieres abonar ${formatCurrency(projectedAmount)} a la meta "${meta.nombre}"?`,
                            confirmLabel: 'Abonar',
                            onConfirm: async () => {
                              try {
                                await api.goals.update(token, meta.id, projectedAmount);
                                showFeedback(
                                  `¡Abono de ${formatCurrency(projectedAmount)} realizado!`,
                                );
                                await fetchData();
                              } catch (e) {
                                console.error(e);
                              }
                            },
                          })
                        }
                        className={`mt-3 w-full rounded-xl border py-2.5 text-sm font-bold uppercase tracking-wider transition-all shadow-md ${
                          projectedAmount > 0
                            ? 'btn-primary'
                            : 'cursor-not-allowed border-white/10 bg-[#0a0e17] text-gray-500'
                        }`}
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
        <motion.div
              key={currentTab}
              variants={tabSwap}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={reduceMotion ? { duration: 0 } : undefined}
            >
          <DashboardHeader
            userName={data.user.nombre}
            title="Manejo de Presupuestos"
            description="Control estricto de fuga de capital con analítica."
            reduceMotion={reduceMotion}
            actions={
              <button type="button" onClick={() => setIsBudgetModalOpen(true)} className="btn-primary">
                <Wallet size={18} /> Nuevo Límite Escudo
              </button>
            }
          />
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

      {/* TAB: REPORTE MENSUAL */}
      {currentTab === 'reporte' && (
        <motion.div
              key={currentTab}
              variants={tabSwap}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={reduceMotion ? { duration: 0 } : undefined}
            >
          <ReporteMensualTab onDeleted={fetchData} />
        </motion.div>
      )}
          </AnimatePresence>
        </div>
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
      <ConfirmDialog
        options={pendingConfirm}
        onClose={() => setPendingConfirm(null)}
        reduceMotion={reduceMotion}
      />
      <ChatWidget onDataChange={fetchData} />
    </div>
  );
}