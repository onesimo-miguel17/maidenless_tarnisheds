# Angola Administrative Boundaries: Source Validation

**Status:** research only — no boundary dataset is approved for production use.

**Decision:** keep automatic province/region assignment disabled until the Instituto Geográfico e Cadastral de Angola (IGCA), or another competent public authority, supplies or formally validates a machine-readable boundary dataset and its use conditions.

## 1. Legal and institutional baseline

- Angola's Law No. 14/24 of 5 September 2024 establishes **21 provinces, 326 municipalities and 378 communes**. Article 3 states that summary maps and province-level tables/maps in the annexes form part of the law.
- The official gazette PDF is available at: https://c2a.portais.gov.ao/uploads/LEI_14_24_5_de_SETEMBRO_LEI_DA_DPA_043a0de85f.pdf
- The IGCA identifies itself as Angola's national cartography and cadastral authority and says it coordinates the national geographic information infrastructure (IDEA).
- IGCA institutional site: https://www.igca.gov.ao/
- IGCA contacts: https://igca.gov.ao/contactos
  - Email: info@igca.gov.ao
  - Telephone: 932 841 616 / 932 832 929
- The UN Second Administrative Level Boundaries (SALB) page identifies IGCA as the national geospatial information authority for Angola, but currently lists **no geospatial datasets** for Angola: https://salb.un.org/en/data/ago

## 2. Candidate datasets reviewed

### 2.1 ArcGIS FeatureServer — not approved

Service:
https://services.arcgis.com/uHAHKfH1Z5ye1Oe0/arcgis/rest/services/Nova_Divisao_Administrativa_de_Angola_WFL1/FeatureServer

Province layer:
https://services.arcgis.com/uHAHKfH1Z5ye1Oe0/arcgis/rest/services/Nova_Divisao_Administrativa_de_Angola_WFL1/FeatureServer/1

What its public metadata establishes:

- Polygon geometry for a layer named `Nova_DPA_Provincias`.
- Fields include `Nome_Prov`, `Cod_Prov`, `Cod_Alfa_P` and `Area`.
- Spatial reference is Web Mercator / EPSG:3857.
- The service description says it is based on the Diário da República, I Série No. 171, published on 5 September 2024.
- Layer metadata reports a last edit date of 14 July 2025.
- The service has no populated copyright text in the layer metadata and does not identify IGCA or another competent authority as publisher.

Assessment:

This is a useful **candidate for technical comparison**, not an authoritative source. A description claiming that a layer is based on the law is not proof that its geometry was officially produced, approved, or validated. Its projection can be transformed, but projection conversion does not establish positional accuracy or legal authority.

### 2.2 TOPOGIS download listing — unverified

Page:
https://www.topogis-ao.com/arquivos-sig-e-cad

The page lists an archive named `000_Admin_Angola_2024_actualizado.rar` as “DPA Angola - 2024” and describes it as an official Ministry of Territorial Administration shapefile.

Assessment:

The listing is a third-party claim. The archive was not successfully retrieved and its contents, metadata, lineage, geometry, projection, licence and accuracy could not be inspected. Do not ingest it or repeat its “official” status as a verified fact until the issuing authority confirms it.

### 2.3 Community GeoJSON — rejected as production input

https://github.com/sam190890/AGL-_DPA2025_SM

The repository describes 21-province GeoJSON layers but explicitly warns that they were produced with AI-assisted map vectorisation, OCR, georeferencing and geometry processing and may contain inconsistencies.

Assessment:

May be useful for exploratory visual comparison only. It must not drive province attribution, ICAPP joins, ranking, predictions or recommendations.

### 2.4 Legacy and global datasets — not suitable

- The open-admin-data Angola dataset describes the old 18-province / 161-municipality structure.
- GADM/other global boundary products found during research are dated before the 2024 administrative reorganisation.
- They must not be used to assign current 21-province geography without an independently validated update.

## 3. Data request to IGCA

Request the following from IGCA, preferably with an official technical note:

1. Current administrative boundaries for all 21 provinces, 326 municipalities and 378 communes.
2. Vector formats: GeoPackage, Shapefile or GeoJSON; alternatively a documented OGC API Features, WFS or ArcGIS REST endpoint.
3. Dataset title, version, publication/update date, responsible institution and authoritative source.
4. Coordinate reference system, datum, units and any required transformation parameters.
5. Positional accuracy / scale, geometry quality statement and known limitations.
6. Stable administrative codes and official names for every feature.
7. Licence, reuse permissions, attribution requirements and redistribution conditions.
8. Confirmation that the geometry reflects Law No. 14/24 and any subsequent rectifications or amendments.
9. If available, an official crosswalk between the 18-province geography used in ICAPP 2024/2025 and the current 21-province geography.

