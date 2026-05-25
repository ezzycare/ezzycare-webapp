import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  experimental: {
    turbopackFileSystemCacheForBuild: true,
  },

  // eslint: {
  //   ignoreDuringBuilds: true,
  // },

  // typescript: {
  //   ignoreBuildErrors: true,
  // },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
};

export default nextConfig;
