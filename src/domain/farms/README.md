# Farm domain

This module defines the initial validated domain contract for a farmer-managed
farm. It is deliberately independent from persistence and authentication so the
domain can be reused by the current UI, future APIs, and later storage adapters.

## Current contract

- A farm has a required, trimmed name.
- Description and area are optional; unknown area is represented as `null`.
- Coordinates are optional, but latitude and longitude must be supplied together.
- Coordinates must declare whether they were entered manually or obtained from
  the device.
- Device-reported accuracy is stored separately from NASA POWER spatial
  resolution and is only valid for device-derived coordinates.
- Province, municipality, and commune labels are user-entered descriptive text.
  They are not official identifiers and are not inferred from coordinates.

## Explicit non-goals

This schema does not implement:

- user identity, ownership, authentication, or access grants;
- database persistence or synchronization;
- administrative boundary lookup or coordinate-to-area assignment;
- field geometry, crop seasons, or agronomic recommendations.

Those capabilities require separate design, security review, and evidence.
