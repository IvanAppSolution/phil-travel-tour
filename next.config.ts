import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "cev72nq5e8.ufs.sh",
      },
      {
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
