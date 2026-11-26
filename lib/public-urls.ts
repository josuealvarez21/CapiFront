/**
 * URLs públicas canónicas del proyecto.
 *
 * En producción usamos los dominios reales como fallback para que un build
 * sin variables de entorno no publique canonical/sitemap/API apuntando a
 * localhost. Las variables siguen teniendo prioridad cuando están definidas.
 */

const PRODUCTION_SITE_URL = 'https://capi-front-ten.vercel.app';
const PRODUCTION_API_URL = 'https://capibackend-2.onrender.com';

function normalizeOrigin(value: string | undefined, fallback: string): string {
  const candidate = (value || '').trim() || fallback;
  try {
    return new URL(candidate).origin;
  } catch {
    return fallback;
  }
}

const esProduccion = process.env.NODE_ENV === 'production';

export const SITE_URL = normalizeOrigin(
  process.env.NEXT_PUBLIC_SITE_URL,
  esProduccion ? PRODUCTION_SITE_URL : 'http://localhost:3000',
);

export const API_URL = normalizeOrigin(
  process.env.NEXT_PUBLIC_API_URL,
  esProduccion ? PRODUCTION_API_URL : 'http://localhost:8000',
);
