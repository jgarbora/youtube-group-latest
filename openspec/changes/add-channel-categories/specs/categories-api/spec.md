## ADDED Requirements

### Requirement: GET /api/categories endpoint
The system SHALL expose a `GET /api/categories` endpoint that returns the list of available categories.

#### Scenario: Categories exist
- **WHEN** a GET request is made to `/api/categories`
- **THEN** the system responds with HTTP 200 and a JSON body `{ categories: [{ name, slug }] }` (channel IDs are not included in the response)

#### Scenario: Response format
- **WHEN** there are 2 categories: "Tech" (slug: "tech") and "Music" (slug: "music")
- **THEN** the response contains `{ categories: [{ name: "Tech", slug: "tech" }, { name: "Music", slug: "music" }] }`
