'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Square, Mic } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isListening, isMicSupported, micError, startListening, stopListening, clearMicError } = useVoice();

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        setInput((prev) => (prev ? `${prev} ${text}` : text));
        setTimeout(() => inputRef.current?.focus(), 0);
      });
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {micError && (
        <div className="flex items-center gap-1.5 rounded-lg bg-red-900/40 px-3 py-1.5 text-xs text-red-300">
          <span>{micError}</span>
          <button onClick={clearMicError} className="ml-auto text-red-400 hover:text-red-200">&times;</button>
        </div>
      )}
      <div className="flex items-end gap-2">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe un mensaje..."
        disabled={isLoading}
        rows={1}
        className="max-h-32 min-h-[40px] flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#3b82f6] disabled:opacity-50"
      />
      <button
        onClick={handleMicClick}
        disabled={isLoading || !isMicSupported}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
          isListening
            ? 'bg-red-500 text-white shadow-lg shadow-red-600/50 animate-pulse'
            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
        } disabled:opacity-40`}
        title={!isMicSupported ? 'Voz no disponible en este navegador' : isListening ? 'Detener grabación' : 'Grabar voz'}
      >
        <Mic size={16} />
      </button>
      {isLoading ? (
        <button
          onClick={onStop}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white transition-colors hover:bg-red-400"
          title="Detener"
        >
          <Square size={16} />
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#22c55e] text-white transition-all hover:shadow-[0_0_20px_-4px_rgba(59,130,246,0.7)] disabled:opacity-40 disabled:hover:shadow-none"
          title="Enviar"
        >
          <Send size={16} />
        </button>
      )}
      </div>
    </div>
  );
}
