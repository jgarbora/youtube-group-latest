## ADDED Requirements

### Requirement: Aggregate videos from multiple channels
The system SHALL fetch the latest videos from all configured channels and combine them into a single list.

#### Scenario: Multiple channels with videos
- **WHEN** 3 channels are configured and each has recent videos
- **THEN** the system returns a single array containing videos from all 3 channels

#### Scenario: One channel fails
- **WHEN** one channel fetch fails but others succeed
- **THEN** the system returns videos from the successful channels and includes an error entry for the failed channel in a separate errors array

### Requirement: Sort videos by publish date descending
The system SHALL sort the aggregated video list by publish date in descending order (newest first).

#### Scenario: Videos from different channels with different dates
- **WHEN** Channel A's latest video is from April 20 and Channel B's latest is from April 21
- **THEN** Channel B's video appears before Channel A's video in the results

### Requirement: Fetch channels concurrently
The system SHALL fetch videos from all channels concurrently using `Promise.allSettled` to maximize throughput and ensure one failure does not block others.

#### Scenario: Concurrent execution
- **WHEN** 5 channels are configured
- **THEN** all 5 channel fetches are initiated concurrently, not sequentially
