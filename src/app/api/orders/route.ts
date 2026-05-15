import { NextResponse } from "next/server";
import { z } from "zod";

import { ORDERS } from "@/lib/mock-data/orders";

export const dynamic = "force-dynamic";

const orderSchema = z.object({
  items: z.array(z.any()).min(1),
  total: z.number().nonnegative(),
});

export async function GET() {
  return NextResponse.json(ORDERS);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid order payload", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const number = `LX-${10000 + ORDERS.length + 1}`;
  const order = {
    id: `o-${Date.now()}`,
    number,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...(body as object),
  };
  return NextResponse.json(order, { status: 201 });
}
