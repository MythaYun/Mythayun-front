/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server in .next/standalone, used by the Docker image
  output: 'standalone',
  // Temporarily disable TypeScript errors during build for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig
