## 1. Project Setup

- [x] 1.1 Initialize Node.js project with `npm init` and create `package.json`
- [x] 1.2 Install dependencies: `express`, `googleapis`, `dotenv`
- [x] 1.3 Install dev dependencies: `typescript`, `ts-node`, `@types/express`, `@types/node`
- [x] 1.4 Create `tsconfig.json` with Node.js target configuration
- [x] 1.5 Create `.env.example` with `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_IDS`, `PORT`
- [x] 1.6 Add `start` and `dev` scripts to `package.json`

## 2. Configuration

- [x] 2.1 Create `src/config.ts` — load and validate `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_IDS`, and `PORT` from environment variables
- [x] 2.2 Implement comma-separated channel ID parsing with whitespace trimming
- [x] 2.3 Throw descriptive errors at startup if required env vars are missing

## 3. YouTube API Client

- [x] 3.1 Create `src/types.ts` — define `Video` type with id, title, description, publishedAt, thumbnailUrl, channelTitle
- [x] 3.2 Create `src/youtube.ts` — initialize the googleapis YouTube client with the API key
- [x] 3.3 Implement `getUploadsPlaylistId(channelId)` using `channels.list` endpoint
- [x] 3.4 Implement `getRecentVideos(channelId, maxResults)` using `playlistItems.list` on the uploads playlist
- [x] 3.5 Add error handling for quota exceeded (403), auth errors (401), and invalid channel IDs

## 4. Video Aggregator

- [x] 4.1 Create `src/aggregator.ts` — implement `getLatestVideos(channelIds, maxResults)`
- [x] 4.2 Fetch all channels concurrently using `Promise.allSettled`
- [x] 4.3 Collect successful results into a videos array and failed results into an errors array
- [x] 4.4 Sort the combined videos array by `publishedAt` descending

## 5. REST API

- [x] 5.1 Create `src/index.ts` — set up Express server listening on configured port
- [x] 5.2 Implement `GET /api/videos` endpoint that calls the aggregator and returns `{ videos, errors }`
- [x] 5.3 Support optional `maxResults` query parameter (default 10)
- [x] 5.4 Implement `GET /api/health` endpoint returning `{ status: "ok" }`
- [x] 5.5 Add error response handling: 500 for no channels configured, 503 for quota exceeded

## 6. Finalize

- [x] 6.1 Add `.gitignore` for `node_modules`, `.env`, `dist`
- [x] 6.2 Verify the service starts and responds to requests with a valid API key
