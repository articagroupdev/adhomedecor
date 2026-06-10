import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 180,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aydhomedecor.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
