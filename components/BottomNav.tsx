'use client';

import { LayoutDashboard, TrendingUp, TrendingDown, Target, Wallet } from 'lucide-react';
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
  { id: 'dashboard', label: 'Dash', icon: LayoutDashboard, activeColor: 'text-[#3b82f6]' },
  { id: 'ingresos', label: 'Ingresos', icon: TrendingUp, activeColor: 'text-[#22c55e]' },
  { id: 'gastos', label: 'Gastos', icon: TrendingDown, activeColor: 'text-[#ef4444]' },
  { id: 'metas', label: 'Metas', icon: Target, activeColor: 'text-[#f59e0b]' },
  { id: 'presupuestos', label: 'Límites', icon: Wallet, activeColor: 'text-[#8b5cf6]' },
];

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-md border-t border-[#2e2e2e] z-40 pb-safe">
      <div className="flex justify-around items-center px-2 py-3">
        {navItems.map(({ id, label, icon: Icon, activeColor }) => {
          const isActive = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${
                isActive ? activeColor : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon
                size={24}
                className={`mb-1 transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}
              />
              <span className="text-[10px] font-bold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
