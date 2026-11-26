'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { api, UnauthorizedError, type EvolucionAhorroCrudo } from '@/lib/api';
import type { EvolucionAhorro } from '@/lib/types';

const num = (value: string | number | null | undefined): number => {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
};

function normalizar(data: EvolucionAhorroCrudo): EvolucionAhorro {
  return {
    meses: data.meses.map((mes) => ({
      mes: mes.mes,
      anio: mes.anio,
      etiqueta: mes.etiqueta,
      ingresos: num(mes.ingresos),
      gastos: num(mes.gastos),
      balance: num(mes.balance),
      tasa_ahorro: num(mes.tasa_ahorro),
    })),
    promedio_ahorro: num(data.promedio_ahorro),
    tendencia_balance_pct:
      data.tendencia_balance_pct === null || data.tendencia_balance_pct === undefined
        ? null
        : num(data.tendencia_balance_pct),
  };
}

export function useEvolucionAhorro() {
  const { token, logout } = useAuth();

  const consulta = useQuery({
    queryKey: ['evolucion-ahorro', token],
    queryFn: async () => {
      if (!token) throw new Error('No token');
      try {
        return normalizar(await api.reportes.evolucionAhorro(token));
      } catch (error) {
        if (error instanceof UnauthorizedError) logout();
        throw error;
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    data: consulta.data ?? null,
    loading: consulta.isFetching,
    error: consulta.error ? 'No se pudo cargar la evolución del ahorro.' : null,
    refetch: consulta.refetch,
  };
}
