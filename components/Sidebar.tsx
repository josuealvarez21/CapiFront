'use client';

import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Target,
  Wallet,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import Image from 'next/image';
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
    activeColor: 'bg-[#3b82f6] bg-opacity-30',
    shadowColor: 'shadow-blue-500/10',
  },
  {
    id: 'ingresos',
    label: 'Ingresos',
    icon: TrendingUp,
    activeColor: 'bg-[#22c55e] bg-opacity-30',
    shadowColor: 'shadow-green-500/10',
  },
  {
    id: 'gastos',
    label: 'Gastos',
    icon: TrendingDown,
    activeColor: 'bg-[#ef4444] bg-opacity-30',
    shadowColor: 'shadow-red-500/10',
  },
  {
    id: 'metas',
    label: 'Metas',
    icon: Target,
    activeColor: 'bg-[#f59e0b] bg-opacity-30',
    shadowColor: 'shadow-yellow-500/10',
  },
  {
    id: 'presupuestos',
    label: 'Presupuestos',
    icon: Wallet,
    activeColor: 'bg-[#8b5cf6] bg-opacity-30',
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
  return (
    <aside className="w-64 bg-[#1e1e1e] border-r border-[#2e2e2e] flex flex-col justify-between hidden md:flex z-10 sticky top-0 h-screen shadow-2xl">
      <div>
        <div className="p-6 pb-4">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#22c55e]">
            Cápi
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">
            Hub Financiero
          </p>
        </div>

        <div className="px-6 pb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#22c55e] p-[2px] shadow-lg shrink-0">
            <Image
              src={
                user.foto_perfil ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre)}&background=121212&color=fff`
              }
              alt="Profile"
              width={48}
              height={48}
              unoptimized
              className="w-full h-full rounded-full object-cover border-2 border-[#1e1e1e]"
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm truncate">{user.nombre}</p>
            <p className="text-xs text-[#22c55e] font-semibold">Cápi Pro</p>
          </div>
        </div>

        <nav className="px-4 space-y-2 relative">
          {navItems.map(({ id, label, icon: Icon, activeColor, shadowColor }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all duration-300 ${
                currentTab === id
                  ? `${activeColor} text-white shadow-lg ${shadowColor}`
                  : 'text-gray-400 hover:bg-[#2e2e2e] hover:text-white'
              }`}
            >
              <Icon size={22} /> {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 space-y-2 mb-4">
        {rol === 'admin' && (
          <button
            onClick={() => router.push('/admin')}
            className="w-full flex items-center gap-4 px-5 py-4 text-purple-400 hover:bg-purple-500/10 rounded-xl font-medium transition-colors"
          >
            <Shield size={22} /> Admin Panel
          </button>
        )}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-4 px-5 py-4 text-gray-500 hover:bg-[#2e2e2e] hover:text-white rounded-xl font-medium transition-colors"
        >
          <Settings size={22} /> Ajustes
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-500/10 rounded-xl font-black transition-colors"
        >
          <LogOut size={22} /> Salir de Cápi
        </button>
      </div>
    </aside>
  );
}
