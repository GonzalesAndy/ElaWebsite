// Cleans the public-domain olive branch clip art into a single-colour SVG for CSS masks.
// The white shapes in the original are leaf veins: they become transparent cut-outs.
// Usage: node scripts/clean-olive-branch.mjs [source.svg]
import { readFile, writeFile } from "node:fs/promises";

const SRC = process.argv[2] ?? "assets/olive-branch-source.svg";
const OUT = "public/images/olive-branch.svg";

const src = await readFile(SRC, "utf8");
const paths = [...src.matchAll(/<path\b[^>]*\/>/g)].map((m) => m[0]);
const attr = (p, name) => p.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

const main = paths.find((p) => attr(p, "id") === "path609");
if (!main) throw new Error("main branch shape (path609) not found");

// Keep vein shapes that are near-white and more than a stray speck.
const isWhite = (fill) => /^#(f[0-9a-f]{5}|fff)$/i.test(fill ?? "");
const veins = paths.filter((p) => isWhite(attr(p, "fill")) && attr(p, "d").length > 40);
const vein = (p) => {
  const t = attr(p, "transform");
  return `<path d="${attr(p, "d")}"${t ? ` transform="${t}"` : ""}/>`;
};

const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 510 457">
  <!-- Olive branch by Angelo Gemmi, public domain (openclipart.org/detail/12520). Veins are cut out. -->
  <mask id="veins" maskUnits="userSpaceOnUse" x="0" y="0" width="510" height="457">
    <rect width="510" height="457" fill="#fff"/>
    <g fill="#000">${veins.map(vein).join("")}</g>
  </mask>
  <path mask="url(#veins)" fill="#000" d="${attr(main, "d")}"/>
</svg>
`;

await writeFile(OUT, out);
console.log(`${OUT}: ${veins.length} veins cut out of ${paths.length} source paths, ${(out.length / 1024).toFixed(1)} KB`);
