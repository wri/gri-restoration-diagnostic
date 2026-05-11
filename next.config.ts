import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: 'standalone',
  serverExternalPackages: ['typeorm', 'reflect-metadata', 'pg'],
  experimental: {},
  // Disable server-side minification entirely so TypeORM entity class names are
  // preserved. TypeORM resolves entity metadata by constructor.name at runtime —
  // if class names are mangled (e.g. Assessment -> c, Contributor -> l) the
  // lookup fails with "Entity metadata for X was not found". Server bundles are
  // never sent to the browser so minification has no benefit there anyway.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.minimize = false
    }
    return config
  },
}

export default nextConfig
