'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import type { CategoriaBackend } from '@/lib/types';

interface ConfirmationCardProps {
  tool: string;
  args: Record<string, unknown>;
  onConfirm: () => void;
  onCancel: () => void;
}

const TOOL_LABELS: Record<string, string> = {
  crear_movimiento: 'Registrar movimiento',
  crear_meta: 'Crear meta de ahorro',
  crear_presupuesto: 'Crear presupuesto',
  eliminar_movimiento: 'Eliminar movimiento',
};

/** Montos siempre explícitos en pesos colombianos. */
function cop(value: unknown): string {
  const numero = Number(value);
  if (!Number.isFinite(numero)) return 'Monto no disponible';
  return `${formatCurrency(numero)} COP`;
}

function texto(value: unknown): string {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function fecha(value: unknown): string {
  const valor = texto(value);
  return valor ? `Fecha: ${valor}` : '';
}

interface Detalle {
  etiqueta: string;
  valor: string;
}

/**
 * Convierte los argumentos de la herramienta en una lista controlada.
 * Nunca mostramos JSON crudo: el modelo puede generar claves inesperadas.
 */
function buildDetalles(
  tool: string,
  args: Record<string, unknown>,
  categorias: CategoriaBackend[],
): Detalle[] {
  const nombreCategoria = (id: unknown): string => {
    const idNum = Number(id);
    const categoria = categorias.find((item) => item.id_categoria === idNum);
    return categoria ? categoria.nombre_categoria : `Categoría #${idNum || '?'}`;
  };

  if (tool === 'crear_movimiento') {
    const descripcion = texto(args.descripcion);
    return [
      { etiqueta: 'Monto', valor: cop(args.monto) },
      { etiqueta: 'Categoría', valor: nombreCategoria(args.id_categoria) },
      ...(descripcion ? [{ etiqueta: 'Descripción', valor: descripcion }] : []),
      ...(fecha(args.fecha) ? [{ etiqueta: 'Fecha', valor: texto(args.fecha) }] : []),
    ];
  }

  if (tool === 'crear_meta') {
    const nombre = texto(args.nombre_meta) || texto(args.nombre);
    const objetivo = args.monto_objetivo ?? args.objetivo;
    const limite = texto(args.fecha_limite) || texto(args.fecha);
    return [
      ...(nombre ? [{ etiqueta: 'Meta', valor: nombre }] : []),
      { etiqueta: 'Objetivo', valor: cop(objetivo) },
      ...(limite ? [{ etiqueta: 'Fecha límite', valor: limite }] : []),
    ];
  }

  if (tool === 'crear_presupuesto') {
    const limite = cop(args.monto_limite ?? args.limite);
    const mes = Number(args.mes);
    const anio = Number(args.anio);
    const periodo = Number.isFinite(mes) && Number.isFinite(anio) && mes > 0
      ? ` · ${String(mes).padStart(2, '0')}/${anio}`
      : '';
    return [
      { etiqueta: 'Categoría', valor: nombreCategoria(args.id_categoria) },
      { etiqueta: 'Límite', valor: `${limite}${periodo}` },
    ];
  }

  if (tool === 'eliminar_movimiento') {
    return [{ etiqueta: 'Movimiento', valor: `ID #${Number(args.id_movimiento) || '?'}` }];
  }

  // Si el modelo propone una herramienta que no conocemos, no ejecutamos nada:
  // mostramos una advertencia en vez de filtrar información arbitraria.
  return [{ etiqueta: 'Acción', valor: 'No reconocida. No la confirmes.' }];
}

export function ConfirmationCard({ tool, args, onConfirm, onCancel }: ConfirmationCardProps) {
  const { token } = useAuth();
  const [categorias, setCategorias] = useState<CategoriaBackend[]>([]);
  const label = TOOL_LABELS[tool] || 'Acción no reconocida';
  const detalles = buildDetalles(tool, args, categorias);
  const accionConocida = tool in TOOL_LABELS;

  useEffect(() => {
    if (!token || !['crear_movimiento', 'crear_presupuesto'].includes(tool)) return;
    let activo = true;
    api.categories
      .list(token)
      .then((lista) => {
        if (activo) setCategorias(Array.isArray(lista) ? lista : []);
      })
      .catch(() => {
        // Sin categorías cargadas mostramos el ID; nunca inventamos un nombre.
      });
    return () => {
      activo = false;
    };
  }, [token, tool]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-amber-500/30 glass-soft p-3"
    >
      <div className="mb-2 flex items-center gap-2 text-amber-400">
        <AlertTriangle size={16} />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <dl className="mb-3 space-y-1 text-sm text-gray-200">
        {detalles.map((detalle) => (
          <div key={detalle.etiqueta} className="flex gap-2">
            <dt className="shrink-0 text-gray-500">{detalle.etiqueta}:</dt>
            <dd className="whitespace-pre-wrap break-words">{detalle.valor}</dd>
          </div>
        ))}
      </dl>
      <p className="mb-3 text-xs text-gray-400">
        No se guardará nada hasta que confirmes. Si cancelas, no se realiza ningún cambio.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          disabled={!accionConocida}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#22c55e] py-2 text-sm font-medium text-white transition-all hover:shadow-[0_0_20px_-4px_rgba(59,130,246,0.7)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check size={16} />
          Confirmar
        </button>
        <button
          onClick={onCancel}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
        >
          <X size={16} />
          Cancelar
        </button>
      </div>
    </motion.div>
  );
}
