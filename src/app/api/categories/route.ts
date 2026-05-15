import { NextResponse } from "next/server";

import { CATEGORIES } from "@/lib/mock-data/categories";

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(CATEGORIES);
}
