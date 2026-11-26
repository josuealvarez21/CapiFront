import type { GuideContent } from './site-content';
import { SITE_URL } from '@/lib/public-urls';

const siteUrl = SITE_URL;

export function guideSchemas(guide: GuideContent) {
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Guías', item: `${siteUrl}/guia-finanzas-personales` },
    { '@type': 'ListItem', position: 3, name: guide.h1, item: `${siteUrl}${guide.slug}` },
  ];

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ];
}
