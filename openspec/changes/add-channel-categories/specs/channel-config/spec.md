## REMOVED Requirements

### Requirement: Load channel IDs from environment variable
**Reason**: Replaced by category-based configuration in `channels.json`. A flat env var cannot express category groupings.
**Migration**: Move channel IDs from `YOUTUBE_CHANNEL_IDS` env var into `channels.json` grouped under categories.
