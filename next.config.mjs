import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
})({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'],
  },
  experimental: {
    optimizeFonts: true,
    scrollRestoration: true,
  },
});

export default nextConfig;
