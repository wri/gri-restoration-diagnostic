import type { NextConfig } from 'next'
import webpack from 'webpack'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Suppress TypeORM warnings for unused database drivers
    config.plugins = [
      ...config.plugins,
      new webpack.IgnorePlugin({
        resourceRegExp: /^(pg-native|mysql|mysql2|mssql|oracledb|mongodb|sql\.js|sqlite3|better-sqlite3|ioredis|redis|typeorm-aurora-data-api-driver|@sap\/hana-client(\/.*)?|hdb-pool|spanner|@google-cloud\/spanner|react-native-sqlite-storage)(\/.*)?$/,
      }),
      // Suppress "Critical dependency: the request of a dependency is an expression" warnings from TypeORM
      new webpack.ContextReplacementPlugin(
        /typeorm[\\/](connection|util|platform)$/,
        (context: { dependencies: { critical: null }[] }) => {
          context.dependencies.forEach((dependency) => {
            dependency.critical = null
          })
        }
      ),
      // Suppress "Critical dependency" warning from app-root-path (TypeORM dependency)
      new webpack.ContextReplacementPlugin(
        /app-root-path[\\/]lib$/,
        (context: { dependencies: { critical: null }[] }) => {
          context.dependencies.forEach((dependency) => {
            dependency.critical = null
          })
        }
      ),
    ]

    // Provide empty fallbacks for browser builds
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          fs: false,
          net: false,
          tls: false,
          dns: false,
          child_process: false,
          // TypeORM unused database drivers
          'pg-native': false,
          'mysql': false,
          'mysql2': false,
          'mssql': false,
          'oracledb': false,
          'mongodb': false,
          'sql.js': false,
          'sqlite3': false,
          'better-sqlite3': false,
          'ioredis': false,
          'redis': false,
          'typeorm-aurora-data-api-driver': false,
          '@sap/hana-client': false,
          'hdb-pool': false,
          'spanner': false,
          '@google-cloud/spanner': false,
          'react-native-sqlite-storage': false,
        },
      }
    }

    return config
  },
}

export default nextConfig
