'use client';

import { useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  CalendarDays,
  CheckCircle2,
  RotateCcw,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { fadeUp, tabSwap, viewportOnce } from '@/lib/motion';
import ChatPanel from './demo/ChatPanel';
import GoalsPanel from './demo/GoalsPanel';
import ReportPanel from './demo/ReportPanel';
import { useDemoState } from './demo/useDemoState';

interface InteractiveDemoProps {
  reduceMotion: boolean;
}

type DemoTab = 'metas' | 'reporte' | 'chat';

const tabs: { id: DemoTab; label: string; icon: LucideIcon }[] = [
  { id: 'metas', label: 'Metas', icon: Target },
  { id: 'reporte', label: 'Reporte', icon: CalendarDays },
  { id: 'chat', label: 'CapiBot', icon: Bot },
];

export default function InteractiveDemo({ reduceMotion }: InteractiveDemoProps) {
  const [active, setActive] = useState<DemoTab>('metas');
  const demo = useDemoState({ reduceMotion });

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    document.getElementById(`demo-tab-${tabs[next].id}`)?.focus();
  };

  return (
    <section id="demo" className="scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[11px] font-black uppercase tracking-[2px] text-[#a78bfa]">
            Demo interactiva
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight neon-text sm:text-5xl">
            Míralo en acción.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400 sm:text-base">
            Es una mini-app de verdad: aboná a una meta, cambiá de mes o pedile algo al bot. Todo
            se actualiza junto.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div
            role="tablist"
            aria-label="Módulos de Cápi"
            className="flex w-fit gap-1 rounded-full border border-white/10 bg-white/5 p-1"
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              const activeStyle =
                tab.id === 'metas'
                  ? 'bg-[#22c55e]/15 text-[#4ade80] ring-1 ring-inset ring-[#22c55e]/40'
                  : tab.id === 'reporte'
                    ? 'bg-[#8b5cf6]/15 text-[#a78bfa] ring-1 ring-inset ring-[#8b5cf6]/40'
                    : 'bg-[#3b82f6]/15 text-[#60a5fa] ring-1 ring-inset ring-[#3b82f6]/40';
              return (
                <button
                  key={tab.id}
                  id={`demo-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`demo-panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(tab.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-colors sm:px-4 ${
                    isActive ? activeStyle : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={14} aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={demo.reset}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold text-gray-400 transition-colors hover:border-white/25 hover:text-white"
          >
            <RotateCcw size={13} aria-hidden="true" />
            Reiniciar demo
          </button>
        </div>

        <div className="glass-card relative mt-8 rounded-3xl border border-white/10 p-5 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              id={`demo-panel-${active}`}
              role="tabpanel"
              aria-labelledby={`demo-tab-${active}`}
              variants={tabSwap}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={reduceMotion ? { duration: 0 } : undefined}
              className="min-h-[340px]"
            >
              {active === 'metas' && (
                <GoalsPanel
                  goals={demo.goals}
                  balance={demo.stats.balance}
                  onAllocate={demo.allocate}
                  reduceMotion={reduceMotion}
                />
              )}
              {active === 'reporte' && (
                <ReportPanel
                  movimientos={demo.movimientos}
                  selectedMonth={demo.selectedMonth}
                  onSelectMonth={demo.selectMonth}
                  stats={demo.stats}
                  ingresosPorCategoria={demo.ingresosPorCategoria}
                  gastosPorCategoria={demo.gastosPorCategoria}
                  variacionIngresos={demo.variacionIngresos}
                  variacionGastos={demo.variacionGastos}
                  reduceMotion={reduceMotion}
                />
              )}
              {active === 'chat' && (
                <ChatPanel
                  messages={demo.chat}
                  pending={demo.pendingConfirmation}
                  typing={demo.typing}
                  onSend={demo.sendMessage}
                  onConfirm={demo.confirmPending}
                  onCancel={demo.cancelPending}
                  reduceMotion={reduceMotion}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {demo.toast && (
          <motion.div
            key={demo.toast}
            role="status"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
            transition={reduceMotion ? { duration: 0 } : undefined}
            className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#22c55e]/40 bg-[#0d1420]/95 px-5 py-3 text-xs font-bold text-white shadow-[0_0_40px_-10px_rgba(34,197,94,0.7)] backdrop-blur"
          >
            <CheckCircle2 size={16} className="text-[#4ade80]" aria-hidden="true" />
            {demo.toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
