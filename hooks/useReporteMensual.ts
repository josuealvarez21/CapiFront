'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api, UnauthorizedError, type ReporteMensualCrudo } from '@/lib/api';
import type { ReporteMensual } from '@/lib/types';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const num = (v: string | number | null | undefined): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Convierte los Decimal (que llegan como string) a number para poder calcular. */
function normalizar(data: ReporteMensualCrudo): ReporteMensual {
  const { resumen } = data;

  return {
    periodo: {
      mes: data.periodo.mes,
      anio: data.periodo.anio,
      etiqueta: data.periodo.etiqueta,
    },
    resumen: {
      ingresos: num(resumen.ingresos),
      gastos: num(resumen.gastos),
      balance: num(resumen.balance),
      tasa_ahorro: num(resumen.tasa_ahorro),
      total_movimientos: resumen.total_movimientos ?? 0,
      mes_anterior: resumen.mes_anterior
        ? {
            ingresos: num(resumen.mes_anterior.ingresos),
            gastos: num(resumen.mes_anterior.gastos),
            balance: num(resumen.mes_anterior.balance),
          }
        : null,
      variacion: resumen.variacion
        ? {
            ingresos_pct:
              resumen.variacion.ingresos_pct === null ||
              resumen.variacion.ingresos_pct === undefined
                ? null
                : num(resumen.variacion.ingresos_pct),
            gastos_pct:
              resumen.variacion.gastos_pct === null ||
              resumen.variacion.gastos_pct === undefined
                ? null
                : num(resumen.variacion.gastos_pct),
            balance_pct:
              resumen.variacion.balance_pct === null ||
              resumen.variacion.balance_pct === undefined
                ? null
                : num(resumen.variacion.balance_pct),
          }
        : null,
    },
    categorias: data.categorias.map((c) => ({
      nombre: c.nombre,
      tipo: c.tipo,
      ingresos: num(c.ingresos),
      gastos: num(c.gastos),
      balance: num(c.balance),
      movimientos: c.movimientos ?? 0,
      peso_pct: num(c.peso_pct),
      color: c.color,
    })),
    movimientos: data.movimientos.map((m) => ({
      id: m.id,
      descripcion: m.descripcion ?? '',
      monto: num(m.monto),
      tipo: m.tipo,
      categoria: m.categoria,
      fecha: m.fecha,
    })),
  };
}

export function useReporteMensual() {
  const { token, logout, loading: authLoading } = useAuth();

  const [data, setData] = useState<ReporteMensual | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mes, setMes] = useState(() => new Date().getMonth() + 1);
  const [anio, setAnio] = useState(() => new Date().getFullYear());
  const [aniosDisponibles, setAniosDisponibles] = useState<number[]>([]);

  const fetchReporte = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setData(normalizar(await api.reportes.mensual(token, mes, anio)));
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        logout();
        return;
      }
      setError(
        e instanceof Error ? e.message : 'Error desconocido al cargar el reporte.',
      );
    } finally {
      setLoading(false);
    }
  }, [token, mes, anio, logout]);

  const fetchAnios = useCallback(async () => {
    if (!token) return;
    try {
      const { meses } = await api.reportes.mesesConDatos(token);
      const anios = [...new Set(meses.map((m) => m.anio))];
      const actual = new Date().getFullYear();
      setAniosDisponibles(
        [...new Set([...anios, actual])].sort((a, b) => b - a),
      );
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        logout();
        return;
      }
      // No es crítico: el selector cae al año actual.
      setAniosDisponibles([new Date().getFullYear()]);
    }
  }, [token, logout]);

  useEffect(() => {
    if (!authLoading && token) {
      fetchAnios();
    }
  }, [authLoading, token, fetchAnios]);

  useEffect(() => {
    if (!authLoading && token) {
      fetchReporte();
    }
  }, [authLoading, token, fetchReporte]);

  const etiquetaPeriodo = useMemo(
    () => `${MESES[mes - 1]} ${anio}`,
    [mes, anio],
  );

  const etiquetaMesAnterior = useMemo(() => {
    const { m, a } =
      mes === 1 ? { m: 12, a: anio - 1 } : { m: mes - 1, a: anio };
    return `${MESES[m - 1]} ${a}`;
  }, [mes, anio]);

  return {
    data,
    loading: loading || authLoading,
    error,
    mes,
    anio,
    setMes,
    setAnio,
    aniosDisponibles,
    refetch: fetchReporte,
    etiquetaPeriodo,
    etiquetaMesAnterior,
  };
}