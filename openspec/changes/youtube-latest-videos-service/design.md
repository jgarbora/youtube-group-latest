## Context

This is a greenfield Node.js project. There is no existing codebase beyond the OpenSpec scaffolding. The service needs to integrate with the YouTube Data API v3 to fetch recent videos from a set of configured channels and expose them via a REST API sorted by publish date descending.

## Goals / Non-Goals

**Goals:**
- Provide a single REST endpoint that returns the latest videos from multiple YouTube channels, sorted newest-first
- Keep channel configuration simple and file-based (environment variable or JSON config)
- Handle YouTube API errors and quota limits gracefully
- Keep the service lightweight and easy to deploy

**Non-Goals:**
- No database or persistent storage — this is a read-through service
- No authentication/authorization on the REST API (can be added later)
- No caching layer in v1 (future enhancement)
- No frontend or UI
- No webhook/push-based updates — polling only

## Decisions

### 1. Use Express for the HTTP server
**Choice**: Express.js
**Rationale**: Minimal, well-understood, and sufficient for a single-endpoint service. Alternatives like Fastify or Koa add complexity without meaningful benefit here.

### 2. Use the `googleapis` npm package for YouTube API access
**Choice**: Official `googleapis` SDK
**Rationale**: Maintained by Google, supports all YouTube Data API v3 endpoints, handles auth. Alternative: raw HTTP calls — but the SDK handles retries and parameter validation.

### 3. Use `playlistItems.list` on each channel's "uploads" playlist
**Choice**: Fetch each channel's uploads playlist via `channels.list`, then use `playlistItems.list` to get recent videos.
**Rationale**: This is the most quota-efficient way to get a channel's latest uploads (costs 1 unit per call). The `search.list` endpoint costs 100 units per call, which would burn through the daily quota quickly. **Alternatives considered**: `search.list` (too expensive), RSS feeds (unreliable timing, no API key needed but limited metadata).

### 4. Channel configuration via environment variable
**Choice**: `YOUTUBE_CHANNEL_IDS` env var as a comma-separated list, loaded via `dotenv`.
**Rationale**: Simple, twelve-factor compatible, easy to change per deployment. A JSON config file is overkill for a list of IDs.

### 5. Project structure
```
src/
  index.ts          — Express server entry point
  config.ts         — Loads env vars and validates config
  youtube.ts        — YouTube API client (fetch uploads for a channel)
  aggregator.ts     — Fetches all channels, merges and sorts videos
  types.ts          — Shared TypeScript types
package.json
tsconfig.json
.env.example
```
**Choice**: TypeScript over plain JavaScript for type safety and better DX.

## Risks / Trade-offs

- **YouTube API quota** → Each channel costs ~2 API units per fetch (1 for channel lookup + 1 for playlist items). With 50 channels, that's ~100 units per request. Mitigation: document quota math, consider adding a simple in-memory cache in a future iteration.
- **No caching** → Every incoming request hits the YouTube API. Mitigation: acceptable for v1 with low traffic; caching is a clear next step.
- **Rate limiting from concurrent requests** → If many users hit the endpoint simultaneously, YouTube API calls multiply. Mitigation: keep max results per channel small (default 10), document this limitation.
- **Channel ID discovery** → Users need to know YouTube channel IDs, which aren't always obvious. Mitigation: document how to find channel IDs.
