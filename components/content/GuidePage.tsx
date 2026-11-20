import Link from 'next/link';
import FaqSection from '@/components/landing/FaqSection';
import KeyPoints from '@/components/landing/KeyPoints';
import ShareButtons from '@/components/landing/ShareButtons';
import type { GuideContent } from '@/lib/content/site-content';

interface GuidePageProps {
  guide: GuideContent;
}

export default function GuidePage({ guide }: GuidePageProps) {
  return (
    <div className="min-h-screen bg-[#090d16] px-4 pb-24 pt-10 text-white sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <nav aria-label="Ruta de navegación" className="mb-8 text-xs text-gray-500">
          <Link href="/" className="hover:text-white">
            Inicio
          </Link>
          {' / '}
          <Link href="/guia-finanzas-personales" className="hover:text-white">
            Guías
          </Link>
          {guide.parent ? ` / ${guide.slug.split('/').pop()}` : ''}
        </nav>

        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{guide.h1}</h1>
        <p className="mt-6 text-base leading-relaxed text-gray-300 sm:text-lg">{guide.intro}</p>

        <KeyPoints items={guide.takeaways} title="Puntos clave / TL;DR" />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-2xl bg-[#22c55e] px-5 py-3 text-sm font-black text-[#090d16]"
          >
            Crear cuenta gratis
          </Link>
          <Link
            href="/app"
            className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-black text-white"
          >
            Ir al dashboard
          </Link>
        </div>

        {guide.sections.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-4 space-y-2">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-gray-300">
                    <span aria-hidden="true" className="text-[#4ade80]">
                      •
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.table && (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <thead className="bg-white/5 text-gray-200">
                    <tr>
                      {section.table.headers.map((header) => (
                        <th key={header} scope="col" className="px-4 py-3 font-bold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row.join('-')} className="border-t border-white/10 text-gray-300">
                        {row.map((cell, index) => (
                          <td key={`${cell}-${index}`} className="px-4 py-3">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}

        {guide.slug === '/guia-finanzas-personales' && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">Guías relacionadas</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/guias/presupuestos" className="text-[#4ade80] hover:underline">
                  Cómo crear un presupuesto mensual por categorías
                </Link>
              </li>
              <li>
                <Link href="/guias/metas-de-ahorro" className="text-[#4ade80] hover:underline">
                  Cómo fijar metas de ahorro y calcular aportes
                </Link>
              </li>
            </ul>
          </section>
        )}

        <FaqSection items={guide.faq} />
        <ShareButtons title={guide.h1} path={guide.slug} />
      </article>
    </div>
  );
}
