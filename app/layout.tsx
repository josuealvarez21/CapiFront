import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { MotionConfig } from 'framer-motion';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryProvider } from '@/components/providers/QueryProvider';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Finanzas personales: controla ingresos y gastos | Cápi',
    template: '%s | Cápi',
  },
  description:
    'Cápi reúne ingresos, gastos, metas y presupuestos en un solo lugar. Registra en segundos, entiende tus hábitos y decide mejor con CapiBot.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: siteUrl,
    siteName: 'Cápi',
    title: 'Finanzas personales: controla ingresos y gastos | Cápi',
    description: 'Tu hub financiero personal con asistente inteligente y reportes mensuales.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Cápi, finanzas personales' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finanzas personales: controla ingresos y gastos | Cápi',
    description: 'Registra, entiende y mejora tus finanzas con Cápi.',
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cápi',
  url: siteUrl,
  description: 'Plataforma de gestión de finanzas personales con asistente de IA.',
  sameAs: [],
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Cápi',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: siteUrl,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, softwareSchema]) }}
        />
        <GoogleAnalytics />
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-[34rem] w-[34rem] rounded-full bg-[#22c55e] opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[38rem] w-[38rem] rounded-full bg-[#3b82f6] opacity-20 blur-3xl" />
        </div>
        <MotionConfig reducedMotion="user">
          {GOOGLE_CLIENT_ID ? (
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <QueryProvider>
                <AuthProvider>{children}</AuthProvider>
              </QueryProvider>
            </GoogleOAuthProvider>
          ) : (
            <QueryProvider>
              <AuthProvider>{children}</AuthProvider>
            </QueryProvider>
          )}
        </MotionConfig>
      </body>
    </html>
  );
}
