import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/public-urls';

const siteUrl = SITE_URL;

const crawlers = ['Googlebot', 'OAI-SearchBot', 'GPTBot', 'ClaudeBot', 'PerplexityBot'];
const disallow = ['/admin', '/api', '/app', '/dashboard', '/login', '/register', '/forgot-password', '/reset-password'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...crawlers.map((userAgent) => ({ userAgent, allow: '/', disallow })),
      { userAgent: '*', allow: '/', disallow },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
