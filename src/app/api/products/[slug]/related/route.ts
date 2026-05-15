import { NextResponse } from "next/server";

import { getRelatedProducts } from "@/lib/mock-data/products";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const related = getRelatedProducts(slug, 4);
  return NextResponse.json(related);
}
