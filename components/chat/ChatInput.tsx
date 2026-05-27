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
  const { isListening, isMicSupported, startListening, stopListening } = useVoice();

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
    <div className="flex items-end gap-2">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe un mensaje..."
        disabled={isLoading}
        rows={1}
        className="max-h-32 min-h-[40px] flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-blue-600 disabled:opacity-50"
      />
      <button
        onClick={handleMicClick}
        disabled={isLoading || !isMicSupported}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
          isListening
            ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 animate-pulse'
            : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white'
        } disabled:opacity-40`}
        title={!isMicSupported ? 'Voz no disponible en este navegador' : isListening ? 'Detener grabación' : 'Grabar voz'}
      >
        <Mic size={16} />
      </button>
      {isLoading ? (
        <button
          onClick={onStop}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white transition-colors hover:bg-red-500"
          title="Detener"
        >
          <Square size={16} />
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600"
          title="Enviar"
        >
          <Send size={16} />
        </button>
      )}
    </div>
  );
}
