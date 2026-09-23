import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Menghasilkan server minimal di .next/standalone
  // supaya image Docker jauh lebih kecil.
  output: "standalone",
};

export default nextConfig;
