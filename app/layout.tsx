import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cápi — Hub Financiero',
  description:
    'Plataforma de gestión de finanzas personales. Controla tu destino financiero con Cápi.',
};

import { AuthProvider } from '../context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-[34rem] w-[34rem] rounded-full bg-[#22c55e] opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[38rem] w-[38rem] rounded-full bg-[#3b82f6] opacity-20 blur-3xl" />
        </div>
        {GOOGLE_CLIENT_ID ? (
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </GoogleOAuthProvider>
        ) : (
          <AuthProvider>
            {children}
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
