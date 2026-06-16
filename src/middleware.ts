export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/reports/:path*', '/analytics/:path*', '/users/:path*', '/settings/:path*'],
};
