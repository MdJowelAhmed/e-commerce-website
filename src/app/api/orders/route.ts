import { NextResponse } from "next/server";
import { z } from "zod";

import { ORDERS } from "@/lib/mock-data/orders";

export const dynamic = "force-dynamic";

const cartItemSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  name: z.string().min(1),
  imageUrl: z.string().url(),
  price: z.number().nonnegative(),
  comparePrice: z.number().nonnegative().optional(),
  quantity: z.number().int().positive().max(99),
  variantId: z.string().min(1),
  colorId: z.string().min(1),
  colorName: z.string().min(1),
  sizeId: z.string().min(1),
  sizeLabel: z.string().min(1),
  stock: z.number().int().nonnegative(),
});

const addressSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
});

const orderSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  subtotal: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(["card", "paypal", "cod"]),
  shippingMethod: z.enum(["standard", "express"]),
  shippingAddress: addressSchema,
  customer: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
  }),
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

  const data = parsed.data;
  const computedSubtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (Math.abs(computedSubtotal - data.subtotal) > 0.01) {
    return NextResponse.json({ message: "Subtotal mismatch" }, { status: 422 });
  }

  const number = `LX-${10000 + ORDERS.length + Math.floor(Math.random() * 900)}`;
  const now = new Date().toISOString();
  const order = {
    id: `o-${Date.now()}`,
    number,
    status: "pending" as const,
    createdAt: now,
    updatedAt: now,
    ...data,
  };

  return NextResponse.json(order, { status: 201 });
}
