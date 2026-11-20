'use client';

import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="glass-card relative flex max-h-[90dvh] w-full max-w-md flex-col rounded-3xl p-5 shadow-[0_0_80px_-20px_rgba(0,0,0,0.9)] sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-white transition glass-soft p-2 rounded-full border border-white/10 z-10"
        >
          <X size={20} />
        </button>
        <h3 className="mb-6 pr-8 text-lg font-extrabold text-white sm:text-2xl">{title}</h3>
        <div className="overflow-y-auto pr-1 -mr-1 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}
