'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LogOut, Settings, Shield, X } from 'lucide-react';

interface MobileActionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onOpenAdmin?: () => void;
}

export default function MobileActionsSheet({
  isOpen,
  onClose,
  onOpenSettings,
  onLogout,
  onOpenAdmin,
}: MobileActionsSheetProps) {
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Más opciones"
            initial={reduceMotion ? false : { y: '100%' }}
            animate={{ y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: 'spring', damping: 28, stiffness: 320 }
            }
            className="glass-card relative w-full max-w-md rounded-t-3xl border-b-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.9)]"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />

            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-400">
                Más opciones
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar menú"
                className="rounded-full border border-white/10 bg-white/5 p-2 text-gray-400 transition-colors hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1.5">
              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#60a5fa] transition-colors hover:bg-[#3b82f6]/10"
                >
                  <Shield size={18} className="shrink-0" />
                  Panel de administración
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Settings size={18} className="shrink-0" />
                Ajustes
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/10"
              >
                <LogOut size={18} className="shrink-0" />
                Salir de Cápi
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
