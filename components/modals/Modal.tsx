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
      <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-white transition bg-[#121212] p-2 rounded-full border border-[#2e2e2e] z-10"
        >
          <X size={20} />
        </button>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-6 pr-8">{title}</h3>
        <div className="overflow-y-auto pr-1 -mr-1 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}
