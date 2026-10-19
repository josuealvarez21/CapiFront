'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { MESES_ES } from '@/lib/utils';
import { useReporteMensual } from '@/hooks/useReporteMensual';
import MovementsList from '@/components/MovementsList';
import { ResumenMes } from './ResumenMes';
import { TablaComparativa } from './TablaComparativa';
import { ComparativaMesAnterior } from './ComparativaMesAnterior';

const selectClass =
  'glass-soft bg-[#0a0e17] text-xs font-bold text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#3b82f6] [color-scheme:dark] cursor-pointer';

export function ReporteMensualTab({ onDeleted }: { onDeleted: () => void }) {
  const { token } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    data,
    loading,
    error,
    mes,
    anio,
    setMes,
    setAnio,
    aniosDisponibles,
    refetch,
  } = useReporteMensual();

  const aniosSelector = aniosDisponibles.length
    ? aniosDisponibles
    : [new Date().getFullYear()];

  const etiquetaPeriodo = data ? data.periodo.etiqueta : `${MESES_ES[mes - 1]} ${anio}`;

  const handleDelete = useCallback(
    async (id: string) => {
      if (!token) return;
      if (!confirm('¿Estás seguro de eliminar este movimiento?')) return;
      setDeletingId(id);
      try {
        await api.movements.delete(token, id);
        await refetch();
        onDeleted();
      } catch {
        alert('No se pudo eliminar el movimiento.');
      } finally {
        setDeletingId(null);
      }
    },
    [token, refetch, onDeleted],
  );

  const ingresosCount = data
    ? data.movimientos.filter((m) => m.tipo === 'ingreso').length
    : 0;
  const gastosCount = data
    ? data.movimientos.filter((m) => m.tipo === 'gasto').length
    : 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">
              Reporte Mensual
            </h2>
            <p className="text-gray-400 text-sm">
              Ingresos, gastos y balance de {etiquetaPeriodo}.
            </p>
          </div>

          <div className="flex flex-row w-full sm:w-auto gap-2 items-center">
            <CalendarDays size={16} className="text-gray-500 shrink-0" />

            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              className={`${selectClass} flex-1 sm:flex-none`}
              aria-label="Mes"
            >
              {MESES_ES.map((nombre, i) => (
                <option key={nombre} value={i + 1}>
                  {nombre}
                </option>
              ))}
            </select>

            <select
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className={`${selectClass} flex-1 sm:flex-none`}
              aria-label="Año"
            >
              {aniosSelector.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            <button
              onClick={() => refetch()}
              disabled={loading}
              title="Actualizar"
              className="p-2.5 rounded-xl glass-soft border border-white/10 text-gray-400 hover:text-white hover:border-[#3b82f6]/50 transition-all duration-300 disabled:opacity-50 shrink-0"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="glass-card rounded-3xl p-5">
            <div className="py-16 text-center">
              <p className="text-xl text-red-400 font-bold mb-2">
                No se pudo cargar el reporte.
              </p>
              <p className="text-sm text-gray-500 mb-6">{error}</p>
              <button
                onClick={() => refetch()}
                className="bg-[#3b82f6] hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Carga inicial */}
        {!error && loading && !data && (
          <div className="py-24 flex flex-col items-center justify-center text-gray-500">
            <div className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm mt-4">
              Calculando el reporte de {etiquetaPeriodo}…
            </p>
          </div>
        )}

        {/* Contenido */}
        {data && (
          <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <ResumenMes resumen={data.resumen} periodo={data.periodo} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Movimientos del mes */}
              <section className="glass-card rounded-3xl p-5">
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <h3 className="text-lg font-bold text-white">Movimientos del Mes</h3>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 glass-soft px-3 py-1.5 rounded-full">
                      <TrendingUp size={13} className="text-[#4ade80]" />
                      <span className="text-xs font-bold text-gray-300">
                        {ingresosCount} ingresos
                      </span>
                    </span>
                    <span className="flex items-center gap-1 glass-soft px-3 py-1.5 rounded-full">
                      <TrendingDown size={13} className="text-red-400" />
                      <span className="text-xs font-bold text-gray-300">
                        {gastosCount} gastos
                      </span>
                    </span>
                  </div>
                </div>

                <MovementsList
                  variant="full"
                  movements={data.movimientos}
                  onDelete={handleDelete}
                  emptyIcon={<TrendingUp size={64} className="opacity-20 mb-4" />}
                  emptyMessage={`Sin movimientos en ${etiquetaPeriodo}.`}
                />

                {deletingId && (
                  <p className="text-center text-xs text-gray-500 mt-3">Eliminando…</p>
                )}
              </section>

              <ComparativaMesAnterior resumen={data.resumen} periodo={data.periodo} />
            </div>

            <div className="mt-4">
              <TablaComparativa
                categorias={data.categorias}
                totalMovimientos={data.resumen.total_movimientos}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}