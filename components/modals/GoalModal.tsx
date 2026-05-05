'use client';

import Modal from './Modal';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: { nombre: string; objetivo: string; fecha: string };
  setFormData: (data: { nombre: string; objetivo: string; fecha: string }) => void;
  isSubmitting: boolean;
}

export default function GoalModal({ isOpen, onClose, onSubmit, formData, setFormData, isSubmitting }: GoalModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Proyecto">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Título de la Meta</label>
          <input type="text" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full bg-[#121212] border-2 border-[#2e2e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]" placeholder="Mi nueva Laptop..." />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Monto a Reunir ($)</label>
          <input type="number" step="0.01" required value={formData.objetivo} onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })} className="w-full bg-[#121212] border-2 border-[#2e2e2e] rounded-xl px-4 py-3 text-[20px] font-bold text-white focus:outline-none focus:border-[#f59e0b]" placeholder="5000.00" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Fecha de Expiración</label>
          <input type="date" required value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} className="w-full bg-[#121212] border-2 border-[#2e2e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b] [color-scheme:dark]" />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] text-white py-4 rounded-xl font-extrabold text-lg mt-6 shadow-lg shadow-yellow-900/30">
          {isSubmitting ? 'Trazando Ruta...' : 'Establecer Objetivo'}
        </button>
      </form>
    </Modal>
  );
}