## 4. Acceptance tests before implementation

A received dataset must pass all of the following before it can be enabled:

- Authority and provenance verified directly with IGCA or another legally competent public authority.
- Licence and permitted use documented.
- Exactly 21 distinct province features, with official names and stable codes reconciled against the current legal framework.
- Municipal and commune counts checked where those layers are supplied.
- Valid polygon/multipolygon geometries; no empty or invalid features.
- No unexplained gaps, overlaps, duplicate administrative codes or geometry outside Angola.
- CRS and datum explicitly identified; coordinates transformed and tested using a trusted geospatial library.
- Independent spot checks against legal descriptions and official annex maps, including the new provinces Icolo e Bengo, Moxico Leste, Cuando and Cubango.
- Point-in-polygon tests around borders, coastal edges, Cabinda and other sensitive boundary cases.
- Versioned source file, checksum, acquisition date and reproducible validation report retained in the repository.

A point on or near a boundary must return an ambiguous/needs-review result where the geometry or coordinate precision does not support a confident assignment. Never silently choose a neighbouring province.

## 5. ICAPP integration constraints

The ICAPP 2024/2025 source uses a historical statistical geography and four broad statistical regions. It is not valid to assume that the 2024 administrative reorganisation automatically changes the statistical-region definitions.

Before associating a current province with an ICAPP region:

- obtain and document the exact ICAPP province-to-region classification;
- validate any crosswalk from historical provinces to current provinces;
- account for provinces split by the 2024 reform (including Luanda, Moxico and Cuando Cubango);
- do not allocate historical aggregate values to successor provinces by area, population or any other proxy unless an official, methodologically justified allocation is supplied;
- retain the statistical reference period and historical geography with every returned value.

Until then, regional ICAPP values remain campaign-level descriptive context and must not be treated as plot measurements or used in crop suitability, ranking, prediction or recommendations.

## 6. Current product behaviour

Pambala must continue to:

- accept user-entered coordinates for NASA POWER climate retrieval;
- clearly identify NASA POWER as gridded climate data, not a field measurement;
- avoid claiming a province or ICAPP statistical region when a validated spatial join is unavailable;
- expose the reason that regional ICAPP context was not applied;
- preserve missing/unknown values as unavailable, never as zero.

**No production boundary file or automated administrative assignment is approved by this research note.**


## 7. Official-source recheck — 7 November 2026

The following official institutional pages were rechecked during the current research pass. They improve the source trail, but they do **not** change the production decision above.

### 7.1 Official Government of Angola map — reference, not a verified GIS download

- Portal: https://governo.gov.ao/angola/mapa
- The page is presented as the Government of Angola's map for exploring provinces and municipalities.
- The Ministry of the Interior's corresponding map page reports 21 provinces, 326 municipalities, 378 communes and 44 urban districts: https://minint.gov.ao/web/mapa-de-angola

The public page content reviewed exposes the map entry point and administrative counts, but the review did not establish a downloadable vector dataset, machine-readable service endpoint, dataset licence, CRS/datum, positional accuracy, or geometry provenance. Therefore, this portal is a useful official reference for discovery and cross-checking, **not an approved source of boundary geometries**.

### 7.2 IGCA institutional role and current contact details

- IGCA home page: https://igca.gov.ao/
- Contact page: https://igca.gov.ao/contactos
- The IGCA describes itself as the National Cartography and Cadastre Authority and identifies responsibilities related to the national geographic information system.
- The contact page currently lists the institutional email `info@igca.gov.ao` and telephone numbers `932 841 616` / `932 832 929`.

The existing draft request in `docs/igca-boundary-data-request.md` remains the recommended next institutional step. Contact details should be rechecked immediately before sending. No request is considered sent and no institutional response has been received as part of this research pass.

### 7.3 UN SALB availability check

- Angola country page: https://salb.un.org/en/data/ago
- The page identifies the Angolan Geographical and Cadastral Institute as the national geospatial information authority and currently displays no geospatial datasets for Angola.

This is evidence that the UN SALB catalogue does not currently provide a dataset for Angola; it is **not** proof that no official dataset exists elsewhere or is held by IGCA.

### 7.4 Decision after recheck

- Keep automatic coordinate-to-province, municipality and commune attribution disabled.
- Do not promote the Government portal's visual map, a community GeoJSON, or a third-party ArcGIS layer to authoritative boundary status without direct institutional confirmation and technical acceptance.
- Send the prepared IGCA request only after the team has reviewed and authorised it.
- If IGCA provides a service or dataset, preserve the original files, metadata, licence, checksum, acquisition date and written provenance before validation or integration.
