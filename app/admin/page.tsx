'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Activity, ShieldCheck, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type { AdminStats } from '@/lib/types';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  gradient: string;
}

function StatsCard({ icon: Icon, label, value, gradient }: StatsCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
      }}
      className="glass-card relative overflow-hidden rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#3b82f6]/40 sm:p-6"
    >
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${gradient} opacity-80`} />
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 sm:text-sm">{label}</p>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-[0_8px_24px_-10px_rgba(59,130,246,0.9)]`}>
          <Icon size={21} className="text-white" />
        </div>
      </div>
      <p className="stat-value text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{value}</p>
    </motion.div>
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass-card flex flex-col items-center gap-4 rounded-3xl px-10 py-8">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3b82f6] border-t-transparent motion-reduce:animate-none" />
          <p className="eyebrow neon-text">Cápi Admin</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="glass-card flex max-w-md flex-col items-center gap-3 rounded-3xl px-8 py-10 text-center">
          <p className="text-xl font-extrabold text-red-400">Error al cargar estadísticas</p>
          <p className="text-sm text-gray-400">Comprueba la conexión con el backend e inténtalo de nuevo.</p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-2">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      initial="hidden"
      animate="show"
    >
      <motion.header
        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
        className="mb-7"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full glass-soft px-3 py-1.5">
          <ShieldCheck size={13} className="text-[#22c55e]" />
          <span className="eyebrow text-gray-400">Acceso de administrador</span>
        </div>
        <h2 className="neon-text text-3xl font-black tracking-tight sm:text-4xl">
          Panel de Administración
        </h2>
        <p className="mt-2 text-sm text-gray-400 sm:text-base">
          Resumen general del sistema Cápi
        </p>
      </motion.header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <StatsCard
          icon={Users}
          label="Usuarios Totales"
          value={stats.total_usuarios}
          gradient="from-[#3b82f6] to-[#60a5fa]"
        />
        <StatsCard
          icon={Shield}
          label="Administradores"
          value={stats.usuarios_admin}
          gradient="from-[#22c55e] to-[#4ade80]"
        />
        <StatsCard
          icon={Activity}
          label="Movimientos"
          value={stats.total_movimientos}
          gradient="from-[#8b5cf6] to-[#3b82f6]"
        />
      </div>
    </motion.div>
  );
}
