# Pambala — Project Context & Handoff

Last updated: 2026-11-07

This document is the handoff source of truth for continuing Pambala work in a new ChatGPT conversation or by another contributor. Read it before changing architecture, data interpretation, or deployment behavior.

## 1. Project

- Product: **Pambala — Agricultural Intelligence Platform**
- Challenge: NASA Space Apps Challenge 2026
- Challenge theme: **Field Shift: Adapting Farms with NASA Data**
- Primary context: Angola
- Repository: https://github.com/onesimo-miguel17/maidenless_tarnisheds
- Vercel project: `pambala`
- Production alias: https://pambala-onesimo-digital.vercel.app

Pambala combines farm/plot context, observed soil information, NASA climate data, and official agricultural statistics to provide transparent agricultural intelligence. The goal is not to make unsupported agronomic claims.

## 2. Stack

- Next.js / React
- TypeScript
- Tailwind CSS v4
- Zod for runtime validation
- Vitest for tests
- Vercel for hosting and deployments
- GitHub Actions for validation

Inspect the current `package.json` and workflows before assuming exact scripts or CI behavior.

## 3. Product pillars

1. Soil intelligence
2. NASA climate intelligence
3. Agricultural decision intelligence

Core workflow: farm location → observed soil/crop context → NASA climate data → evidence-aware interpretation → explainable risks/opportunities.

## 4. Existing product capabilities

### NASA POWER climate workspace

- Server-side integration with NASA POWER Daily Point API:
  `https://power.larc.nasa.gov/api/temporal/daily/point`
- Parameters: `PRECTOTCORR`, `T2M`, `T2M_MAX`, `T2M_MIN`, `RH2M`
- Community: `AG`; temporal standard: UTC.
- API route: `/api/climate`
- UI route: `/climate`
- Client can enter coordinates manually or request browser geolocation. Device accuracy is distinct from NASA POWER grid resolution.
- Missing/sentinel values are represented as `null`, never as zero.
- Calendar coverage is explicit; missing dates remain missing.
- Dry spells are interrupted by missing daily observations.
- Data is a gridded estimate, not a measurement at the farm plot.

### Crop and soil assessment

- Crop selection and optional measured soil pH.
- Observed soil profile can include texture, moisture, drainage, perceived fertility, perceived organic matter, previous crop and reported problems.
- Integrated assessment combines measured pH assessment with climate-reference comparisons.
- Climate comparisons are conditional on evidence validation and sufficient temporal coverage.
- This is descriptive screening, not a definitive agronomic recommendation.
- Soil profile is currently held in interface state and is not persisted.

### Official Angola agricultural context

- ICAPP 2024/2025 national and historical-province context is available under `/agriculture`.
- Regional campaign context is available under `/agriculture/regions`.
- Data quality register is available under `/agriculture/data-quality`.
- API endpoints:
  - `/api/agriculture/context`
  - `/api/agriculture/data-quality`
- ICAPP is campaign/statistical context, not plot-level measurement.
- Historical ICAPP geography has 18 provinces; do not silently map it to the current 21-province administrative geography.
- Regional aggregates are not applied to plot assessment.

## 5. Critical data and safety guardrails

These rules are mandatory:

- Do not invent measurements, coordinates, data coverage, crop references, recommendations, sample datasets, or performance metrics.
- Preserve ND/missing values as unavailable; never coerce them to zero.
- NASA POWER is a gridded estimate, not a plot measurement.
- Do not infer crop damage from rainfall anomaly alone.
- Do not produce yield forecasts without defensible, validated evidence.
- Do not create arbitrary suitability scores or crop rankings.
- Do not provide planting-date or irrigation prescriptions without valid local evidence.
- Do not infer province/region from coordinates until a current authoritative boundary dataset is verified and integrated.
- Do not allocate historical ICAPP values to successor provinces using area, population, or other proxies.
- Do not use ICAPP findings flagged as inconsistent in ranking, prediction, recommendations, or plot assessment.
- Unknown metric IDs must fail closed in the ICAPP quality gate.
- Explain uncertainty, source, period, coverage, and limitations in user-facing outputs.

