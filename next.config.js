/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  eslint: {
    // ESLint is checked locally; ignore during production builds
    ignoreDuringBuilds: true,
  },
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
  async headers() {
    return [
      {
        source: '/assets/video/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-transform',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
        ],
      },
      {
        source: '/assets/imgs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/gsap-plugins/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/gsap-old/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
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
