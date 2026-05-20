'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { ChatMessage, ConfirmationRequest, SSEEvent } from '@/lib/types';

export function useChat() {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationRequest | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const streamRef = useRef<ReadableStreamDefaultReader | null>(null);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateLastMessage = useCallback((content: string) => {
    setMessages((prev) => {
      if (prev.length === 0 || prev[prev.length - 1].role !== 'assistant') {
        return [...prev, { id: crypto.randomUUID(), role: 'assistant', content, timestamp: new Date().toISOString() }];
      }
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.content += content;
      updated[updated.length - 1] = last;
      return updated;
    });
  }, []);

  const parseSSE = useCallback(
    async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event: SSEEvent = JSON.parse(jsonStr);
              switch (event.type) {
                case 'token':
                  updateLastMessage(event.content || '');
                  break;
                case 'confirmation_required':
                  setConfirmation({
                    tool: event.tool || '',
                    args: event.args || {},
                    temp_id: event.temp_id || '',
                  });
                  setIsLoading(false);
                  break;
                case 'done':
                  setIsLoading(false);
                  break;
                case 'error':
                  updateLastMessage(`Error: ${event.content}`);
                  setIsLoading(false);
                  break;
                case 'result':
                  addMessage('assistant', event.content || '');
                  setIsLoading(false);
                  break;
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setIsLoading(false);
        }
      }
    },
    [addMessage, updateLastMessage],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!token || !content.trim() || isLoading) return;

      setConfirmation(null);
      addMessage('user', content);
      setIsLoading(true);
      setHasUnread(false);

      const abortController = new AbortController();
      abortRef.current = abortController;

      const timeoutId = setTimeout(() => {
        abortController.abort();
        setIsLoading(false);
        updateLastMessage('La solicitud tardó demasiado. Intenta de nuevo.');
      }, 60000);

      try {
        const response = await api.chat.send(token, content.trim());
        if (!response.ok) {
          clearTimeout(timeoutId);
          updateLastMessage('Error al conectar con el asistente.');
          setIsLoading(false);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          clearTimeout(timeoutId);
          updateLastMessage('Error al leer la respuesta.');
          setIsLoading(false);
          return;
        }

        streamRef.current = reader;
        await parseSSE(reader);
        setIsLoading(false);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          clearTimeout(timeoutId);
          updateLastMessage('Error de conexión.');
          setIsLoading(false);
        }
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    },
    [token, isLoading, addMessage, updateLastMessage, parseSSE],
  );

  const confirmAction = useCallback(
    async (approved: boolean) => {
      if (!confirmation || !token) return;

      if (!approved) {
        addMessage('assistant', 'Operación cancelada.');
        setConfirmation(null);
        return;
      }

      setConfirmation(null);
      setIsLoading(true);

      try {
        const result = await api.chat.confirm(token, confirmation.temp_id);
        if (result.type === 'error') {
          addMessage('assistant', `Error: ${result.content}`);
        } else {
          addMessage('assistant', result.content);
        }
      } catch {
        addMessage('assistant', 'Error al confirmar la operación.');
      }
      setIsLoading(false);
    },
    [confirmation, token, addMessage],
  );

  const loadHistory = useCallback(async () => {
    if (!token) return;
    try {
      const { messages: history } = await api.chat.history(token);
      setMessages(history);
    } catch {
      // silent fail
    }
  }, [token]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        setHasUnread(false);
        if (messages.length === 0) {
          loadHistory();
        }
      }
      return !prev;
    });
  }, [loadHistory, messages.length]);

  const clearHistory = useCallback(async () => {
    if (!token) return;
    try {
      await api.chat.clear(token);
      setMessages([]);
    } catch {
      // silent fail
    }
  }, [token]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    streamRef.current?.cancel();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      streamRef.current?.cancel();
    };
  }, []);

  return {
    isOpen,
    toggleOpen,
    messages,
    isLoading,
    confirmation,
    hasUnread: hasUnread && !isOpen,
    sendMessage,
    confirmAction,
    clearHistory,
    stopStreaming,
    setIsOpen,
  };
}
