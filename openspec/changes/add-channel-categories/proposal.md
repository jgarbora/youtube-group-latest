## Why

Channels are currently a flat list with no organization. As more channels are tracked, users need a way to group them into categories (e.g., "Tech", "Music") and fetch videos filtered by category.

## What Changes

- **BREAKING**: Replace `YOUTUBE_CHANNEL_IDS` env var with a `channels.json` config file that maps categories to channel IDs
- Add a `GET /api/categories` endpoint returning the list of available categories
- Add `?category=<slug>` query parameter to `GET /api/videos` to filter by category
- Return 404 when an invalid category slug is provided
- Each channel belongs to exactly one category (no multi-category tagging)

## Capabilities

### New Capabilities

- `category-config`: Load and validate category-to-channel mappings from a `channels.json` config file
- `categories-api`: `GET /api/categories` endpoint returning available categories

### Modified Capabilities

- `channel-config`: Channel IDs now come from `channels.json` grouped by category instead of a flat env var
- `rest-api`: `GET /api/videos` gains a `?category` filter parameter; invalid category returns 404

## Impact

- **Config**: `YOUTUBE_CHANNEL_IDS` env var removed, replaced by `channels.json` file
- **API**: New endpoint `/api/categories`; existing `/api/videos` gains optional `?category` param
- **Code**: `src/config.ts` rewritten to load from JSON file; `src/index.ts` and `src/aggregator.ts` updated for category filtering
