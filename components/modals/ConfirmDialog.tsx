'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { scaleIn } from '@/lib/motion';

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  onConfirm: () => void | Promise<void>;
}

interface ConfirmDialogProps {
  options: ConfirmOptions | null;
  onClose: () => void;
  reduceMotion: boolean;
}

export default function ConfirmDialog({ options, onClose, reduceMotion }: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!options) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, onClose]);

  const handleConfirm = async () => {
    if (!options || busy) return;
    setBusy(true);
    try {
      await options.onConfirm();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const danger = options?.tone === 'danger';

  return (
    <AnimatePresence>
      {options && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-description"
            onClick={(event) => event.stopPropagation()}
            variants={scaleIn}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={reduceMotion ? { duration: 0 } : undefined}
            className="glass-card relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 p-5 shadow-[0_0_80px_-20px_rgba(59,130,246,0.6)] sm:p-8"
          >
            <div
              className={`mb-5 inline-flex rounded-2xl border p-3 ${
                danger
                  ? 'border-red-500/30 bg-red-500/10 text-red-400'
                  : 'border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#60a5fa]'
              }`}
            >
              <AlertTriangle size={22} aria-hidden="true" />
            </div>

            <h3 id="confirm-title" className="text-xl font-extrabold tracking-tight neon-text sm:text-2xl">
              {options.title}
            </h3>
            <p id="confirm-description" className="mt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">
              {options.description}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} disabled={busy} className="btn-ghost w-full sm:w-auto">
                {options.cancelLabel ?? 'Cancelar'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={busy}
                className={`${danger ? 'btn-danger' : 'btn-primary'} w-full sm:w-auto`}
              >
                {busy && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" />
                )}
                {busy ? 'Procesando…' : (options.confirmLabel ?? 'Confirmar')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
