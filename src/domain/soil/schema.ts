import { z } from "zod";

export const soilTextureSchema = z.enum(["sandy", "clayey", "loamy", "unknown"]);
export const soilMoistureSchema = z.enum(["dry", "normal", "wet", "unknown"]);
export const drainageSchema = z.enum(["poor", "moderate", "good", "unknown"]);
export const fertilitySchema = z.enum(["low", "medium", "high", "unknown"]);
export const organicMatterSchema = z.enum(["low", "medium", "high", "unknown"]);
export const pHMeasurementSchema = z.object({
  value: z.number().min(0).max(14),
  measuredAt: z.iso.date().optional(),
  method: z.string().trim().min(1).max(120).optional(),
});

export const soilProfileSchema = z.object({
  texture: soilTextureSchema.default("unknown"),
  moisture: soilMoistureSchema.default("unknown"),
  ph: pHMeasurementSchema.nullable().default(null),
  drainage: drainageSchema.default("unknown"),
  fertility: fertilitySchema.default("unknown"),
  organicMatter: organicMatterSchema.default("unknown"),
  previousCropId: z.string().trim().min(1).nullable().default(null),
  observedProblems: z.array(z.string().trim().min(1).max(160)).max(20).default([]),
  location: z.object({
    province: z.string().trim().min(1).max(100).optional(),
    municipality: z.string().trim().min(1).max(100).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  }).default({}),
});

export type SoilProfileInput = z.input<typeof soilProfileSchema>;
export type SoilProfile = z.output<typeof soilProfileSchema>;
