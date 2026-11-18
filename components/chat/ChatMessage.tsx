'use client';

import { motion } from 'framer-motion';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
}

/**
 * Quita marcadores Markdown antes de enviar el texto al Text-to-Speech,
 * para que la voz no lea asteriscos, almohadillas ni barras invertidas.
 */
function toSpeechText(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/`/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .trim();
}

/** negritas en verde, viñetas azules y párrafos con aire. */
const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-bold text-[#4ade80]">{children}</strong>,
  em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-4 marker:text-[#60a5fa] last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-4 marker:text-[#60a5fa] last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[#60a5fa] underline underline-offset-2"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-white/10 px-1 py-0.5 text-[0.9em] text-[#60a5fa]">{children}</code>
  ),
  h1: ({ children }) => <p className="mb-2 font-bold text-white last:mb-0">{children}</p>,
  h2: ({ children }) => <p className="mb-2 font-bold text-white last:mb-0">{children}</p>,
  h3: ({ children }) => <p className="mb-2 font-bold text-white last:mb-0">{children}</p>,
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const { isSpeaking, isSpeechSupported, speak, stopSpeaking } = useVoice();

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(toSpeechText(message.content));
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
        {isUser ? (
          <User size={14} className="text-white" />
        ) : (
          <Bot size={14} className="text-white" />
        )}
      </div>

      <div className="flex min-w-0 max-w-[88%] flex-col gap-1.5">
        <div
          className={`min-w-0 break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'whitespace-pre-wrap rounded-tr-sm bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white'
              : 'whitespace-pre-line rounded-tl-sm border-l-2 border-l-[#3b82f6]/70 glass-soft text-gray-200'
          }`}
        >
          {isUser ? (
            message.content || '\u00A0'
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {message.content || ' '}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && message.content && (
          <div className="flex pl-1">
            <button
              onClick={handleSpeak}
              disabled={!isSpeechSupported}
              className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                isSpeaking
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              } disabled:opacity-30`}
              title={!isSpeechSupported ? 'Voz no disponible' : isSpeaking ? 'Detener' : 'Escuchar'}
              aria-label={isSpeaking ? 'Detener lectura' : 'Escuchar respuesta'}
            >
              {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
