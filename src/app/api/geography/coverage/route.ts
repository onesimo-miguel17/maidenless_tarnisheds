import { NextResponse } from "next/server";
import { getAngolaGeographyCoverage } from "@/domain/geography/coverage";

export function GET() {
  return NextResponse.json(getAngolaGeographyCoverage());
}
