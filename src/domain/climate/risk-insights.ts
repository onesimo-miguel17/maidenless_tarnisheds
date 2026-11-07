import type { DailyClimateRecord } from "@/lib/nasa-power";

export const DRY_DAY_PRECIPITATION_THRESHOLD_MM = 1;

export interface DrySpellObservation {
  startDate: string;
  endDate: string;
  durationDays: number;
}

export interface ClimateRiskInsights {
  drySpell: DrySpellObservation | null;
  dryDayThresholdMm: number;
  precipitationCoverage: {
    validDays: number;
    totalDays: number;
    missingDays: number;
    percentage: number | null;
    status: "complete" | "partial" | "unavailable";
  };
}

/**
 * Produces descriptive climate signals from NASA POWER daily estimates.
 * A dry spell is an operational sequence of days with precipitation < 1 mm.
 * It is not a diagnosis of agricultural drought or crop water stress.
 */
export function analyzeClimateRiskInsights(
  records: DailyClimateRecord[],
): ClimateRiskInsights {
  let currentSpell: DrySpellObservation | null = null;
  let longestSpell: DrySpellObservation | null = null;
  let validDays = 0;
  let previousDate: string | null = null;

  for (const record of records) {
    const dateGap = previousDate === null
      ? false
      : Date.parse(`${record.date}T00:00:00.000Z`) -
        Date.parse(`${previousDate}T00:00:00.000Z`) !== 86_400_000;

    if (record.precipitationMm === null || dateGap) {
      currentSpell = null;
    }

    if (record.precipitationMm !== null) {
      validDays += 1;
      if (record.precipitationMm < DRY_DAY_PRECIPITATION_THRESHOLD_MM) {
        if (currentSpell === null) {
          currentSpell = {
            startDate: record.date,
            endDate: record.date,
            durationDays: 1,
          };
        } else {
          currentSpell = {
            startDate: currentSpell.startDate,
            endDate: record.date,
            durationDays: currentSpell.durationDays + 1,
          };
        }

        if (
          longestSpell === null ||
          currentSpell.durationDays > longestSpell.durationDays
        ) {
          longestSpell = currentSpell;
        }
      } else {
        currentSpell = null;
      }
    }

    previousDate = record.date;
  }

  const totalDays = records.length;
  const missingDays = totalDays - validDays;
  const status = validDays === 0
    ? "unavailable"
    : missingDays === 0
      ? "complete"
      : "partial";

  return {
    drySpell: longestSpell,
    dryDayThresholdMm: DRY_DAY_PRECIPITATION_THRESHOLD_MM,
    precipitationCoverage: {
      validDays,
      totalDays,
      missingDays,
      percentage: totalDays > 0 ? (validDays / totalDays) * 100 : null,
      status,
    },
  };
}
