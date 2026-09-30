## ADDED Requirements

### Requirement: Fetch uploads playlist ID for a channel
The system SHALL retrieve the uploads playlist ID for a given YouTube channel ID using the `channels.list` endpoint.

#### Scenario: Valid channel ID
- **WHEN** a valid YouTube channel ID is provided
- **THEN** the system returns the uploads playlist ID for that channel

#### Scenario: Invalid channel ID
- **WHEN** an invalid or non-existent YouTube channel ID is provided
- **THEN** the system throws a descriptive error indicating the channel was not found

### Requirement: Fetch recent videos from an uploads playlist
The system SHALL retrieve the most recent videos from a channel's uploads playlist using the `playlistItems.list` endpoint, returning up to a configurable maximum number of items (default 10).

#### Scenario: Channel has videos
- **WHEN** the uploads playlist contains videos
- **THEN** the system returns up to the configured max number of video items, each containing at minimum: video ID, title, description, published date, thumbnail URL, and channel title

#### Scenario: Channel has no videos
- **WHEN** the uploads playlist is empty
- **THEN** the system returns an empty array

### Requirement: Handle YouTube API errors
The system SHALL catch and wrap YouTube API errors with meaningful error messages, including quota exceeded errors.

#### Scenario: API quota exceeded
- **WHEN** the YouTube API returns a 403 quota exceeded error
- **THEN** the system throws an error clearly indicating the daily quota has been exceeded

#### Scenario: Network or auth error
- **WHEN** the YouTube API returns a network error or 401 unauthorized
- **THEN** the system throws an error with the original error message preserved
