# Pambala product architecture

Last updated: 2026-11-07

## Product decision

Pambala is one platform with three role-oriented experiences:

1. **Farmer** — the first delivery priority; helps a farmer understand and
   follow their own farm.
2. **Professional** — allows an authorized agricultural technician to follow
   multiple farms and record technical observations.
3. **Intelligence** — provides institutions with documented national and
   regional context and, later, privacy-preserving aggregates from eligible
   platform data.

These are experiences and permission sets within one product, not three
independent applications or codebases. A person may hold more than one role.
A role selects the experience; authorization determines which records and
actions are actually accessible.

## Product centre: the farm

The farm is the product's central domain concept. Climate queries, observed
soil information, crop seasons, field observations, and assessments should be
associated with a farm or an explicitly identified field when the relevant
context is available.

Existing climate, crop/soil assessment, ICAPP context, data-quality, and
geography modules remain in place and should be reused. New work should extend
those modules rather than reimplement their calculations or duplicate their
data.

## Experience boundaries

### Farmer

- Register and maintain farm information.
- Record location, area, crop seasons, soil observations, and field notes.
- Reuse the existing NASA POWER climate workflow.
- Reuse existing crop and soil screening logic.
- Review source, period, coverage, missing values, and limitations.
- Retain ownership and control over sharing farm-level information.

### Professional

- Manage an authorized portfolio of farms.
- Access only the farms and actions explicitly granted to them.
- Record visits and technical observations with author and timestamp.
- Produce traceable reports without converting uncertain data into
  recommendations.

### Intelligence

- Reuse published INE/ICAPP aggregates and their documented quality gates.
- Distinguish official statistics from platform-collected observations.
- Aggregate farm-level data only after consent, minimum-data, privacy, and
  disclosure rules have been defined and implemented.
- Never expose individual farms by default.

## Domain and architecture direction

Keep the existing Next.js application and evolve it as a modular monolith.
Domain validation and calculations belong in domain modules; route handlers
coordinate requests; UI components present validated results. Introduce
persistence and authentication as explicit infrastructure adapters only after
their provider, data ownership model, retention, backup, and access-control
requirements are decided.

The initial farm schema is intentionally storage-agnostic. It does not imply
that accounts, ownership, sharing, or persistence already exist.

## Trust and data rules

- NASA POWER is a gridded estimate, not an in-field measurement.
- INE/ICAPP aggregates are campaign context, not farm-level observations.
- Missing values remain unavailable and are never converted to zero.
- User-entered administrative labels are descriptive only until verified
  against an authoritative geographic dataset.
- Coordinates must not be mapped to province, municipality, or commune until
  official boundary data and the matching process are validated.
- Assessments retain source, time period, coverage, and limitations.
- No arbitrary suitability score, unsupported yield forecast, or ungrounded
  agronomic prescription is introduced.

## Incremental delivery plan

1. **Farmer foundation:** validate the farm domain and align the current
   experience around a farm-centred workflow, reusing existing climate and
   soil/crop functionality.
2. **Farmer continuity:** choose and implement authentication and persistence,
   then save farms and observations with explicit ownership and privacy rules.
3. **Farmer intelligence:** associate climate and assessments with saved farms
   and show evidence and data coverage clearly.
4. **Professional:** introduce organizations, memberships, explicit farm
   access grants, multi-farm workflows, and traceable visit reports.
5. **Intelligence:** improve institutional reporting and only then consider
   privacy-preserving aggregates from platform activity.
6. **Expansion:** offline support, mobile workflows, and additional validated
   data sources.

Each phase should be delivered in small pull requests with tests and verified
CI. Existing working features must not be removed or rewritten without a
specific, reviewed reason.
