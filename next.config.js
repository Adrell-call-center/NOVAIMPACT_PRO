/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'img.youtube.com',
      'i.ytimg.com',
      'i.vimeocdn.com',
      'vumbnail.com',
      'cdn.coverr.co',
      'storage.googleapis.com',
    ],
    formats: ['image/webp', 'image/avif'],
    // Disable blur placeholder for sharper images
    minimumCacheTTL: 604800, // 1 week
  },
  async redirects() {
    return [
      // Redirect old /blog/fr/slug and /blog/en/slug → clean /blog/slug
      {
        source: '/blog/:lang(fr|en)/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      // Redirect old /blog/slug?lang=fr → clean /blog/slug
      {
        source: '/blog/:slug*',
        has: [{ type: 'query', key: 'lang' }],
        destination: '/blog/:slug*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
