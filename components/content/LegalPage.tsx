import Link from 'next/link';

export interface LegalSection {
  titulo: string;
  parrafos: string[];
  lista?: string[];
}

interface LegalPageProps {
  titulo: string;
  resumen: string;
  actualizado: string;
  secciones: LegalSection[];
}

export default function LegalPage({ titulo, resumen, actualizado, secciones }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[#070b12] px-4 py-16 text-gray-200 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="text-[11px] font-black uppercase tracking-[2px] text-[#4ade80]">Cápi · Información legal</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{titulo}</h1>
        <p className="mt-3 text-sm text-gray-400">Última actualización: {actualizado}</p>
        <p className="mt-8 text-base leading-relaxed text-gray-300">{resumen}</p>

        <div className="mt-10 space-y-10">
          {secciones.map((seccion) => (
            <section key={seccion.titulo} className="border-t border-white/10 pt-8">
              <h2 className="text-xl font-bold text-white">{seccion.titulo}</h2>
              {seccion.parrafos.map((parrafo) => (
                <p key={parrafo} className="mt-3 text-sm leading-relaxed text-gray-400">
                  {parrafo}
                </p>
              ))}
              {seccion.lista && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-400">
                  {seccion.lista.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <nav aria-label="Documentos legales" className="mt-14 flex flex-wrap gap-4 border-t border-white/10 pt-8 text-sm">
          <Link href="/privacidad" className="font-bold text-[#60a5fa] hover:text-white">Privacidad</Link>
          <Link href="/tratamiento-datos" className="font-bold text-[#60a5fa] hover:text-white">Tratamiento de datos</Link>
          <Link href="/terminos" className="font-bold text-[#60a5fa] hover:text-white">Términos de uso</Link>
          <Link href="/soporte" className="font-bold text-[#60a5fa] hover:text-white">Soporte</Link>
          <Link href="/" className="font-bold text-gray-400 hover:text-white">Volver al inicio</Link>
        </nav>
      </article>
    </main>
  );
}
