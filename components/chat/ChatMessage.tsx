'use client';
import { motion } from 'framer-motion';
import { Bot, User, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const { isSpeaking, speak, stopSpeaking } = useVoice();

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(message.content);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-zinc-700' : 'bg-blue-600'
        }`}
      >
        {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
      </div>
      <div className="group flex max-w-[85%] items-start gap-1">
        <div
          className={`whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm leading-relaxed ${
            isUser
              ? 'rounded-tr-sm bg-blue-600 text-white'
              : 'rounded-tl-sm bg-zinc-800 text-zinc-200'
          }`}
        >
          {message.content || (isUser ? '' : ' ')}
        </div>
        {!isUser && message.content && (
          <button
            onClick={handleSpeak}
            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${
              isSpeaking
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-700 text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-white'
            }`}
            title={isSpeaking ? 'Detener' : 'Escuchar'}
          >
            {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
