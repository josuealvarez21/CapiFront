import { NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  const expected = process.env.GSC_VERIFICATION_TOKEN || '';

  if (!expected || token !== expected) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(`google-site-verification: google${token}.txt`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
