/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  async generateBuildId() {
    return 'toolhub-build-' + Date.now();
  }
};

module.exports = nextConfig;