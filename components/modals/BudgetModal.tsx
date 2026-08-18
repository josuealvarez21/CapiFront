'use client';

import Modal from './Modal';
import { formatAmountForDisplay } from '@/lib/utils';
import type { CategoriaBackend } from '@/lib/types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: { id_categoria: string; limite: string; fecha_mes: string };
  setFormData: (data: { id_categoria: string; limite: string; fecha_mes: string }) => void;
  categories: CategoriaBackend[];
  isSubmitting: boolean;
}

export default function BudgetModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  categories,
  isSubmitting,
}: BudgetModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Escudo Financiero">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Categoría A Bloquear
          </label>
          <select
            required
            value={formData.id_categoria}
            onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
            className="w-full bg-[#0a0e17] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] appearance-none font-medium [color-scheme:dark]"
          >
            <option value="" disabled className="bg-[#0a0e17] text-white">
              Selecciona la llave de gasto
            </option>
            {categories
              .filter((c) => c.tipo === 'gasto')
              .map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria} className="bg-[#0a0e17] text-white">
                  🔴 {cat.nombre_categoria}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Límite de Capital ($)
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#3b82f6] transition-colors">
              <span className="text-xl font-bold">$</span>
            </div>
            <input
              type="text"
              placeholder="0,00"
              value={formatAmountForDisplay(formData.limite)}
              onChange={(e) =>
                setFormData({ ...formData, limite: e.target.value.replace(/\D/g, '') })
              }
              className="w-full bg-white/5 border border-white/10 focus:border-[#3b82f6] rounded-2xl py-5 pl-10 pr-6 text-white text-3xl font-black outline-none transition-all placeholder:text-gray-700"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Temporalidad (Mes/Año)
          </label>
          <input
            type="month"
            required
            value={formData.fecha_mes}
            onChange={(e) => setFormData({ ...formData, fecha_mes: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] [color-scheme:dark]"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#3b82f6] to-[#22c55e] hover:from-[#2563eb] hover:to-[#16a34a] text-white py-4 rounded-xl font-extrabold text-lg mt-6 shadow-lg shadow-blue-900/30"
        >
          {isSubmitting ? 'Blindando...' : 'Fijar Bóveda'}
        </button>
      </form>
    </Modal>
  );
}
