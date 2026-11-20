import type { Metadata } from 'next';
import GuidePage from '@/components/content/GuidePage';
import { guidesBySlug } from '@/lib/content/site-content';
import { guideSchemas } from '@/lib/content/jsonld';

const guide = guidesBySlug['/guias/metas-de-ahorro'];

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
  openGraph: {
    title: guide.title,
    description: guide.description,
    url: guide.slug,
    type: 'article',
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideSchemas(guide)) }} />
      <GuidePage guide={guide} />
    </>
  );
}
