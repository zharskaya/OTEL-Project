import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/OTEL-Project' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Empty turbopack config to satisfy Next.js 16+ requirements
  turbopack: {},
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
