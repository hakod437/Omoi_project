import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'myanimelist.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.anili.st',
        pathname: '/**',
      },
    ],
  },
  // Résoudre le problème d'origine des Server Actions
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '127.0.0.1:45305',
    'localhost:45305'
  ]
};

export default nextConfig;
