/**
 * Builds a fully static copy of the site for GitHub Pages.
 *
 * Output (site/):
 *   index.html, reel.html, src/*         copied from public/
 *   data/categories.json                 { generatedAt, categories: [{name, slug}] }
 *   data/videos/all.json                 latest videos across every channel
 *   data/videos/<slug>.json              latest videos per category
 *
 * The frontend loads these files when they exist and falls back to the
 * Express /api routes otherwise, so local dev keeps working unchanged.
 *
 * Usage:  npx ts-node scripts/build-static.ts
 * Quota:  1 unit per channel (Shorts filtered via the long-form playlist).
 */
/// <reference types="node" />
import fs from "fs";
import path from "path";
import { config } from "../src/config";
import { getLatestVideos } from "../src/aggregator";
import { AggregatorResult } from "../src/types";

const PER_CHANNEL = 10; // videos fetched per channel
const ALL_LIMIT = 300; // videos kept in all.json
const OUT = path.resolve("site");

/**
 * The repo and Actions logs are public. Error messages from the YouTube
 * client are published in the JSON and printed to the log, so scrub the API
 * key out of them defensively even though Google's messages don't normally
 * include it.
 */
function redactKey(text: string): string {
  return config.youtubeApiKey
    ? text.split(config.youtubeApiKey).join("[REDACTED]")
    : text;
}

function writeJson(rel: string, data: unknown) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data));
}

async function main() {
  const generatedAt = new Date().toISOString();

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.cpSync(path.resolve("public"), OUT, { recursive: true });
  fs.copyFileSync(path.join(OUT, "reel.html"), path.join(OUT, "index.html"));

  writeJson("data/categories.json", {
    generatedAt,
    categories: config.categories.map((c) => ({ name: c.name, slug: c.slug })),
  });

  const all: AggregatorResult = { videos: [], errors: [] };

  for (const category of config.categories) {
    const result = await getLatestVideos(category.channels, PER_CHANNEL);
    result.errors = result.errors.map((e) => ({
      ...e,
      message: redactKey(e.message),
    }));
    writeJson(`data/videos/${category.slug}.json`, { generatedAt, ...result });
    all.videos.push(...result.videos);
    all.errors.push(...result.errors);
    console.log(
      `${category.slug.padEnd(16)} ${String(result.videos.length).padStart(4)} videos` +
        (result.errors.length ? `  (${result.errors.length} channel errors)` : "")
    );
  }

  all.videos.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  all.videos = all.videos.slice(0, ALL_LIMIT);
  writeJson("data/videos/all.json", { generatedAt, ...all });

  console.log(
    `\nBuilt ${OUT}: ${config.categories.length} categories, ${all.videos.length} videos in all.json, ${all.errors.length} channel errors`
  );
  for (const e of all.errors) console.log(`  ${e.channelId}: ${e.message}`);
}

main().catch((err) => {
  console.error(redactKey(String(err?.message ?? err)));
  process.exit(1);
});
