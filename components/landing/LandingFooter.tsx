import Link from 'next/link';

const anchors = [
  { href: '#funciones', label: 'Funciones' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#demo', label: 'Demo' },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0e17]/60 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <div>
          <p className="neon-text text-2xl font-extrabold tracking-tight">Cápi</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Hub Financiero
          </p>
        </div>

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
