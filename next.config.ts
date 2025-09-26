import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/travels',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        hostname: "cev72nq5e8.ufs.sh",
      },
      {
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
