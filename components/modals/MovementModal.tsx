'use client';

import Modal from './Modal';
import { formatAmountForDisplay } from '@/lib/utils';
import type { CategoriaBackend, ModalMovementType } from '@/lib/types';

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: { monto: string; descripcion: string; id_categoria: string; fecha: string };
  setFormData: (data: { monto: string; descripcion: string; id_categoria: string; fecha: string }) => void;
  categories: CategoriaBackend[];
  modalType: ModalMovementType;
  currentTab: string;
  isSubmitting: boolean;
}

export default function MovementModal({
  isOpen, onClose, onSubmit, formData, setFormData,
  categories, modalType, currentTab, isSubmitting,
}: MovementModalProps) {
  const categoriesFiltered =
    modalType === 'ingreso' || currentTab === 'ingresos'
      ? categories.filter((c) => c.tipo === 'ingreso')
      : modalType === 'gasto' || currentTab === 'gastos'
        ? categories.filter((c) => c.tipo === 'gasto')
        : categories;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Transacción">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Categoría Selecta</label>
          <select
            required
            value={formData.id_categoria}
            onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
            className="w-full bg-[#121212] border-2 border-[#2e2e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] hover:border-gray-600 transition-colors appearance-none font-medium"
          >
            <option value="" disabled>Elige la naturaleza de la cuenta</option>
            {categoriesFiltered.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.tipo === 'ingreso' ? '🟢' : '🔴'} {cat.nombre_categoria}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Monto Cifrado ($)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#3b82f6] transition-colors">
              <span className="text-xl font-bold">$</span>
            </div>
            <input
              type="text"
              placeholder="0,00"
              value={formatAmountForDisplay(formData.monto)}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value.replace(/\D/g, '') })}
              className="w-full bg-[#121212] border-2 border-[#2e2e2e] focus:border-[#3b82f6] rounded-2xl py-5 pl-10 pr-6 text-white text-3xl font-black outline-none transition-all placeholder:text-gray-800"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Concepto Breve</label>
          <input
            type="text"
            required
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="w-full bg-[#121212] border-2 border-[#2e2e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] hover:border-gray-600 transition-colors placeholder-gray-700 font-medium"
            placeholder="Descripción del movimiento..."
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Fecha del Registro</label>
          <input
            type="date"
            required
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            className="w-full bg-[#121212] border-2 border-[#2e2e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] hover:border-gray-600 transition-colors [color-scheme:dark] font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white py-4 rounded-xl font-extrabold text-lg mt-6 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-blue-900/30"
        >
          {isSubmitting ? 'Encriptando...' : 'Confirmar Envio'}
        </button>
      </form>
    </Modal>
  );
}
