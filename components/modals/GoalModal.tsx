'use client';

import { useRef, useState } from 'react';
import Modal from './Modal';
import { formatAmountForDisplay } from '@/lib/utils';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: { nombre: string; objetivo: string; fecha: string };
  setFormData: (data: { nombre: string; objetivo: string; fecha: string }) => void;
  isSubmitting: boolean;
}

export default function GoalModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isSubmitting,
}: GoalModalProps) {
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const amountInputRef = useRef<HTMLInputElement>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Proyecto">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Título de la Meta
          </label>
          <input
            type="text"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6]"
            placeholder="Mi nueva Laptop..."
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Monto a Reunir ($)
          </label>
          <input
            ref={amountInputRef}
            type="text"
            inputMode="numeric"
            required
            value={isAmountFocused ? formData.objetivo : formatAmountForDisplay(formData.objetivo)}
            onFocus={() => {
              setIsAmountFocused(true);
              requestAnimationFrame(() => {
                const input = amountInputRef.current;
                input?.setSelectionRange(input.value.length, input.value.length);
              });
            }}
            onBlur={() => setIsAmountFocused(false)}
            onChange={(e) =>
              setFormData({ ...formData, objetivo: e.target.value.replace(/\D/g, '') })
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[20px] font-bold text-white focus:outline-none focus:border-[#3b82f6]"
            placeholder="5.000"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Fecha de Expiración
          </label>
          <input
            type="date"
            required
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] [color-scheme:dark]"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#3b82f6] to-[#22c55e] hover:from-[#2563eb] hover:to-[#16a34a] text-white py-4 rounded-xl font-extrabold text-lg mt-6 shadow-lg shadow-blue-900/30"
        >
          {isSubmitting ? 'Trazando Ruta...' : 'Establecer Objetivo'}
        </button>
      </form>
    </Modal>
  );
}
