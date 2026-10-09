import type { NextConfig } from "next";

/*
 * Static export for GitHub Pages: `npm run build` writes plain files to /out.
 * NEXT_PUBLIC_BASE_PATH is the sub-folder the site is served from (set by the deploy workflow to
 * /ElaWebsite); leave it empty for local development or a custom domain.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true, // en/journey/index.html, which GitHub Pages serves for /en/journey/
  images: { unoptimized: true }, // photos are already optimised WebP files
};

export default nextConfig;
