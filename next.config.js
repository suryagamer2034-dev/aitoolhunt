/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      '/api/tools': ['./data/ai-tools.json'],
    },
  },
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig
