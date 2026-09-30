/**
 * Builds channels.json from a categorization map.
 *
 * Input:  scripts/categorization.json
 *         { "categories": ["surf", "kite", ...],
 *           "assignments": { "<channelId>": "surf", ... } }
 * Output: channels.json in the shape src/config.ts expects. Categories with
 *         no channels are dropped (config.ts rejects empty categories).
 *
 * Usage:  npx ts-node scripts/build-channels-json.ts
 */
/// <reference types="node" />
import fs from "fs";
import path from "path";

interface Categorization {
  categories: string[];
  assignments: Record<string, string>;
}

const inPath = path.resolve("scripts/categorization.json");
const outPath = path.resolve("channels.json");

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const input: Categorization = JSON.parse(fs.readFileSync(inPath, "utf-8"));

const known = new Set(input.categories);
const buckets = new Map<string, string[]>();
for (const name of input.categories) buckets.set(name, []);

const unknown: string[] = [];
for (const [channelId, category] of Object.entries(input.assignments)) {
  if (!known.has(category)) {
    unknown.push(`${channelId} -> "${category}"`);
    continue;
  }
  buckets.get(category)!.push(channelId);
}
if (unknown.length) {
  console.error("Assignments to unknown categories:\n  " + unknown.join("\n  "));
  process.exit(1);
}

const seen = new Set<string>();
const categories = input.categories
  .map((name) => ({ name, slug: slugify(name), channels: buckets.get(name)! }))
  .filter((c) => c.channels.length > 0);

for (const c of categories) {
  if (seen.has(c.slug)) {
    console.error(`Duplicate slug after slugify: ${c.slug}`);
    process.exit(1);
  }
  seen.add(c.slug);
}

fs.writeFileSync(outPath, JSON.stringify({ categories }, null, 2) + "\n");

const total = categories.reduce((n, c) => n + c.channels.length, 0);
console.log(`Wrote ${outPath}: ${total} channels in ${categories.length} categories`);
for (const c of categories) console.log(`  ${c.name.padEnd(16)} ${c.channels.length}`);
const empty = input.categories.filter((n) => buckets.get(n)!.length === 0);
if (empty.length) console.log(`Dropped empty categories: ${empty.join(", ")}`);
