'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ConfirmationCard } from './ConfirmationCard';

export function ChatWidget() {
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
  } = useChat();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex w-96 max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
            style={{ maxHeight: '70vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                  C
                </div>
                <div>
                  <p className="text-sm font-medium text-white">CapiBot</p>
                  <p className="text-xs text-zinc-500">Asistente financiero</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="rounded-lg px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                  >
                    Limpiar
                  </button>
                )}
                <button
                  onClick={toggleOpen}
                  className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 custom-scrollbar">
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20">
                    <MessageCircle size={24} className="text-blue-500" />
                  </div>
                  <p className="text-sm font-medium text-white">¿En qué puedo ayudarte?</p>
                  <p className="mt-1 text-xs text-zinc-500">
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
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    C
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-zinc-800 px-3 py-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-zinc-800 px-4 py-3">
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
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition-colors hover:bg-blue-500"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </>
  );
}
