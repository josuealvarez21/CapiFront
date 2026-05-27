'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