## 6. ICAPP quality controls

Official source:
- INE publication page: https://www.ine.gov.ao/publicacoes/detalhes/NTM0NzU=
- Official PDF: https://www.ine.gov.ao/Arquivos/arquivosCarregados//Carregados/Publicacao_639135904375282798.pdf
- Official Excel: https://www.ine.gov.ao/Arquivos/arquivosCarregados//Carregados/Publicacao_639135933953837199.xlsx

The ICAPP audit preserves published values and documents discrepancies; it is not an official INE erratum. Do not silently correct the source data.

The quality gate allows only reconciled national/regional aggregates for descriptive context. It blocks documented inconsistent findings from all purposes and blocks unknown metrics by default. Regional campaign context is not included in plot assessment because there is no validated geographic mapping.

## 7. Angola administrative boundaries — unresolved dependency

Current legal baseline: Law No. 14/24 of 5 September 2024, establishing the 21-province administrative division.

No authoritative, machine-readable current boundary dataset has yet been verified for production use. Automatic coordinate-to-province/municipality assignment must remain disabled.

Primary authority to contact:
- Instituto Geográfico e Cadastral de Angola (IGCA)
- Website: https://www.igca.gov.ao/home
- Email: info@igca.gov.ao

Request current official boundaries (GeoPackage, Shapefile, GeoJSON, or documented OGC service), metadata, CRS/datum, positional accuracy, official codes, licence/reuse rights, publication/version date, and any official crosswalk from historical ICAPP geography.

A candidate ArcGIS layer and third-party/community files have been examined but are not approved production truth. Before integration, verify provenance/licence, expected feature counts, geometry validity, topology, CRS, legal consistency, and edge cases. Ambiguous points near boundaries must require review rather than silent assignment.

## 8. Recently integrated pull requests

- PR #31: official ICAPP national and historical-province context.
- PR #32: ICAPP regional campaign context.
- PR #33: ICAPP data quality audit and fail-closed crop assessment gate. Merged into `main` on 2026-11-07.
  - Merge commit: `d801ab743cae63608e0f05a038a9f6813bb4d8ff`
- PR #34: quality gate implementation, merged into the PR #33 feature branch before PR #33 was merged into `main`.
- PR #35: official-source validation documentation for Angola administrative boundaries. Merged into `main` on 2026-11-07.
  - Merge commit: `00fa2832396707982264e7575628cad2de969f8c`

The latest known main commit is `00fa2832396707982264e7575628cad2de969f8c`. Verify GitHub before relying on this if the repository has advanced.

## 9. Engineering and release workflow

- Work on a dedicated feature/docs branch based on the latest `main`.
- Make small, coherent changes with tests.
- Run the repository's actual typecheck, lint, tests, and production build scripts (inspect `package.json`).
- Open a PR with scope, evidence, limitations, and test results.
- Verify CI and preview deployment status before claiming success.
- Preview deployments are not production.
- Never merge PRs, promote deployments, or make production changes without explicit user authorization.
- Do not claim a deployment is live/READY until Vercel confirms it.

## 10. Suggested next priorities

1. Obtain and validate authoritative current administrative boundary data from IGCA or another competent authority.
2. Keep automatic geographic attribution disabled until that validation is complete.
3. Review the deployed ICAPP quality pages and integrated crop warning after the latest production deployment reaches READY.
4. Add persistence only with an explicit data model, consent, security and privacy decisions.
5. Continue improving user workflows without weakening evidence/quality gates.

## 11. Continuation prompt

When continuing in a new conversation, start with:

> Continue Pambala in the NASA Space Apps project. First read `PROJECT_CONTEXT.md`, inspect the current GitHub main branch and open PRs, and verify the latest Vercel deployment. Preserve all data-quality and agronomic guardrails. Do not merge or deploy/promote without my explicit authorization.
