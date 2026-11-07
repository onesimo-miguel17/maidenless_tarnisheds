import type { DailyClimateRecord } from "@/lib/nasa-power";

export interface MonthlyRainfallCoverage {
  month: string;
  validDays: number;
  expectedDays: number;
  complete: boolean;
  precipitationTotalMm: number | null;
}

export interface RainfallSeasonalityMonth {
  monthNumber: number;
  label: string;
  meanPrecipitationMm: number | null;
  completeMonths: number;
  years: string[];
}

export interface RainfallSeasonality {
  months: RainfallSeasonalityMonth[];
  monthlyCoverage: MonthlyRainfallCoverage[];
  completeMonthCount: number;
  excludedIncompleteMonthCount: number;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function monthLabel(monthNumber: number): string {
  return new Intl.DateTimeFormat("pt-PT", { month: "long", timeZone: "UTC" })
    .format(new Date(Date.UTC(2024, monthNumber - 1, 1)));
}

/**
 * Builds a month-of-year rainfall profile from complete observed calendar months.
 * Incomplete months remain visible as coverage metadata but are excluded from averages.
 */
export function analyzeRainfallSeasonality(
  records: DailyClimateRecord[],
): RainfallSeasonality {
  const grouped = new Map<string, DailyClimateRecord[]>();

  for (const record of records) {
    const month = record.date.slice(0, 7);
    const bucket = grouped.get(month) ?? [];
    bucket.push(record);
    grouped.set(month, bucket);
  }

  const monthlyCoverage: MonthlyRainfallCoverage[] = [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([month, bucket]) => {
      const [yearText, monthText] = month.split("-");
      const year = Number(yearText);
      const monthNumber = Number(monthText);
      const expectedDays = daysInMonth(year, monthNumber);
      const validValues = bucket
        .map((record) => record.precipitationMm)
        .filter((value): value is number => value !== null && Number.isFinite(value));
      const uniqueDates = new Set(bucket.map((record) => record.date));
      const complete = bucket.length === expectedDays
        && uniqueDates.size === expectedDays
        && validValues.length === expectedDays;

      return {
        month,
        validDays: validValues.length,
        expectedDays,
        complete,
        precipitationTotalMm: complete
          ? validValues.reduce((sum, value) => sum + value, 0)
          : null,
      };
    });

  const months: RainfallSeasonalityMonth[] = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;
    const completeMonths = monthlyCoverage.filter((entry) =>
      Number(entry.month.slice(5, 7)) === monthNumber && entry.complete,
    );
    const totals = completeMonths
      .map((entry) => entry.precipitationTotalMm)
      .filter((value): value is number => value !== null);
    return {
      monthNumber,
      label: monthLabel(monthNumber),
      meanPrecipitationMm: totals.length > 0
        ? totals.reduce((sum, value) => sum + value, 0) / totals.length
        : null,
      completeMonths: totals.length,
      years: completeMonths.map((entry) => entry.month.slice(0, 4)),
    };
  });

  const completeMonthCount = monthlyCoverage.filter((entry) => entry.complete).length;

  return {
    months,
    monthlyCoverage,
    completeMonthCount,
    excludedIncompleteMonthCount: monthlyCoverage.length - completeMonthCount,
  };
}
