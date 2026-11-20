'use client';

import { motion } from 'framer-motion';
import { PiggyBank, ShieldAlert, Target, type LucideIcon } from 'lucide-react';
import type { DashboardData } from '@/lib/types';
import { fadeUp, stagger } from '@/lib/motion';

interface DashboardInsightsProps {
  data: DashboardData;
  reduceMotion: boolean;
}

interface InsightCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: 'blue' | 'green' | 'amber' | 'red';
  reduceMotion: boolean;
}

const toneStyles: Record<InsightCardProps['tone'], { chip: string; value: string }> = {
  blue: {
    chip: 'border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#60a5fa]',
    value: 'text-white',
  },
  green: {
    chip: 'border-[#22c55e]/30 bg-[#22c55e]/10 text-[#4ade80]',
    value: 'text-[#4ade80]',
  },
  amber: {
    chip: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    value: 'text-amber-400',
  },
  red: {
    chip: 'border-red-500/30 bg-red-500/10 text-red-400',
    value: 'text-red-400',
  },
};

function InsightCard({ label, value, detail, icon: Icon, tone, reduceMotion }: InsightCardProps) {
  const styles = toneStyles[tone];

  return (
    <motion.div
      variants={fadeUp}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className="glass-card rounded-2xl border border-white/10 p-4 transition-colors duration-300 hover:border-white/25"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="eyebrow text-gray-500">{label}</span>
        <span className={`rounded-xl border p-2 ${styles.chip}`}>
          <Icon size={16} aria-hidden="true" />
        </span>
      </div>
      <p className={`stat-value mt-3 text-2xl font-extrabold ${styles.value}`}>{value}</p>
      <p className="mt-1 truncate text-xs text-gray-500">{detail}</p>
    </motion.div>
  );
}

export default function DashboardInsights({ data, reduceMotion }: DashboardInsightsProps) {
  const ingresos = Number(data.summary.ingresos_mes) || 0;
  const gastos = Number(data.summary.gastos_mes) || 0;
  const tasaAhorro = ingresos > 0 ? ((ingresos - gastos) / ingresos) * 100 : 0;

  const presupuesto = [...data.presupuestos]
    .filter((p) => Number(p.limite) > 0)
    .sort((a, b) => Number(b.gastado) / Number(b.limite) - Number(a.gastado) / Number(a.limite))[0];
  const porcentajePresupuesto = presupuesto
    ? (Number(presupuesto.gastado) / Number(presupuesto.limite)) * 100
    : null;
  const tonoPresupuesto =
    porcentajePresupuesto === null
      ? 'blue'
      : porcentajePresupuesto >= 100
        ? 'red'
        : porcentajePresupuesto >= 80
          ? 'amber'
          : 'green';

  const meta = [...data.metas]
    .filter((m) => Number(m.monto_objetivo) > 0)
    .filter((m) => Number(m.ahorro_actual) < Number(m.monto_objetivo))
    .sort(
      (a, b) =>
        Number(b.ahorro_actual) / Number(b.monto_objetivo) -
        Number(a.ahorro_actual) / Number(a.monto_objetivo),
    )[0];
  const porcentajeMeta = meta
    ? (Number(meta.ahorro_actual) / Number(meta.monto_objetivo)) * 100
    : null;

  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="show"
      aria-label="Indicadores rápidos"
      className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <InsightCard
        label="Tasa de ahorro"
        value={`${tasaAhorro.toFixed(1)}%`}
        detail={ingresos > 0 ? 'De tus ingresos de este mes' : 'Sin ingresos registrados'}
        icon={PiggyBank}
        tone={tasaAhorro >= 0 ? 'green' : 'red'}
        reduceMotion={reduceMotion}
      />

      <InsightCard
        label="Presupuesto más apretado"
        value={porcentajePresupuesto === null ? '—' : `${porcentajePresupuesto.toFixed(0)}%`}
        detail={
          presupuesto
            ? `${presupuesto.categoria} · ${porcentajePresupuesto?.toFixed(0)}% consumido`
            : 'Aún no definiste límites'
        }
        icon={ShieldAlert}
        tone={tonoPresupuesto}
        reduceMotion={reduceMotion}
      />

      <InsightCard
        label="Meta más cercana"
        value={porcentajeMeta === null ? '—' : `${porcentajeMeta.toFixed(0)}%`}
        detail={meta ? meta.nombre : 'Todas tus metas están completas'}
        icon={Target}
        tone="blue"
        reduceMotion={reduceMotion}
      />
    </motion.section>
  );
}
