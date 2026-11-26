'use client';

import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api, UnauthorizedError } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import type { AporteMeta, Meta } from '@/lib/types';
import Modal from './Modal';

interface HistorialAportesModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: Meta;
}

export default function HistorialAportesModal({
  isOpen,
  onClose,
  meta,
}: HistorialAportesModalProps) {
  const { token, logout } = useAuth();

  const consulta = useQuery({
    queryKey: ['goal-contributions', token, meta.id],
    queryFn: async () => {
      if (!token) throw new Error('No token');
      try {
        const respuesta = await api.goals.listContributions(token, meta.id);
        const items: AporteMeta[] = respuesta.items.map((aporte) => ({
          id_meta: aporte.id_meta,
          monto: Number(aporte.monto),
          fecha_hora: aporte.fecha_hora,
          origen: aporte.origen,
          descripcion: aporte.descripcion,
        }));
        return { items, total: respuesta.total };
      } catch (error) {
        if (error instanceof UnauthorizedError) logout();
        throw error;
      }
    },
    enabled: !!token && isOpen,
    staleTime: 1000 * 30,
    retry: 1,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Historial de ${meta.nombre}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-xs text-gray-400">
          {consulta.data ? `${consulta.data.total} aportes registrados` : 'Consultando aportes…'}
        </p>
        <button
          type="button"
          onClick={() => void consulta.refetch()}
          disabled={consulta.isFetching}
          aria-label="Actualizar historial"
          className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:text-white hover:border-[#3b82f6]/50 disabled:opacity-50"
        >
          <RefreshCw size={15} className={consulta.isFetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {consulta.isError && (
        <p role="alert" className="text-sm font-bold text-red-400">
          No se pudo cargar el historial de aportes.
        </p>
      )}

      {consulta.isLoading && (
        <p className="py-10 text-center text-sm text-gray-500">Cargando historial…</p>
      )}

      {consulta.data && consulta.data.items.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-500">
          Aún no hay aportes registrados en esta meta.
        </p>
      )}

      {consulta.data && consulta.data.items.length > 0 && (
        <ul className="space-y-2">
          {consulta.data.items.map((aporte, indice) => (
            <li
              key={`${aporte.fecha_hora}-${indice}`}
              className="glass-soft flex items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">
                  {formatCurrency(aporte.monto)}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {new Date(aporte.fecha_hora).toLocaleString('es-CO', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                  {aporte.descripcion ? ` · ${aporte.descripcion}` : ''}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#22c55e]/15 px-2 py-1 text-[10px] font-bold uppercase text-[#4ade80] border border-[#22c55e]/25">
                {aporte.origen}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
