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
    // Redirect old /blog/[lang]/[slug] URLs to new /blog/[slug]?lang= format
    return [
      {
        source: '/blog/:lang(fr|en)/:slug',
        destination: '/blog/:slug?lang=:lang',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
