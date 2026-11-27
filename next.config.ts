import type { NextConfig } from 'next';
import { API_URL } from './lib/public-urls';

const apiOrigin = API_URL;

const esDesarrollo = process.env.NODE_ENV === 'development';

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(esDesarrollo ? ["'unsafe-eval'"] : []),
  'https://www.googletagmanager.com',
  'https://accounts.google.com',
  'https://challenges.cloudflare.com',
].join(' ');

const connectSrc = [
  "'self'",
  apiOrigin,
  'https://www.googleapis.com',
  'https://oauth2.googleapis.com',
  'https://accounts.google.com',
  'https://www.google-analytics.com',
  'https://challenges.cloudflare.com',
  ...(esDesarrollo ? ['ws://127.0.0.1:3000', 'ws://localhost:3000'] : []),
].join(' ');

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src ${connectSrc}`,
  "frame-src https://accounts.google.com https://challenges.cloudflare.com",
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=(self)' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },
    ];
  },
  async rewrites() {
    // Verificación de Search Console sin subir un archivo con token al repo.
    return [{ source: '/google:token.txt', destination: '/api/gsc-verify?token=:token' }];
  },
};

export default nextConfig;
