import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: 'standalone',
  serverExternalPackages: ['typeorm', 'reflect-metadata', 'pg'],
  experimental: {},
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Keep every crawler and AI/LLM indexer out. This header covers
          // fetchers that ignore robots.txt (the /robots.txt route handles
          // the well-behaved ones); `noai, noimageai` are the proposed
          // directives for blocking AI training use of content.
          {
            key: 'X-Robots-Tag',
            value:
              'noindex, nofollow, noarchive, noimageindex, nosnippet, noai, noimageai',
          },
        ],
      },
    ]
  },
  // Disable server-side minification so TypeORM entity class names are preserved.
  // TypeORM resolves entity metadata by constructor.name at runtime — if class
  // names are mangled (e.g. Assessment -> c, Contributor -> l) the lookup fails
  // with "Entity metadata for X was not found". The tradeoff is slightly larger
  // standalone output and marginally higher memory usage, but correctness requires
  // stable class names and there is no straightforward way to make the SWC
  // minimizer keep them without disabling the pass entirely.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.minimize = false
    }
    return config
  },
}

export default nextConfig
