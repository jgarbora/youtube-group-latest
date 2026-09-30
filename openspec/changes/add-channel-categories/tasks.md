## 1. Configuration

- [x] 1.1 Create `channels.json` with initial categories and the existing channel IDs
- [x] 1.2 Add `Category` and `ChannelsConfig` types to `src/types.ts`
- [x] 1.3 Rewrite `src/config.ts` to load and validate `channels.json` (schema validation, unique slugs, non-empty channels)
- [x] 1.4 Add helper methods: `getAllChannelIds()` and `getChannelIdsByCategory(slug)`
- [x] 1.5 Remove `YOUTUBE_CHANNEL_IDS` from `.env.example`

## 2. Categories API

- [x] 2.1 Add `GET /api/categories` endpoint in `src/index.ts` returning `{ categories: [{ name, slug }] }`

## 3. Video Filtering by Category

- [x] 3.1 Update `GET /api/videos` route to accept optional `?category` query parameter
- [x] 3.2 Resolve category slug to channel IDs; return 404 for invalid category
- [x] 3.3 Pass filtered channel IDs to the aggregator (all channels when no category specified)

## 4. Verify

- [x] 4.1 Verify TypeScript compiles with no errors
- [x] 4.2 Verify the service starts and `/api/categories` returns the category list
