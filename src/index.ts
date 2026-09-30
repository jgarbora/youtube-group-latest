import express from "express";
import path from "path";
import { config, getAllChannelIds, getChannelIdsByCategory } from "./config";
import { getLatestVideos } from "./aggregator";

const app = express();

// Serve static frontend files
app.use(express.static(path.resolve(process.cwd(), "public")));

// Redirect root to the reel UI
app.get("/", (_req, res) => {
  res.redirect("/reel.html");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/categories", (_req, res) => {
  res.json({
    categories: config.categories.map((c) => ({
      name: c.name,
      slug: c.slug,
    })),
  });
});

app.get("/api/videos", async (req, res) => {
  const categorySlug = req.query.category as string | undefined;

  let channelIds: string[];

  if (categorySlug) {
    const ids = getChannelIdsByCategory(categorySlug);
    if (!ids) {
      res
        .status(404)
        .json({ error: `Category not found: ${categorySlug}` });
      return;
    }
    channelIds = ids;
  } else {
    channelIds = getAllChannelIds();
  }

  if (channelIds.length === 0) {
    res.status(500).json({ error: "No channels configured" });
    return;
  }

  const maxResults = Math.min(
    Math.max(parseInt(req.query.maxResults as string, 10) || 10, 1),
    50
  );

  try {
    const result = await getLatestVideos(channelIds, maxResults);

    if (
      result.videos.length === 0 &&
      result.errors.length > 0 &&
      result.errors.some((e) => e.message.includes("quota exceeded"))
    ) {
      res.status(503).json({ error: "YouTube API quota exceeded" });
      return;
    }

    res.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ error: message });
  }
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(
    `Tracking ${getAllChannelIds().length} channel(s) across ${config.categories.length} category/categories`
  );
});
