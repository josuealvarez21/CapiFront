interface LandingLogoProps {
  compact?: boolean;
}

/** Marca de la landing: la «C» de Cápi + «Hub Financiero», sin adornos. */
export default function LandingLogo({ compact = false }: LandingLogoProps) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`neon-text font-black leading-none ${compact ? 'text-lg' : 'text-3xl sm:text-4xl'}`}
      >
        C
      </span>
      <span
        className={`whitespace-nowrap font-semibold uppercase tracking-[0.2em] ${
          compact ? 'text-[9px] text-gray-500' : 'text-[11px] text-gray-400 sm:text-xs'
        }`}
      >
        Hub Financiero
      </span>
    </span>
  );
}
