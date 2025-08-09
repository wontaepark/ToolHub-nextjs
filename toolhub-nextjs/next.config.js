const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  async generateBuildId() {
    return 'toolhub-build-' + Date.now();
  }
};

module.exports = withNextIntl(nextConfig);