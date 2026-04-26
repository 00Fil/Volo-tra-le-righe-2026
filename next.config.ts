import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    workerThreads: true,
  },
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true,
};

export default nextConfig;
