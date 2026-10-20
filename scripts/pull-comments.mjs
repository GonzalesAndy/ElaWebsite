/**
 * Downloads the client's review comments to feedback/comments.json and prints the open ones,
 * grouped by page and language.
 *
 *   REVIEW_ENDPOINT=https://aurea-review.<you>.workers.dev REVIEW_KEY=… npm run comments
 *
 * Both values can also live in .env.local (gitignored).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const env = { ...process.env };
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*"?(.*?)"?\s*$/);
    if (match && !env[match[1]]) env[match[1]] = match[2];
  }
}

const endpoint = (env.REVIEW_ENDPOINT || env.NEXT_PUBLIC_REVIEW_ENDPOINT || "").replace(/\/$/, "");
if (!endpoint || !env.REVIEW_KEY) {
  console.error("Set REVIEW_ENDPOINT and REVIEW_KEY (environment or .env.local).");
  process.exit(1);
}

const res = await fetch(`${endpoint}/comments`, { headers: { authorization: `Bearer ${env.REVIEW_KEY}` } });
if (!res.ok) {
  console.error(`Request failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}
const comments = (await res.json()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

mkdirSync("feedback", { recursive: true });
writeFileSync("feedback/comments.json", `${JSON.stringify(comments, null, 2)}\n`);

const open = comments.filter((c) => c.status === "open");
console.log(`${comments.length} comments (${open.length} open) → feedback/comments.json\n`);

const groups = Map.groupBy(open, (c) => `${c.page}  [${c.locale.toUpperCase()}]`);
for (const [group, list] of [...groups].sort()) {
  console.log(group);
  for (const c of list) {
    const about = c.quote ? `"${c.quote}"` : c.snippet || c.src || c.selector;
    console.log(`  #${c.id} <${c.tag}> ${about.slice(0, 90)}`);
    console.log(`    ${c.text.replace(/\n/g, "\n    ")}`);
  }
  console.log();
}
