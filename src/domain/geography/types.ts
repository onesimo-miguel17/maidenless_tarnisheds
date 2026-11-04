export type AdministrativeLevel =
  | "country"
  | "province"
  | "municipality"
  | "commune"
  | "locality";

export interface AdministrativeUnit {
  /** Stable internal identifier; not a legal territorial code. */
  id: string;
  name: string;
  level: AdministrativeLevel;
  parentId: string | null;
  /** Official administrative seat, when established by a source. */
  administrativeSeat?: string;
  /** National Territorial Unit Code under Law 8/25, when verified. */
  officialCode: string | null;
}

export interface GeographicDatasetMetadata {
  countryCode: "AO";
  datasetId: string;
  title: string;
  administrativeReferenceDate: string;
  publishedAt: string;
  accessedAt: string;
  administrativeCounts: {
    provinces: number;
    municipalities: number;
    communes: number;
  };
  sources: Array<{
    organization: string;
    title: string;
    url: string;
    notes: string;
  }>;
  limitations: string[];
}
