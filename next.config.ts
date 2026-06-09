import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
