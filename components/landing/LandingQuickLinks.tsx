import Link from 'next/link';

interface QuickLink {
  href: string;
  label: string;
  // En escritorio estos ya están en la barra principal; en móvil no se muestran allí.
  soloMovil?: boolean;
}

const enlaces: QuickLink[] = [
  { href: '#funciones', label: 'Funciones', soloMovil: true },
  { href: '#como-funciona', label: 'Cómo funciona', soloMovil: true },
  { href: '#demo', label: 'Demo', soloMovil: true },
  { href: '#preguntas-frecuentes', label: 'Preguntas frecuentes' },
  { href: '/guia-finanzas-personales', label: 'Guía de finanzas' },
  { href: '/guias/presupuestos', label: 'Presupuestos' },
  { href: '/guias/metas-de-ahorro', label: 'Metas de ahorro' },
  { href: '/privacidad', label: 'Privacidad' },
  { href: '/tratamiento-datos', label: 'Tratamiento de datos' },
  { href: '/terminos', label: 'Términos' },
  { href: '/soporte', label: 'Soporte' },
];

const claseEnlace =
  'shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-gray-300 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6]';

export default function LandingQuickLinks() {
  return (
    <nav
      aria-label="Enlaces importantes"
      className="border-b border-white/10 bg-[#0a0e17]/80 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto py-3">
        {enlaces.map(({ href, label, soloMovil }) => {
          const className = `${claseEnlace}${soloMovil ? ' md:hidden' : ''}`;

          return href.startsWith('#') ? (
            <a key={href} href={href} className={className}>
              {label}
            </a>
          ) : (
            <Link key={href} href={href} className={className}>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
