## ADDED Requirements

### Requirement: Filter videos by category
The `GET /api/videos` endpoint SHALL accept an optional `category` query parameter. When provided, only videos from channels in that category are returned.

#### Scenario: Valid category filter
- **WHEN** a GET request is made to `/api/videos?category=tech`
- **THEN** the system returns only videos from channels belonging to the "tech" category, sorted by publish date descending

#### Scenario: No category filter
- **WHEN** a GET request is made to `/api/videos` without a `category` parameter
- **THEN** the system returns videos from all channels across all categories (existing behavior preserved)

#### Scenario: Invalid category filter
- **WHEN** a GET request is made to `/api/videos?category=nonexistent`
- **THEN** the system responds with HTTP 404 and `{ error: "Category not found: nonexistent" }`

#### Scenario: Category filter combined with maxResults
- **WHEN** a GET request is made to `/api/videos?category=tech&maxResults=5`
- **THEN** the system fetches at most 5 videos per channel within the "tech" category
