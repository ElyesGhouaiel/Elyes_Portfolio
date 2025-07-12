import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  api: {
    bodyParser: {
      sizeLimit: '1000mb'
    }
  }
};

export default nextConfig;