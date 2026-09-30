## ADDED Requirements

### Requirement: GET /api/videos endpoint
The system SHALL expose a `GET /api/videos` endpoint that returns the aggregated latest videos from all configured channels, sorted by publish date descending.

#### Scenario: Successful request
- **WHEN** a GET request is made to `/api/videos`
- **THEN** the system responds with HTTP 200 and a JSON body containing `{ videos: [...], errors: [...] }` where videos are sorted by publish date descending

#### Scenario: Optional maxResults query parameter
- **WHEN** a GET request is made to `/api/videos?maxResults=5`
- **THEN** the system fetches at most 5 videos per channel before aggregating

### Requirement: GET /api/health endpoint
The system SHALL expose a `GET /api/health` endpoint for health checks.

#### Scenario: Service is running
- **WHEN** a GET request is made to `/api/health`
- **THEN** the system responds with HTTP 200 and `{ status: "ok" }`

### Requirement: Error response format
The system SHALL return errors in a consistent JSON format with an appropriate HTTP status code.

#### Scenario: No channels configured
- **WHEN** no channel IDs are configured
- **THEN** the system responds with HTTP 500 and `{ error: "No channels configured" }`

#### Scenario: YouTube API quota exceeded
- **WHEN** all channel fetches fail due to quota exceeded
- **THEN** the system responds with HTTP 503 and `{ error: "YouTube API quota exceeded" }`
