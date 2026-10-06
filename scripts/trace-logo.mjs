// Traces Elena's monogram into public/images/logo-er.svg (single colour, follows currentColor).
// Works with transparent PNGs or images on a flat background (the background colour is sampled from the corners).
// Usage: node scripts/trace-logo.mjs [source] [weight] [output]
//   weight: 0 = as drawn, higher = bolder strokes (default 0.6)
import sharp from "sharp";
import potrace from "potrace";
import { writeFile } from "node:fs/promises";

const SRC = process.argv[2] ?? "assets/logo-er-source-large.webp";
const WEIGHT = Number(process.argv[3] ?? 0.6);
const OUT = process.argv[4] ?? "public/images/logo-er.svg";
const SCALE = 3;

// 1. Build a coverage mask: 255 = logo, 0 = background.
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const px = (x, y) => (y * width + x) * 4;
const hasAlpha = (await sharp(SRC).metadata()).hasAlpha;

const corners = [px(2, 2), px(width - 3, 2), px(2, height - 3), px(width - 3, height - 3)];
const bg = [0, 1, 2].map((c) => corners.reduce((s, i) => s + data[i + c], 0) / corners.length);

const mask = Buffer.alloc(width * height);
let maxDist = 0;
const dists = new Float32Array(width * height);
for (let i = 0; i < width * height; i++) {
  const o = i * 4;
  const d = hasAlpha
    ? data[o + 3]
    : Math.hypot(data[o] - bg[0], data[o + 1] - bg[1], data[o + 2] - bg[2]);
  dists[i] = d;
  if (d > maxDist) maxDist = d;
}
// Soft ramp: anything below the noise floor is background, the darkest strokes are full coverage.
const floor = hasAlpha ? 0 : maxDist * 0.08;
let r = 0, g = 0, b = 0, n = 0;
for (let i = 0; i < dists.length; i++) {
  const v = Math.max(0, Math.min(1, (dists[i] - floor) / (maxDist * 0.55 - floor)));
  mask[i] = Math.round(v * 255);
  if (v > 0.9) {
    r += data[i * 4]; g += data[i * 4 + 1]; b += data[i * 4 + 2]; n++;
  }
}
const hex = "#" + [r, g, b].map((v) => Math.round(v / n).toString(16).padStart(2, "0")).join("");

// Thicken the E's top and bottom bars (pixel positions measured on logo-er-source-large.webp).
// Each bar copies an existing row of the bar into extra rows, keeping its outer edge in place.
const E_BARS = [
  { name: "top", fromRow: 263, rows: [264, 265, 266, 267], x: [605, 778] },
  { name: "bottom", fromRow: 608, rows: [606, 605, 604, 603], x: [602, 754] },
];
if (SRC.endsWith("logo-er-source-large.webp")) {
  for (const bar of E_BARS) {
    for (let x = bar.x[0]; x <= bar.x[1]; x++) {
      const v = mask[bar.fromRow * width + x];
      for (const y of bar.rows) mask[y * width + x] = Math.max(mask[y * width + x], v);
    }
  }
}

// 2. Trim to the logo, upscale smoothly, and embolden by lowering the trace threshold.
const trimmed = await sharp(mask, { raw: { width, height, channels: 1 } }).png().trim({ threshold: 30 }).toBuffer();
const meta = await sharp(trimmed).metadata();
const big = await sharp(trimmed)
  .resize(meta.width * SCALE, meta.height * SCALE, { kernel: "lanczos3" })
  .blur(1 + WEIGHT * 1.5)
  .negate()
  .png()
  .toBuffer();

const threshold = Math.round(200 - WEIGHT * 60); // on the negated image: higher = more ink kept
const svg = await new Promise((resolve, reject) =>
  potrace.trace(
    big,
    { threshold, turdSize: 60, optCurve: true, optTolerance: 0.3, alphaMax: 1.0, color: "#000", background: "transparent" },
    (err, out) => (err ? reject(err) : resolve(out)),
  ),
);

// 3. Make the SVG responsive and recolourable.
const w = meta.width * SCALE;
const h = meta.height * SCALE;
const clean = svg
  .replace(/<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Aurea · Elena Repka">`)
  .replace(/<rect[^>]*\/>/, "")
  .replace(/fill="[^"]*"/g, 'fill="currentColor"');

await writeFile(OUT, clean);
console.log(`traced ${meta.width}x${meta.height} @${SCALE}x → ${OUT}  viewBox ${w}x${h}, colour ${hex}, ${(clean.length / 1024).toFixed(1)} KB`);
