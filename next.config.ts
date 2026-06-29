import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['*', 'harmful-operable-unseemly.ngrok-free.dev'],
};

export default nextConfig;
