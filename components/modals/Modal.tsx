'use client';

import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex animate-[modal-in_200ms_ease-out] items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="glass-card relative flex max-h-[90dvh] w-full max-w-md animate-[modal-panel-in_200ms_ease-out] flex-col rounded-3xl p-5 shadow-[0_0_80px_-20px_rgba(0,0,0,0.9)] outline-none sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="glass-soft absolute top-4 right-4 z-10 rounded-full border border-white/10 p-2 text-gray-400 transition hover:text-white sm:top-6 sm:right-6"
        >
          <X size={20} />
        </button>
        <h3 id={titleId} className="mb-6 pr-8 text-lg font-extrabold text-white sm:text-2xl">
          {title}
        </h3>
        <div className="custom-scrollbar overflow-y-auto pr-1 -mr-1">{children}</div>
      </div>
    </div>
  );
}
