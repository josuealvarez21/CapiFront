import type { MetadataRoute } from 'next';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

const publicRoutes = [
  '',
  '/guia-finanzas-personales',
  '/guias/presupuestos',
  '/guias/metas-de-ahorro',
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
