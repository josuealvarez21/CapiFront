'use client';

import { LayoutDashboard, TrendingUp, TrendingDown, Target, Wallet, CalendarDays } from 'lucide-react';
import type { TabType } from '@/lib/types';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems: {
  id: TabType;
  label: string;
  icon: typeof LayoutDashboard;
  activeColor: string;
}[] = [
  { id: 'dashboard', label: 'Dash', icon: LayoutDashboard, activeColor: 'text-[#60a5fa]' },
  { id: 'ingresos', label: 'Ingresos', icon: TrendingUp, activeColor: 'text-[#4ade80]' },
  { id: 'gastos', label: 'Gastos', icon: TrendingDown, activeColor: 'text-red-400' },
  { id: 'metas', label: 'Metas', icon: Target, activeColor: 'text-[#4ade80]' },
  { id: 'presupuestos', label: 'Límites', icon: Wallet, activeColor: 'text-[#60a5fa]' },
  { id: 'reporte', label: 'Mes', icon: CalendarDays, activeColor: 'text-[#a78bfa]' },
];

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0e17]/90 backdrop-blur-xl border-t border-white/10 z-40 pb-safe">
      <div className="grid grid-cols-6 px-1 pt-2 pb-1.5">
        {navItems.map(({ id, label, icon: Icon, activeColor }) => {
          const isActive = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1 min-w-0 rounded-xl py-1.5 transition-all duration-300 active:scale-90 ${
                isActive ? `${activeColor} bg-white/5` : 'text-gray-500'
              }`}
            >
              <Icon
                size={21}
                className={`shrink-0 transition-transform ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              />
              <span className="w-full text-center text-[9px] sm:text-[10px] font-bold leading-tight truncate px-0.5">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}