import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: 'standalone',
  serverExternalPackages: ['typeorm', 'reflect-metadata', 'pg'],
  experimental: {
    // Disable server-side minification to preserve TypeORM entity class names.
    // TypeORM uses constructor.name for entity metadata resolution, which breaks
    // when class names are mangled (e.g., Assessment -> a).
    serverMinification: false,
  },
  // Belt-and-suspenders: explicitly configure the server-side minimizer to keep
  // class and function names. TypeORM resolves entity metadata by constructor.name
  // at runtime, so mangling those names causes "Entity metadata for X was not found".
  webpack: (config, { isServer }) => {
    if (isServer && Array.isArray(config.optimization?.minimizer)) {
      for (const minimizer of config.optimization.minimizer) {
        // TerserPlugin (webpack default) exposes options.terserOptions
        if (minimizer?.options?.terserOptions) {
          minimizer.options.terserOptions.keep_classnames = true
          minimizer.options.terserOptions.keep_fnames = true
        }
        // SwcJsMinimizerRspackPlugin / next-swc-minify path
        if (minimizer?.options?.minimizerOptions) {
          minimizer.options.minimizerOptions.keep_classnames = true
          minimizer.options.minimizerOptions.keep_fnames = true
        }
      }
    }
    return config
  },
}

export default nextConfig
