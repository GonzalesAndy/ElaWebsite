/**
 * The site can be served from a sub-folder (GitHub Pages: /ElaWebsite). Plain <a> links, <video>
 * sources and unoptimised images don't get that prefix automatically, so internal paths go through
 * withBase(). Locally the base path is empty and nothing changes.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string) {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
