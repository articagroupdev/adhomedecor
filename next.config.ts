import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: false,

  staticPageGenerationTimeout: 180,

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    minimumCacheTTL: 2592000,
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aydhomedecor.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options",        value: "SAMEORIGIN" },
          { key: "X-XSS-Protection",       value: "1; mode=block" },
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",     value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
