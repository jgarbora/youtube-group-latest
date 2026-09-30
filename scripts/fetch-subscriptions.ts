/**
 * Reads a Google Takeout `subscriptions.csv` and enriches every channel with
 * title, description, topic categories and custom URL from the YouTube Data API.
 *
 * Usage:  npx ts-node scripts/fetch-subscriptions.ts [subscriptions.csv] [out.json]
 * Output: scripts/subscriptions.enriched.json (default)
 *
 * Cost: 1 quota unit per batch of 50 channels.
 */
/// <reference types="node" />
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { google } from "googleapis";

dotenv.config();

const apiKey = process.env.YOUTUBE_API_KEY?.trim();
if (!apiKey) {
  console.error("Missing YOUTUBE_API_KEY in .env");
  process.exit(1);
}

const csvPath = path.resolve(process.argv[2] ?? "subscriptions.csv");
const outPath = path.resolve(
  process.argv[3] ?? "scripts/subscriptions.enriched.json"
);

if (!fs.existsSync(csvPath)) {
  console.error(`CSV not found: ${csvPath}`);
  process.exit(1);
}

// Takeout header: "Channel Id,Channel Url,Channel Title"
function parseCsv(text: string): { id: string; title: string }[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  const rows: { id: string; title: string }[] = [];
  for (const line of lines.slice(1)) {
    const cells: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cells.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    cells.push(cur);
    const id = cells[0]?.trim();
    if (id && id.startsWith("UC")) {
      rows.push({ id, title: cells[2]?.trim() ?? "" });
    }
  }
  return rows;
}

export interface EnrichedChannel {
  id: string;
  title: string;
  customUrl: string;
  description: string;
  topics: string[];
  subscriberCount: number | null;
  videoCount: number | null;
  country: string;
}

async function main() {
  const subs = parseCsv(fs.readFileSync(csvPath, "utf-8"));
  console.log(`Read ${subs.length} subscriptions from ${csvPath}`);

  const youtube = google.youtube({ version: "v3", auth: apiKey });
  const byId = new Map<string, EnrichedChannel>();

  for (let i = 0; i < subs.length; i += 50) {
    const batch = subs.slice(i, i + 50);
    const res = await youtube.channels.list({
      part: ["snippet", "topicDetails", "statistics"],
      id: batch.map((s) => s.id),
      maxResults: 50,
    });
    for (const item of res.data.items ?? []) {
      if (!item.id) continue;
      byId.set(item.id, {
        id: item.id,
        title: item.snippet?.title ?? "",
        customUrl: item.snippet?.customUrl ?? "",
        description: (item.snippet?.description ?? "").slice(0, 600),
        topics: (item.topicDetails?.topicCategories ?? []).map((u) =>
          decodeURIComponent(u.split("/wiki/")[1] ?? u)
        ),
        subscriberCount: item.statistics?.subscriberCount
          ? Number(item.statistics.subscriberCount)
          : null,
        videoCount: item.statistics?.videoCount
          ? Number(item.statistics.videoCount)
          : null,
        country: item.snippet?.country ?? "",
      });
    }
    console.log(`Fetched ${Math.min(i + 50, subs.length)}/${subs.length}`);
  }

  // Keep CSV order; fall back to CSV title for channels the API didn't return
  // (terminated or hidden channels).
  const enriched: EnrichedChannel[] = subs.map(
    (s) =>
      byId.get(s.id) ?? {
        id: s.id,
        title: s.title,
        customUrl: "",
        description: "",
        topics: [],
        subscriberCount: null,
        videoCount: null,
        country: "",
      }
  );

  const missing = enriched.filter((c) => !byId.has(c.id)).length;
  fs.writeFileSync(outPath, JSON.stringify(enriched, null, 2));
  console.log(
    `Wrote ${enriched.length} channels to ${outPath} (${missing} not returned by API)`
  );
}

main().catch((err) => {
  console.error(err?.message ?? err);
  process.exit(1);
});
