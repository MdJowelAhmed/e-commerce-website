import { NextResponse } from "next/server";

import { getCatalogFacets } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getCatalogFacets());
}
