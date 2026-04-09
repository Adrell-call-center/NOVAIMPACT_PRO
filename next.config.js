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
    // Redirect old ?lang= query URLs to new path-based /blog/[lang]/[slug]
    return [
      {
        source: '/blog/:slug',
        has: [
          { type: 'query', key: 'lang', value: '(?<lang>fr|en)' },
        ],
        destination: '/blog/:lang/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
