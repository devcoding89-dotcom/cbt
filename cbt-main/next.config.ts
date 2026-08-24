import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The workspace preview is served from https://{port}-{sandbox}.e2b.app
  allowedDevOrigins: ["*.e2b.app", "*.app.github.dev", "localhost"],
  eslint: { ignoreDuringBuilds: false },
  experimental: {
    serverActions: { bodySizeLimit: "12mb" },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
