import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/public-urls';

const siteUrl = SITE_URL;

const publicRoutes = [
  '',
  '/guia-finanzas-personales',
  '/guias/presupuestos',
  '/guias/metas-de-ahorro',
  '/privacidad',
  '/tratamiento-datos',
  '/terminos',
  '/soporte',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
