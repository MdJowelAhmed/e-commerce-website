import { NextResponse } from "next/server";

import { getReviewsForProduct } from "@/lib/mock-data/reviews";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  return NextResponse.json(getReviewsForProduct(productId));
}
