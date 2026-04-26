import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    workerThreads: true,
  },
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true,
};

export default nextConfig;
