import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: 'standalone',
  serverExternalPackages: ['typeorm', 'reflect-metadata', 'pg'],
}

export default nextConfig
