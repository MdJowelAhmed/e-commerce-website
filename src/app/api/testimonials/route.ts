import { NextResponse } from "next/server";

import { TESTIMONIALS } from "@/lib/mock-data/testimonials";

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(TESTIMONIALS);
}
