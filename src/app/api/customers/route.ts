import { NextResponse } from "next/server";

import { CUSTOMERS } from "@/lib/mock-data/orders";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(CUSTOMERS);
}
