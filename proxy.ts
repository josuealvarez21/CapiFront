import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0] ?? '';
  const local = ['localhost', '127.0.0.1'].includes(host);
  const proto = request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '');

  if (!local && proto === 'http' && process.env.NODE_ENV === 'production') {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  const privatePath = /^\/(app|admin|api|login|register|forgot-password|reset-password)(\/|$)/.test(
    request.nextUrl.pathname,
  );
  if (privatePath) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, follow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
