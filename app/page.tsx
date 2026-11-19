import type { Metadata } from 'next';
import Landing from '@/components/landing/Landing';

export const metadata: Metadata = {
  title: 'Cápi — Controla tu destino financiero',
  description:
    'Gestiona ingresos, gastos, metas y presupuestos en un solo lugar. Con CapiBot, que también te entiende cuando le hablas.',
  openGraph: {
    title: 'Cápi — Controla tu destino financiero',
    description: 'Tu hub financiero personal con asistente inteligente y reportes mensuales.',
    locale: 'es_CO',
    type: 'website',
  },
};

export default function HomePage() {
  return <Landing />;
}
