'use client';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, X } from 'lucide-react';

interface ConfirmationCardProps {
  tool: string;
  args: Record<string, unknown>;
  onConfirm: () => void;
  onCancel: () => void;
}

const TOOL_LABELS: Record<string, string> = {
  crear_movimiento: 'Registrar movimiento',
};

function formatArgs(tool: string, args: Record<string, unknown>): string {
  if (tool === 'crear_movimiento') {
    const monto = args.monto as number;
    const descripcion = (args.descripcion as string) || '';
    const fecha = args.fecha as string;
    const idCat = args.id_categoria as number;

    const catNames: Record<number, string> = {
      1: 'Salario',
      2: 'Comida',
      3: 'Alquiler',
      4: 'Transporte',
      5: 'Entretenimiento',
      6: 'Servicios',
    };

    const cat = catNames[idCat] || `Categoría #${idCat}`;
    let text = `$${monto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} en ${cat}`;
    if (descripcion) text += ` — ${descripcion}`;
    if (fecha) text += `\nFecha: ${fecha}`;
    return text;
  }
  return JSON.stringify(args, null, 2);
}

export function ConfirmationCard({ tool, args, onConfirm, onCancel }: ConfirmationCardProps) {
  const label = TOOL_LABELS[tool] || tool;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-amber-500/30 bg-zinc-800 p-3"
    >
      <div className="mb-2 flex items-center gap-2 text-amber-400">
        <AlertTriangle size={16} />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mb-3 whitespace-pre-wrap text-sm text-zinc-200">
        {formatArgs(tool, args)}
      </p>
      <p className="mb-3 text-xs text-zinc-400">¿Confirmas esta operación?</p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          <Check size={16} />
          Confirmar
        </button>
        <button
          onClick={onCancel}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-700 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-600"
        >
          <X size={16} />
          Cancelar
        </button>
      </div>
    </motion.div>
  );
}
