## Why

We need a backend service that aggregates the latest videos from a configurable group of YouTube channels and returns them sorted by publish date (newest first). This enables a single API to track multiple channels without manually checking each one.

## What Changes

- Add a Node.js backend service using Express
- Integrate with the YouTube Data API v3 to fetch recent videos per channel
- Support a configurable list of channel IDs
- Expose a REST endpoint that returns videos from all configured channels, sorted by publish date descending
- Include basic error handling and rate-limit awareness for the YouTube API quota

## Capabilities

### New Capabilities

- `youtube-api-client`: Wraps the YouTube Data API v3 to fetch recent videos for a given channel
- `video-aggregator`: Aggregates videos from multiple channels and sorts them by publish date descending
- `rest-api`: Express REST endpoint exposing the aggregated latest-videos feed
- `channel-config`: Configurable list of YouTube channel IDs to track

### Modified Capabilities

_None — this is a greenfield project._

## Impact

- **Dependencies**: `express`, `googleapis` (or `youtube-api-v3-search`), `dotenv` for API key management
- **External APIs**: YouTube Data API v3 — requires a Google API key with YouTube scope
- **Quota**: YouTube API has a daily quota (10,000 units default); each search/list call costs units, so the service must be mindful of call frequency
