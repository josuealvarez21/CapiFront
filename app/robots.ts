import type { MetadataRoute } from 'next';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

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
