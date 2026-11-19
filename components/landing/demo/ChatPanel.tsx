'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Bot, Check, Send, X } from 'lucide-react';
import { fadeUpSmall } from '@/lib/motion';
import { money, type DemoChatMessage, type DemoConfirmation } from './demo-data';

interface ChatPanelProps {
  messages: DemoChatMessage[];
  pending: DemoConfirmation | null;
  typing: boolean;
  onSend: (texto: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  reduceMotion: boolean;
}

const SUGERENCIAS = [
  '¿Cuánto gasté en comida?',
  'Registra $85.000 en comida',
  '¿Cómo va mi meta?',
  '¿Cuál es mi balance?',
];

export default function ChatPanel({
  messages,
  pending,
  typing,
  onSend,
  onConfirm,
  onCancel,
  reduceMotion,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contenedor = scrollRef.current;
    if (!contenedor) return;
    contenedor.scrollTo({
      top: contenedor.scrollHeight,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [messages, typing, pending, reduceMotion]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div
        ref={scrollRef}
        aria-live="polite"
        aria-label="Conversación con CapiBot"
        className="max-h-[290px] space-y-3 overflow-y-auto pr-1"
      >
        <AnimatePresence initial={false}>
          {messages.map((mensaje) => (
            <motion.div
              key={mensaje.id}
              variants={fadeUpSmall}
              initial="hidden"
              animate="show"
              transition={reduceMotion ? { duration: 0 } : undefined}
              className={mensaje.role === 'user' ? 'flex justify-end' : 'flex items-start gap-2'}
            >
              {mensaje.role === 'bot' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#22c55e] text-white">
                  <Bot size={14} aria-hidden="true" />
                </div>
              )}
              <div
                className={
                  mensaje.role === 'user'
                    ? 'max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-[#3b82f6] to-[#2563eb] px-4 py-2.5 text-sm text-white'
                    : 'glass-soft max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed text-gray-200'
                }
              >
                {mensaje.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#22c55e] text-white">
              <Bot size={14} aria-hidden="true" />
            </div>
            <div className="glass-soft flex items-center gap-1 rounded-2xl rounded-tl-sm px-4 py-3.5">
              {[0, 1, 2].map((indice) => (
                <motion.span
                  key={indice}
                  className="h-1.5 w-1.5 rounded-full bg-[#60a5fa]"
                  animate={reduceMotion ? {} : { opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 1, repeat: Infinity, delay: indice * 0.15 }
                  }
                />
              ))}
              <span className="sr-only">CapiBot está escribiendo…</span>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {pending && (
          <motion.div
            key="confirmacion"
            variants={fadeUpSmall}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            transition={reduceMotion ? { duration: 0 } : undefined}
            className="mt-4 rounded-xl border border-amber-500/30 glass-soft p-3"
          >
            <div className="mb-2 flex items-center gap-2 text-amber-400">
              <AlertTriangle size={16} aria-hidden="true" />
              <span className="text-[11px] font-black uppercase tracking-wide">
                Confirmar movimiento
              </span>
            </div>
            <p className="mb-1 text-sm font-bold text-white">
              {money(pending.monto)} en {pending.categoria}
            </p>
            <p className="mb-3 text-xs text-gray-400">
              {pending.descripcion} · {pending.fecha}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onConfirm}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#22c55e] py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
              >
                <Check size={14} aria-hidden="true" /> Confirmar
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 py-2 text-xs font-bold text-gray-300 transition-colors hover:bg-white/10"
              >
                <X size={14} aria-hidden="true" /> Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <label htmlFor="demo-chat-input" className="sr-only">
          Escribe un mensaje para CapiBot
        </label>
        <input
          id="demo-chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={typing}
          placeholder="Preguntame lo que quieras…"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#3b82f6]/60 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#22c55e] px-4 py-2.5 text-xs font-black text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={14} aria-hidden="true" />
          Enviar
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGERENCIAS.map((sugerencia) => (
          <button
            key={sugerencia}
            type="button"
            disabled={typing}
            onClick={() => onSend(sugerencia)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-gray-300 transition-colors hover:border-[#3b82f6]/40 hover:text-white disabled:opacity-40"
          >
            {sugerencia}
          </button>
        ))}
      </div>
    </div>
  );
}
