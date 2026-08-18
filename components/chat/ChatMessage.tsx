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
  const { isSpeaking, isSpeechSupported, speak, stopSpeaking } = useVoice();

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
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 ${
          isUser ? 'bg-white/10 text-gray-300' : 'bg-gradient-to-br from-[#3b82f6] to-[#22c55e]'
        }`}
      >
        {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
      </div>
      <div className="flex max-w-[85%] items-start gap-1">
        <div
          className={`whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm leading-relaxed ${
            isUser
              ? 'rounded-tr-sm bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white'
              : 'rounded-tl-sm glass-soft text-gray-200'
          }`}
        >
          {message.content || (isUser ? '' : ' ')}
        </div>
        {!isUser && message.content && (
          <button
            onClick={handleSpeak}
            disabled={!isSpeechSupported}
            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${
              isSpeaking
                ? 'bg-[#3b82f6] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            } disabled:opacity-30`}
            title={!isSpeechSupported ? 'Voz no disponible' : isSpeaking ? 'Detener' : 'Escuchar'}
          >
            {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
