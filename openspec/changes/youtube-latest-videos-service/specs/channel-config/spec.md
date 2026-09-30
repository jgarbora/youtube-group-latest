## ADDED Requirements

### Requirement: Load channel IDs from environment variable
The system SHALL read YouTube channel IDs from the `YOUTUBE_CHANNEL_IDS` environment variable as a comma-separated list.

#### Scenario: Valid channel IDs
- **WHEN** `YOUTUBE_CHANNEL_IDS` is set to `"UC123,UC456,UC789"`
- **THEN** the system parses it into an array of 3 channel IDs: `["UC123", "UC456", "UC789"]`

#### Scenario: Whitespace handling
- **WHEN** `YOUTUBE_CHANNEL_IDS` is set to `" UC123 , UC456 "`
- **THEN** the system trims whitespace and parses into `["UC123", "UC456"]`

#### Scenario: Missing environment variable
- **WHEN** `YOUTUBE_CHANNEL_IDS` is not set or empty
- **THEN** the system throws an error at startup indicating channel IDs are required

### Requirement: Load YouTube API key from environment variable
The system SHALL read the YouTube API key from the `YOUTUBE_API_KEY` environment variable.

#### Scenario: Valid API key
- **WHEN** `YOUTUBE_API_KEY` is set
- **THEN** the system uses it for all YouTube Data API requests

#### Scenario: Missing API key
- **WHEN** `YOUTUBE_API_KEY` is not set or empty
- **THEN** the system throws an error at startup indicating the API key is required

### Requirement: Configurable server port
The system SHALL read the server port from the `PORT` environment variable, defaulting to 3000 if not set.

#### Scenario: Custom port
- **WHEN** `PORT` is set to `8080`
- **THEN** the Express server listens on port 8080

#### Scenario: Default port
- **WHEN** `PORT` is not set
- **THEN** the Express server listens on port 3000
