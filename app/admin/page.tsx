'use client';

import { useEffect, useState } from 'react';
import { Users, Shield, Activity, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type { AdminStats } from '@/lib/types';

function StatsCard({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-2xl p-6 shadow-xl hover:border-purple-500/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-white">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.admin.getStats(token).then(setStats).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-red-400 text-center mt-20">Error al cargar estadísticas</p>;
  }

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
          Panel de Administración
        </h2>
        <p className="text-gray-400 text-sm sm:text-lg">
          Resumen general del sistema Cápi
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard icon={Users} label="Usuarios Totales" value={stats.total_usuarios} color="bg-blue-600" />
        <StatsCard icon={Shield} label="Administradores" value={stats.usuarios_admin} color="bg-purple-600" />
        <StatsCard icon={Activity} label="Movimientos" value={stats.total_movimientos} color="bg-yellow-600" />
      </div>
    </div>
  );
}
