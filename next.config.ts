import type { NextConfig } from "next";

/*
 * Static export (hosted on Cloudflare, see wrangler.toml): `npm run build` writes plain files to /out.
 * NEXT_PUBLIC_BASE_PATH is the sub-folder the site is served from, if any; empty on elarepka.com.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true, // en/journey/index.html, served for /en/journey/
  images: { unoptimized: true }, // photos are already optimised WebP files
};

export default nextConfig;
