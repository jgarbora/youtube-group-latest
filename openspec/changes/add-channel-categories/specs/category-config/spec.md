## ADDED Requirements

### Requirement: Load categories from channels.json
The system SHALL read category-to-channel mappings from a `channels.json` file at the project root at startup.

#### Scenario: Valid channels.json
- **WHEN** `channels.json` exists with valid categories
- **THEN** the system loads all categories with their names, slugs, and channel ID arrays

#### Scenario: Missing channels.json
- **WHEN** `channels.json` does not exist
- **THEN** the system throws an error at startup: "channels.json not found"

#### Scenario: Malformed JSON
- **WHEN** `channels.json` contains invalid JSON
- **THEN** the system throws a descriptive parse error at startup

### Requirement: Validate category schema
The system SHALL validate that each category has a non-empty `name`, a non-empty `slug`, and a non-empty `channels` array.

#### Scenario: Category missing slug
- **WHEN** a category entry has no `slug` field
- **THEN** the system throws an error identifying the invalid category

#### Scenario: Category with empty channels
- **WHEN** a category has an empty `channels` array
- **THEN** the system throws an error identifying the category with no channels

### Requirement: Enforce unique slugs
The system SHALL reject configurations where two or more categories share the same slug.

#### Scenario: Duplicate slugs
- **WHEN** `channels.json` contains two categories with slug "tech"
- **THEN** the system throws an error: "Duplicate category slug: tech"

### Requirement: Resolve all channel IDs
The system SHALL provide a method to get all channel IDs across all categories as a flat array.

#### Scenario: Multiple categories
- **WHEN** there are 2 categories with 3 and 2 channels respectively
- **THEN** the flat channel list contains 5 channel IDs

### Requirement: Resolve channel IDs by category slug
The system SHALL provide a method to get channel IDs for a specific category slug.

#### Scenario: Valid slug
- **WHEN** slug "tech" is requested and the "tech" category has 2 channels
- **THEN** the system returns an array of those 2 channel IDs

#### Scenario: Invalid slug
- **WHEN** slug "nonexistent" is requested
- **THEN** the system returns null or undefined
