'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import ConfirmDialog, { type ConfirmOptions } from '@/components/modals/ConfirmDialog';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ConfirmationCard } from './ConfirmationCard';

interface ChatWidgetProps {
  onDataChange?: () => void;
}

export function ChatWidget({ onDataChange }: ChatWidgetProps) {
  const {
    isOpen,
    toggleOpen,
    messages,
    isLoading,
    confirmation,
    sendMessage,
    confirmAction,
    clearHistory,
    stopStreaming,
  } = useChat(onDataChange);

  const reduceMotion = useReducedMotion() ?? false;
  const [pendingClearConfirm, setPendingClearConfirm] = useState<ConfirmOptions | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  // La tarjeta de confirmación se añade al final: sin esto queda fuera del área
  // visible y el usuario piensa que el bot nunca la mostró.
  useEffect(() => {
    const contenedor = messagesRef.current;
    if (contenedor) contenedor.scrollTop = contenedor.scrollHeight;
  }, [messages.length, confirmation, isLoading]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-2 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 flex h-[min(70dvh,34rem)] max-h-[calc(100dvh-7rem)] flex-col rounded-2xl glass-card border border-white/10 md:inset-x-auto md:bottom-24 md:right-6 md:h-auto md:w-96 md:max-h-[70vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-3 sm:px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#22c55e] text-sm font-bold text-white">
                  C
                </div>
                <div>
                  <p className="text-sm font-extrabold neon-text">CapiBot</p>
                  <p className="text-xs text-zinc-500">Asistente financiero</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={() =>
                      setPendingClearConfirm({
                        title: 'Limpiar conversación',
                        description: '¿Borrar todo el historial de CapiBot? Esta acción no se puede deshacer.',
                        confirmLabel: 'Limpiar',
                        tone: 'danger',
                        onConfirm: clearHistory,
                      })
                    }
                    className="rounded-lg px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300"
                  >
                    Limpiar
                  </button>
                )}
                <button
                  onClick={toggleOpen}
                  aria-label="Cerrar CapiBot"
                  className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4 custom-scrollbar sm:px-4">
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6]/20 to-[#22c55e]/20">
                    <MessageCircle size={24} className="text-[#60a5fa]" />
                  </div>
                  <p className="text-sm font-medium text-white">¿En qué puedo ayudarte?</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Pregunta sobre tu balance, gastos, metas de ahorro y más.
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {confirmation && (
                <ConfirmationCard
                  tool={confirmation.tool}
                  args={confirmation.args}
                  onConfirm={() => confirmAction(true)}
                  onCancel={() => confirmAction(false)}
                />
              )}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#22c55e] text-xs font-bold text-white">
                    C
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm glass-soft px-3 py-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-white/10 px-3 py-3 sm:px-4">
              <ChatInput
                onSend={sendMessage}
                onStop={stopStreaming}
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Cerrar CapiBot' : 'Abrir CapiBot'}
        className={`fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-50 h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#22c55e] text-white shadow-xl shadow-blue-900/40 transition-all hover:shadow-[0_0_30px_-6px_rgba(59,130,246,0.7)] md:bottom-6 md:right-6 ${
          isOpen ? 'hidden md:flex' : 'flex'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
      <ConfirmDialog
        options={pendingClearConfirm}
        onClose={() => setPendingClearConfirm(null)}
        reduceMotion={reduceMotion}
      />
    </>
  );
}
