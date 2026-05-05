import type { Meta, SavingsDistributionMode } from './types';

export interface SavingsAllocation {
  id_meta: number;
  monto: number;
}

/**
 * Calculate how to distribute a savings amount across active goals.
 * Supports two modes:
 * - 'equitativa': equal split among all active goals
 * - 'prioridad': fills goals closest to deadline first, then distributes remainder
 */
export function calculateSavingsDistribution(
  totalToDistribute: number,
  metas: Meta[],
  mode: SavingsDistributionMode
): SavingsAllocation[] {
  if (totalToDistribute <= 0) return [];

  const activeMetas = metas.filter((m) => m.ahorro_actual < m.monto_objetivo);
  if (activeMetas.length === 0) return [];

  const allocations: SavingsAllocation[] = [];

  if (mode === 'equitativa') {
    const perMeta = totalToDistribute / activeMetas.length;
    activeMetas.forEach((m) =>
      allocations.push({ id_meta: parseInt(m.id), monto: perMeta })
    );
  } else {
    // Priority: fill goals closest to deadline first
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

    // Distribute any remainder equally
    if (remaining > 0) {
      const extra = remaining / activeMetas.length;
      allocations.forEach((a) => (a.monto += extra));
    }
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
  mode: SavingsDistributionMode
): number {
  if (totalToDistribute <= 0) return 0;

  const activeMetas = allMetas.filter((m) => m.ahorro_actual < m.monto_objetivo);
  if (activeMetas.length === 0) return 0;

  if (mode === 'equitativa') {
    return totalToDistribute / activeMetas.length;
  }

  // Priority mode
  let remaining = totalToDistribute;
  const sorted = [...activeMetas].sort((a, b) => {
    const da = a.fecha_limite ? new Date(a.fecha_limite).getTime() : Infinity;
    const db = b.fecha_limite ? new Date(b.fecha_limite).getTime() : Infinity;
    return da - db;
  });

  let metaAmount = 0;
  for (const m of sorted) {
    if (remaining <= 0) break;
    const needed = m.monto_objetivo - m.ahorro_actual;
    const toGive = Math.min(remaining, needed);
    if (m.id === meta.id) metaAmount = toGive;
    remaining -= toGive;
  }

  if (remaining > 0) {
    metaAmount += remaining / activeMetas.length;
  }

  return metaAmount;
}
