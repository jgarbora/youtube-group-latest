## Context

The service currently loads channel IDs from a flat `YOUTUBE_CHANNEL_IDS` env var. We need to introduce categories as a grouping mechanism so users can organize channels and filter the video feed by category.

Current code affected:
- `src/config.ts` — loads channel IDs from env var
- `src/aggregator.ts` — takes a flat array of channel IDs
- `src/index.ts` — `/api/videos` endpoint passes all channel IDs to aggregator

## Goals / Non-Goals

**Goals:**
- Replace flat channel list with category-grouped config file
- Expose categories via REST API
- Allow filtering videos by category
- Preserve existing behavior when no category filter is applied

**Non-Goals:**
- No multi-category tagging (one channel = one category)
- No CRUD API for managing categories (edit the JSON file)
- No database — config file is the source of truth

## Decisions

### 1. Use a `channels.json` file for configuration
**Choice**: JSON file at project root, loaded at startup.
**Rationale**: Categories are structured data that doesn't fit well in env vars. JSON is native to Node.js, needs no extra parser, and is easy to validate. **Alternative considered**: YAML — adds a dependency for no real benefit at this scale.

### 2. Config file schema
```json
{
  "categories": [
    {
      "name": "Tech",
      "slug": "tech",
      "channels": ["UCLMPXsvSrhNPN3i9h-u8PYg"]
    }
  ]
}
```
**Rationale**: `slug` is the URL-safe identifier for filtering, `name` is the display label. Keeping them separate allows friendly names like "Science & Tech" while using clean slugs in the API.

### 3. Keep `YOUTUBE_CHANNEL_IDS` env var removed
**Choice**: Remove the env var entirely, not keep it as a fallback.
**Rationale**: Two config sources creates ambiguity. Clean break is better — the migration is simple (move IDs into `channels.json`).

### 4. Aggregator accepts channel IDs array (unchanged interface)
**Choice**: The aggregator function keeps its `getLatestVideos(channelIds, maxResults)` signature. Category resolution happens in the route handler.
**Rationale**: Keeps the aggregator focused on one job. The route handler resolves category → channel IDs, then passes the filtered list to the aggregator.

## Risks / Trade-offs

- **Config file not found at startup** → Throw a clear error with the expected path, same pattern as missing env vars.
- **Malformed JSON** → Validate schema at startup: require at least one category, each with a non-empty slug and channels array. Fail fast with descriptive errors.
- **Duplicate slugs** → Validate uniqueness at startup. Two categories can't share a slug.
