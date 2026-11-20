'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';

interface DashboardHeaderProps {
  userName: string;
  title: string;
  description: string;
  actions?: ReactNode;
  badge?: string;
  reduceMotion: boolean;
}

export default function DashboardHeader({
  userName,
  title,
  description,
  actions,
  badge = 'Tu centro financiero',
  reduceMotion,
}: DashboardHeaderProps) {
  const firstName = userName.trim().split(/\s+/)[0] || userName;

  return (
    <motion.header
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mb-5 flex flex-col gap-4 sm:mb-6 sm:gap-5 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="min-w-0">
        <motion.div
          variants={fadeUp}
          className="inline-flex max-w-full items-center gap-2 rounded-full glass-soft px-3 py-2 sm:px-4"
        >
          <span
            className={`h-2 w-2 shrink-0 rounded-full bg-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.9)] ${
              reduceMotion ? '' : 'animate-pulse'
            }`}
            aria-hidden="true"
          />
          <span className="eyebrow min-w-0 truncate text-gray-300">
            Hola, {firstName} · {badge}
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mt-4 text-2xl font-extrabold tracking-tight neon-text sm:text-4xl lg:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-2 text-xs text-gray-400 sm:text-sm">
          {description}
        </motion.p>
      </div>

      {actions && (
        <motion.div
          variants={fadeUp}
          className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3 lg:w-auto"
        >
          {actions}
        </motion.div>
      )}
    </motion.header>
  );
}
