import type { Variants } from 'framer-motion';

/** Misma curva que SummaryCards/page.tsx del dashboard, reutilizada en el landing. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const tabSwap: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: 'easeIn' } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.18, ease: 'easeIn' } },
};

export const viewportOnce = { once: true, amount: 0.2 } as const;

/** Flotación continua del mockup; se desactiva con prefers-reduced-motion. */
export const floatAnimation = (reduceMotion: boolean) =>
  reduceMotion
    ? {}
    : {
        y: [0, -8, 0],
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const },
      };
