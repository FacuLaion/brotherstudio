import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for VPS deploy (PM2 + Nginx reverse proxy).
  output: "standalone",

  // Allow LAN/dev origins to load /_next dev resources (only matters in `next dev`).
  // For a Cloudflare tunnel, add its host here too, e.g. "xxxx.trycloudflare.com".
  allowedDevOrigins: ["192.168.1.39"],
};

export default nextConfig;
