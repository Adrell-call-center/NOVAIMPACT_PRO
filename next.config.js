/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.pexels.com', 'images.unsplash.com'],
  },
  async redirects() {
    return [
      {
        source: '/blog/:slug((?!fr|en)[^/]+)',
        destination: '/blog/fr/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
