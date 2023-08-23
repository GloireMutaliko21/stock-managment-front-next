/** @type {import('next').NextConfig} */

const securityHeaders = require('./headers');

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: ['localhost', 'ebenezer-shop-api.herokuapp.com'],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = withPWA({ ...nextConfig });
