import type { NextConfig } from 'next';

const apiOrigin = (() => {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    return new URL(raw).origin;
  } catch {
    return 'http://localhost:8000';
  }
})();

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://accounts.google.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin} https://www.googleapis.com https://oauth2.googleapis.com https://accounts.google.com https://www.google-analytics.com https://challenges.cloudflare.com`,
  "frame-src https://accounts.google.com https://challenges.cloudflare.com",
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig: NextConfig = {
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
