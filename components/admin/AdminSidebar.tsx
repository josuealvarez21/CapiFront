'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, ArrowLeft, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { id: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { id: '/admin/users', label: 'Usuarios', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <>
      {/* Barra superior en móvil: el sidebar desktop se oculta */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#090d16]/85 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <span className="neon-text text-2xl font-black leading-none">C</span>
          <span className="eyebrow text-gray-300">Admin</span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => router.push(id)}
              aria-label={label}
              className={`rounded-xl p-2 transition-colors ${
                pathname === id
                  ? 'bg-[#3b82f6]/20 text-[#60a5fa] ring-1 ring-inset ring-[#3b82f6]/30'
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={19} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => router.push('/app')}
            aria-label="Volver a Cápi"
            className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={19} />
          </button>
          <button
            type="button"
            onClick={logout}
            aria-label="Cerrar sesión"
            className="rounded-xl p-2 text-red-400 transition-colors hover:bg-red-500/10"
          >
            <LogOut size={19} />
          </button>
        </div>
      </div>

      <aside className="sticky top-0 z-10 hidden h-screen w-64 flex-col justify-between border-r border-white/10 bg-[#0a0e17]/85 backdrop-blur-xl md:flex">
        <div>
          <div className="border-b border-white/10 px-6 pb-5 pt-6">
            <div className="flex items-center gap-2.5">
              <span className="neon-text text-3xl font-black leading-none">C</span>
              <div>
                <p className="text-xl font-extrabold tracking-tight text-white">Admin</p>
                <p className="eyebrow mt-0.5 text-gray-500">Panel de Control</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2 px-4 py-5">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => router.push(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                  pathname === id
                    ? 'bg-gradient-to-r from-[#3b82f6]/20 to-[#22c55e]/10 text-white ring-1 ring-inset ring-[#3b82f6]/30 shadow-[0_8px_24px_-12px_rgba(59,130,246,0.8)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} /> {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-2 border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-2 rounded-xl glass-soft px-3 py-2.5">
            <ShieldCheck size={15} className="shrink-0 text-[#22c55e]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Acceso restringido
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push('/app')}
            className="btn-ghost flex w-full items-center gap-3"
          >
            <ArrowLeft size={18} /> Volver a Cápi
          </button>
          <button
            type="button"
            onClick={logout}
            className="btn-danger flex w-full items-center gap-3"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
