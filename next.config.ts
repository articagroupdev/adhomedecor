import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  compress: false,

  staticPageGenerationTimeout: 180,

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
