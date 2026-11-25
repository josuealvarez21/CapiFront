interface LandingLogoProps {
  compact?: boolean;
}

/** Marca de la landing: wordmark «Cápi» con el mismo estilo del resto de la app. */
export default function LandingLogo({ compact = false }: LandingLogoProps) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`neon-text font-black leading-none ${compact ? 'text-lg' : 'text-2xl sm:text-3xl'}`}
      >
        Cápi
      </span>
      {!compact && (
        <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:text-xs">
          Hub Financiero
        </span>
      )}
    </span>
  );
}
