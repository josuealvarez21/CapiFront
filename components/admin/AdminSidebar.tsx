'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, ArrowLeft } from 'lucide-react';
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
    <aside className="w-64 bg-[#1e1e1e] border-r border-[#2e2e2e] flex flex-col justify-between hidden md:flex z-10 sticky top-0 h-screen shadow-2xl">
      <div>
        <div className="p-6 pb-4">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]">
            Admin
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">
            Panel de Control
          </p>
        </div>

        <nav className="px-4 space-y-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => router.push(id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all duration-300 ${
                pathname === id
                  ? 'bg-[#8b5cf6] bg-opacity-30 text-white shadow-lg shadow-purple-500/10'
                  : 'text-gray-400 hover:bg-[#2e2e2e] hover:text-white'
              }`}
            >
              <Icon size={22} /> {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 space-y-2 mb-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-500/10 rounded-xl font-black transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
