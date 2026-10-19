'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Target,
  Wallet,
  Settings,
  LogOut,
  Shield,
  CalendarDays,
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { TabType, UserData } from '@/lib/types';

interface SidebarProps {
  user: UserData;
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

const navItems: {
  id: TabType;
  label: string;
  icon: typeof LayoutDashboard;
  activeColor: string;
  shadowColor: string;
}[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    activeColor: 'bg-[#3b82f6]/20 text-[#60a5fa] border-[#3b82f6]/30',
    shadowColor: 'shadow-blue-500/10',
  },
  {
    id: 'ingresos',
    label: 'Ingresos',
    icon: TrendingUp,
    activeColor: 'bg-[#22c55e]/20 text-[#4ade80] border-[#22c55e]/30',
    shadowColor: 'shadow-green-500/10',
  },
  {
    id: 'gastos',
    label: 'Gastos',
    icon: TrendingDown,
    activeColor: 'bg-red-500/15 text-red-300 border-red-500/30',
    shadowColor: 'shadow-red-500/10',
  },
  {
    id: 'metas',
    label: 'Metas',
    icon: Target,
    activeColor: 'bg-[#22c55e]/20 text-[#4ade80] border-[#22c55e]/30',
    shadowColor: 'shadow-green-500/10',
  },
  {
    id: 'presupuestos',
    label: 'Presupuestos',
    icon: Wallet,
    activeColor: 'bg-[#3b82f6]/20 text-[#60a5fa] border-[#3b82f6]/30',
    shadowColor: 'shadow-blue-500/10',
  },
  {
    id: 'reporte',
    label: 'Reporte Mensual',
    icon: CalendarDays,
    activeColor: 'bg-[#8b5cf6]/20 text-[#a78bfa] border-[#8b5cf6]/30',
    shadowColor: 'shadow-purple-500/10',
  },
];

export default function Sidebar({
  user,
  currentTab,
  onTabChange,
  onOpenSettings,
  onLogout,
}: SidebarProps) {
  const { rol } = useAuth();
  const router = useRouter();
  const [avatarError, setAvatarError] = useState(false);
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre)}&background=121212&color=fff`;
  const avatarSrc = avatarError || !user.foto_perfil ? fallbackUrl : user.foto_perfil;
  return (
    <aside className="w-60 lg:w-64 glass-soft border-r border-white/10 hidden md:flex flex-col z-10 sticky top-0 h-screen shadow-2xl">
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="p-5 pb-3">
          <h1 className="text-2xl lg:text-3xl font-extrabold neon-text">Cápi</h1>
          <p className="text-[10px] lg:text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">
            Hub Financiero
          </p>
        </div>

        <div className="px-5 pb-4 flex items-center gap-3">
          <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#22c55e] p-[2px] shadow-lg shrink-0">
            <img
              src={avatarSrc}
              alt="Profile"
              width={48}
              height={48}
              onError={() => setAvatarError(true)}
              className="w-full h-full rounded-full object-cover border-2 border-[#0a0e17]"
            />
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-white font-bold text-sm truncate">{user.nombre}</p>
            <p className="text-[10px] lg:text-xs text-[#22c55e] font-semibold">Cápi Pro</p>
          </div>
        </div>

        <nav className="px-3 pb-3 space-y-1.5 relative">
          {navItems.map(({ id, label, icon: Icon, activeColor, shadowColor }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 lg:py-3 rounded-xl font-medium text-sm lg:text-base transition-all duration-300 ${
                currentTab === id
                  ? `${activeColor} border shadow-lg ${shadowColor}`
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="shrink-0 p-3 space-y-1.5 border-t border-white/10 bg-[#0a0e17]/40 backdrop-blur-xl">
        {rol === 'admin' && (
          <button
            onClick={() => router.push('/admin')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-xl font-medium text-sm transition-colors"
          >
            <Shield size={18} className="shrink-0" />
            <span className="truncate">Admin Panel</span>
          </button>
        )}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-white/5 hover:text-white rounded-xl font-medium text-sm transition-colors"
        >
          <Settings size={18} className="shrink-0" />
          <span className="truncate">Ajustes</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl font-bold text-sm transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="truncate">Salir de Cápi</span>
        </button>
      </div>
    </aside>
  );
}
