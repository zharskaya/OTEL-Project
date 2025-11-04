import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/OTEL-Project' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // @ts-ignore - Force webpack instead of turbopack
  turbopack: false,
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
