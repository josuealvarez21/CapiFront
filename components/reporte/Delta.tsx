'use client';

import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

interface DeltaProps {
  pct: number | null | undefined;
  subirEsBueno: boolean;
}

/**
 * Variación porcentual contra el mes anterior.
 * Un valor null se muestra como "Sin base" (nunca 0% ni NaN%).
 */
export default function Delta({ pct, subirEsBueno }: DeltaProps) {
  if (pct === null || pct === undefined) {
    return (
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
        Sin base
      </span>
    );
  }

  if (Math.abs(pct) < 0.05) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-black text-gray-500">
        <Minus size={13} />
        0%
      </span>
    );
  }

  const sube = pct > 0;
  const favorable = sube === subirEsBueno;
  const Icon = sube ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-black ${
        favorable ? 'text-[#4ade80]' : 'text-red-400'
      }`}
    >
      <Icon size={13} />
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}