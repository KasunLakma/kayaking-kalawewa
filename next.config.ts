import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/expeditions',
        destination: '/packages',
        permanent: false,
      },
      {
        source: '/heritage',
        destination: '/#about',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

