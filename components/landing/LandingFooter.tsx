import Link from 'next/link';
import LandingLogo from '@/components/landing/LandingLogo';

const anchors = [
  { href: '#funciones', label: 'Funciones' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#demo', label: 'Demo' },
  { href: '/guia-finanzas-personales', label: 'Guía de finanzas' },
  { href: '/guias/presupuestos', label: 'Presupuestos' },
  { href: '/guias/metas-de-ahorro', label: 'Metas de ahorro' },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0e17]/60 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <Link href="/" aria-label="Cápi, inicio" className="rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6]">
          <LandingLogo />
        </Link>

        <nav
          aria-label="Pie de página"
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {anchors.map((anchor) => (
            <a
              key={anchor.href}
              href={anchor.href}
              className="text-xs font-bold text-gray-400 transition-colors hover:text-white"
            >
              {anchor.label}
            </a>
          ))}
          <Link
            href="/login"
            className="text-xs font-bold text-gray-400 transition-colors hover:text-white"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="text-xs font-bold text-[#4ade80] transition-colors hover:text-white"
          >
            Registro
          </Link>
        </nav>

        <p className="text-center text-[11px] text-gray-600">
          Controla tu destino financiero con Cápi.
        </p>
      </div>
    </footer>
  );
}
