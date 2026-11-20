import type { Metadata } from 'next';
import Landing from '@/components/landing/Landing';
import { landingFaq } from '@/lib/content/site-content';

export const metadata: Metadata = {
  title: 'Finanzas personales: controla ingresos y gastos | Cápi',
  description:
    'Cápi reúne ingresos, gastos, metas y presupuestos en un solo lugar. Registra en segundos, entiende tus hábitos y decide mejor con CapiBot.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Finanzas personales: controla ingresos y gastos | Cápi',
    description: 'Tu hub financiero personal con asistente inteligente y reportes mensuales.',
    url: '/',
    type: 'website',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: landingFaq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Landing />
    </>
  );
}
