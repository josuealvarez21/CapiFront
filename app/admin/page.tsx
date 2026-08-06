'use client';

import { useEffect, useState } from 'react';
import { Users, Shield, Star, UserPlus, TrendingUp, UserCheck, type LucideIcon } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type { AdminStats } from '@/lib/types';

function StatsCard({
  icon: Icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-2xl p-4 min-h-[30px] flex flex-col justify-center shadow-lg hover:border-purple-500/30 transition-all">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-white">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1 font-medium">{subtitle}</p>}
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

  // Format date for chart (ej. "28 Jul")
  const chartData = (stats.registro_por_fecha || []).map((item) => {
    const parts = item.fecha.split('-');
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const formattedDate = parts.length === 3 ? `${parseInt(parts[2], 10)} ${monthNames[parseInt(parts[1], 10) - 1]}` : item.fecha;
    return {
      fecha: formattedDate,
      usuarios: item.usuarios,
    };
  });

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">
          Panel de Administración
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Métricas clave de usuarios y gráfico de registro de la plataforma
        </p>
      </header>

      {/* Tarjetas Indicadoras Clave */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          label="Total de Usuarios"
          value={stats.total_usuarios}
          color="bg-blue-600"
          subtitle="Registrados en la plataforma"
        />
        <StatsCard
          icon={UserPlus}
          label="Nuevos (Últimos 7 días)"
          value={stats.nuevos_usuarios_7d}
          color="bg-emerald-600"
          subtitle="Crecimiento semanal"
        />
        <StatsCard
          icon={TrendingUp}
          label="Nuevos (Últimos 30 días)"
          value={stats.nuevos_usuarios_30d}
          color="bg-purple-600"
          subtitle="Crecimiento mensual"
        />
        <StatsCard
          icon={Shield}
          label="Administradores"
          value={stats.usuarios_admin}
          color="bg-amber-600"
          subtitle="Cuentas con privilegios"
        />
      </div>

      {/* Desglose de Planes y Gráfico de Registro */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Gráfico de Crecimiento de Usuarios (Recharts) */}
        <div className="lg:col-span-2 bg-[#1e1e1e] border border-[#2e2e2e] rounded-3xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-white">Crecimiento de Nuevos Usuarios</h3>
              <p className="text-xs text-gray-400">Registros por día en los últimos 14 días</p>
            </div>
            <div className="p-1.5 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-lg font-medium text-xs border border-[#8b5cf6]/20">
              En tiempo real
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" vertical={false} />
                <XAxis dataKey="fecha" stroke="#6b7280" tickLine={false} fontSize={12} />
                <YAxis stroke="#6b7280" tickLine={false} fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121212',
                    borderColor: '#2e2e2e',
                    borderRadius: '16px',
                    color: '#ffffff',
                    fontSize: '13px',
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#8b5cf6' }}
                />
                <Area
                  type="monotone"
                  dataKey="usuarios"
                  name="Nuevos Usuarios"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#userGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resumen por Plan de Pago / Rol */}
        <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-3xl p-4 sm:p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Distribución de Planes</h3>
            <p className="text-xs text-gray-400 mb-4">Desglose de usuarios según su membresía</p>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#121212] border border-[#2e2e2e] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Plan Gratuito</p>
                    <p className="text-xs text-gray-500">Acceso estándar</p>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-white">{stats.usuarios_gratuito}</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#121212] border border-[#2e2e2e] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Cápi Pro</p>
                    <p className="text-xs text-gray-500">Funciones avanzadas</p>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-white">{stats.usuarios_premium}</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#121212] border border-[#2e2e2e] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Administradores</p>
                    <p className="text-xs text-gray-500">Gestores del sistema</p>
                  </div>
                </div>
                <span className="text-xl font-extrabold text-white">{stats.usuarios_admin}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
