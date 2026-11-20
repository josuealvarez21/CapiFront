'use client';

import { useRef, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  LayoutDashboard,
  MessageCircle,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { formatCurrency, getCategoryIcon } from '@/lib/utils';
import LandingLogo from '@/components/landing/LandingLogo';
import { floatAnimation } from '@/lib/motion';

interface DashboardMockupProps {
  reduceMotion: boolean;
}

const sidebarItems = [
  { label: 'Resumen', icon: LayoutDashboard, active: true },
  { label: 'Ingresos', icon: TrendingUp, active: false },
  { label: 'Gastos', icon: TrendingDown, active: false },
  { label: 'Metas', icon: Target, active: false },
  { label: 'Reporte', icon: CalendarDays, active: false },
];

const cards = [
  {
    label: 'Balance Total',
    value: 2350000,
    icon: Wallet,
    border: 'border-[#3b82f6]/40',
    chip: 'text-[#60a5fa] bg-[#3b82f6]/15 border-[#3b82f6]/30',
    bar: 'from-[#3b82f6] to-[#60a5fa]',
  },
  {
    label: 'Total Ingresos',
    value: 4200000,
    icon: TrendingUp,
    border: 'border-[#22c55e]/40',
    chip: 'text-[#4ade80] bg-[#22c55e]/15 border-[#22c55e]/30',
    bar: 'from-[#22c55e] to-[#4ade80]',
  },
  {
    label: 'Total Gastos',
    value: 1850000,
    icon: TrendingDown,
    border: 'border-red-500/40',
    chip: 'text-red-400 bg-red-500/15 border-red-500/30',
    bar: 'from-[#ef4444] to-[#f87171]',
  },
];

const movements = [
  { category: 'Salario', description: 'Nómina quincenal', amount: 1800000, income: true },
  { category: 'Comida', description: 'Mercado de la semana', amount: -185000, income: false },
  { category: 'Alquiler', description: 'Arriendo del mes', amount: -650000, income: false },
];

export default function DashboardMockup({ reduceMotion }: DashboardMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !containerRef.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      role="img"
      aria-label="Vista previa del panel de Cápi con resumen financiero, gráfico de ingresos y gastos y movimientos recientes"
    >
      <motion.div
        style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
      >
        <motion.div
          animate={floatAnimation(reduceMotion)}
          className="glass-card rounded-3xl border border-white/10 p-2 shadow-[0_30px_100px_-30px_rgba(0,0,0,0.9)] sm:p-3"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#0a0e17]/90">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/70" />
              <span className="ml-2 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                Cápi / Resumen general
              </span>
              <span className="ml-auto flex items-center gap-1.5 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-[#4ade80]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22c55e]" /> En vivo
              </span>
            </div>

            <div className="flex">
              <aside className="hidden w-40 shrink-0 border-r border-white/10 p-4 sm:block lg:w-48">
                <div className="mb-6">
                  <LandingLogo compact />
                </div>
                <div className="space-y-2">
                  {sidebarItems.map(({ label, icon: Icon, active }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[10px] font-bold ${
                        active
                          ? 'border border-[#3b82f6]/30 bg-[#3b82f6]/15 text-[#60a5fa]'
                          : 'text-gray-500'
                      }`}
                    >
                      <Icon size={13} aria-hidden="true" /> {label}
                    </div>
                  ))}
                </div>
              </aside>

              <div className="min-w-0 flex-1 p-3 sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-extrabold tracking-tight text-white sm:text-lg">
                      Resumen General
                    </p>
                    <p className="text-[9px] text-gray-500">
                      Monitoreo de flujo de caja en tiempo real.
                    </p>
                  </div>
                  <div className="hidden gap-2 sm:flex">
                    <span className="rounded-xl border border-[#22c55e]/30 bg-[#22c55e]/15 px-3 py-1.5 text-[9px] font-bold text-[#4ade80]">
                      + Ingreso
                    </span>
                    <span className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[9px] font-bold text-red-400">
                      − Gasto
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {cards.map(({ label, value, icon: Icon, border, chip, bar }) => (
                    <div key={label} className={`glass-card rounded-2xl border ${border} p-3`}>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                          {label}
                        </span>
                        <span className={`rounded-lg border p-1.5 ${chip}`}>
                          <Icon size={12} aria-hidden="true" />
                        </span>
                      </div>
                      <p className="truncate text-sm font-extrabold tracking-tight text-white sm:text-base">
                        {formatCurrency(value)}
                      </p>
                      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full w-2/3 rounded-full bg-gradient-to-r ${bar} opacity-80`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div className="glass-soft rounded-2xl border border-white/10 p-4">
                    <p className="mb-3 text-[10px] font-bold text-white">Ingresos vs Gastos</p>
                    <div className="flex items-center gap-5">
                      <div
                        className="relative h-24 w-24 shrink-0 rounded-full"
                        style={{
                          background: 'conic-gradient(#22c55e 0 69%, #ef4444 69% 100%)',
                        }}
                      >
                        <div className="absolute inset-[14px] flex items-center justify-center rounded-full bg-[#0a0e17]">
                          <span className="text-[10px] font-extrabold text-white">
                            {formatCurrency(2350000)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-gray-300">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" /> Ingresos 69%
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-gray-300">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" /> Gastos 31%
                        </div>
                        <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-[#60a5fa]">
                          Flujo mensual <ArrowRight size={10} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-soft rounded-2xl border border-white/10 p-4">
                    <p className="mb-3 text-[10px] font-bold text-white">Últimos Movimientos</p>
                    <div className="space-y-2.5">
                      {movements.map((movement) => (
                        <div key={movement.category} className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300">
                            {getCategoryIcon(movement.category, 13)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[10px] font-bold text-white">
                              {movement.category}
                            </span>
                            <span className="block truncate text-[8px] text-gray-500">
                              {movement.description}
                            </span>
                          </span>
                          <span
                            className={`text-[10px] font-extrabold ${
                              movement.income ? 'text-[#4ade80]' : 'text-red-400'
                            }`}
                          >
                            {movement.income ? '+' : '−'}
                            {formatCurrency(Math.abs(movement.amount))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#22c55e] text-white shadow-[0_0_30px_-6px_rgba(59,130,246,0.8)]"
              aria-hidden="true"
            >
              <MessageCircle size={18} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
