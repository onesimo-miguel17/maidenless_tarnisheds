import { z } from "zod";

/**
 * A farmer-entered farm location.
 *
 * Administrative names are descriptive labels only. They are not resolved
 * against official boundaries and must never be inferred from coordinates.
 */
export const farmLocationSchema = z.object({
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  source: z.enum(["manual", "device"]).optional(),
  /** Browser-reported accuracy; not the spatial resolution of NASA data. */
  accuracyMeters: z.number().nonnegative().optional(),
  provinceLabel: z.string().trim().min(1).max(100).optional(),
  municipalityLabel: z.string().trim().min(1).max(100).optional(),
  communeLabel: z.string().trim().min(1).max(100).optional(),
}).superRefine((location, context) => {
  const hasLatitude = location.latitude !== undefined;
  const hasLongitude = location.longitude !== undefined;
  const hasCoordinates = hasLatitude && hasLongitude;

  if (hasLatitude !== hasLongitude) {
    context.addIssue({
      code: "custom",
      message: "Latitude e longitude devem ser fornecidas em conjunto.",
      path: [hasLatitude ? "longitude" : "latitude"],
    });
  }

  if (hasCoordinates && location.source === undefined) {
    context.addIssue({
      code: "custom",
      message: "Indique se as coordenadas foram introduzidas manualmente ou obtidas pelo dispositivo.",
      path: ["source"],
    });
  }

  if (!hasCoordinates && location.source !== undefined) {
    context.addIssue({
      code: "custom",
      message: "A origem só pode ser indicada quando existem coordenadas.",
      path: ["source"],
    });
  }

  if (location.accuracyMeters !== undefined && location.source !== "device") {
    context.addIssue({
      code: "custom",
      message: "A precisão só se aplica a coordenadas obtidas pelo dispositivo.",
      path: ["accuracyMeters"],
    });
  }
});

/**
 * Initial domain contract for a farmer-managed farm.
 *
 * This schema validates a form/domain object only. It does not imply that
 * farms are authenticated, persisted, shared, or geographically resolved.
 */
export const farmSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
  areaHa: z.number().positive().nullable().default(null),
  location: farmLocationSchema.default({}),
});

export type FarmLocationInput = z.input<typeof farmLocationSchema>;
export type FarmLocation = z.output<typeof farmLocationSchema>;
export type FarmInput = z.input<typeof farmSchema>;
export type Farm = z.output<typeof farmSchema>;
