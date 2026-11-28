import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/app/customers", destination: "/customers", permanent: true },
      {
        source: "/app/customers/:id",
        destination: "/customers/:id",
        permanent: true,
      },
      { source: "/orders", destination: "/app/sales", permanent: true },
      { source: "/orders/:id", destination: "/app/sales/:id", permanent: true },
      {
        source: "/orders/:id/bill",
        destination: "/app/sales/:id/bill",
        permanent: true,
      },
    ];
  },
  output: "standalone",
  serverExternalPackages: ["sharp"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
