import type { Meta, SavingsDistributionMode } from './types';

export interface SavingsAllocation {
  id_meta: number;
  monto: number;
}

function getEqualAllocations(
  totalToDistribute: number,
  metas: Meta[],
  selectedGoalIds: string[],
): SavingsAllocation[] {
  const selected = metas.filter(
    (m) => selectedGoalIds.includes(m.id) && m.ahorro_actual < m.monto_objetivo,
  );
  if (selected.length === 0) return [];

  const allocations = new Map<string, number>();
  let remaining = totalToDistribute;
  let pending = selected;

  while (remaining > 0 && pending.length > 0) {
    const share = remaining / pending.length;
    const stillPending: Meta[] = [];

    for (const meta of pending) {
      const current = allocations.get(meta.id) ?? 0;
      const room = meta.monto_objetivo - meta.ahorro_actual - current;
      if (room <= share) {
        if (room > 0) {
          allocations.set(meta.id, current + room);
          remaining -= room;
        }
      } else {
        allocations.set(meta.id, current + share);
        remaining -= share;
        stillPending.push(meta);
      }
    }

    pending = stillPending;
  }

  return Array.from(allocations, ([id, monto]) => ({ id_meta: parseInt(id), monto }));
}

/**
 * Calculate how to distribute a savings amount across active goals.
 * Supports three modes:
 * - 'equitativa': equal split among all active goals, capped at each goal's remaining need
 * - 'prioridad': fills goals closest to deadline first, capped at each goal's remaining need
 * - 'especifica': equal split among selected goals, capped at each goal's remaining need
 */
export function calculateSavingsDistribution(
  totalToDistribute: number,
  metas: Meta[],
  mode: SavingsDistributionMode,
  selectedGoalIds: string[] = [],
): SavingsAllocation[] {
  if (totalToDistribute <= 0) return [];

  const activeMetas = metas.filter((m) => m.ahorro_actual < m.monto_objetivo);
  if (activeMetas.length === 0) return [];

  if (mode === 'especifica') {
    return getEqualAllocations(totalToDistribute, activeMetas, selectedGoalIds);
  }

  if (mode === 'equitativa') {
    return getEqualAllocations(
      totalToDistribute,
      activeMetas,
      activeMetas.map((m) => m.id),
    );
  }

  const allocations: SavingsAllocation[] = [];
  let remaining = totalToDistribute;
  const sorted = [...activeMetas].sort((a, b) => {
    const da = a.fecha_limite ? new Date(a.fecha_limite).getTime() : Infinity;
    const db = b.fecha_limite ? new Date(b.fecha_limite).getTime() : Infinity;
    return da - db;
  });

  for (const m of sorted) {
    if (remaining <= 0) break;
    const needed = m.monto_objetivo - m.ahorro_actual;
    const toGive = Math.min(remaining, needed);
    allocations.push({ id_meta: parseInt(m.id), monto: toGive });
    remaining -= toGive;
  }

  return allocations;
}

/**
 * Calculate the projected allocation for a specific goal.
 */
export function getProjectedForMeta(
  meta: Meta,
  allMetas: Meta[],
  totalToDistribute: number,
  mode: SavingsDistributionMode,
  selectedGoalIds: string[] = [],
): number {
  if (totalToDistribute <= 0) return 0;

  const activeMetas = allMetas.filter((m) => m.ahorro_actual < m.monto_objetivo);
  if (activeMetas.length === 0 || !activeMetas.some((m) => m.id === meta.id)) return 0;

  if (mode === 'especifica' || mode === 'equitativa') {
    const ids = mode === 'especifica' ? selectedGoalIds : activeMetas.map((m) => m.id);
    return (
      getEqualAllocations(totalToDistribute, activeMetas, ids).find(
        (allocation) => allocation.id_meta === parseInt(meta.id),
      )?.monto ?? 0
    );
  }

  let remaining = totalToDistribute;
  const sorted = [...activeMetas].sort((a, b) => {
    const da = a.fecha_limite ? new Date(a.fecha_limite).getTime() : Infinity;
    const db = b.fecha_limite ? new Date(b.fecha_limite).getTime() : Infinity;
    return da - db;
  });

  for (const m of sorted) {
    if (remaining <= 0) break;
    const toGive = Math.min(remaining, m.monto_objetivo - m.ahorro_actual);
    if (m.id === meta.id) return toGive;
    remaining -= toGive;
  }

  return 0;
}
