"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  Package,
  PackageCheck,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListOrdersQuery } from "@/lib/store/services/api";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_STEPS: { id: OrderStatus; label: string; icon: typeof Circle }[] = [
  { id: "pending", label: "Placed", icon: Clock },
  { id: "processing", label: "Processing", icon: Package },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "delivered", label: "Delivered", icon: PackageCheck },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 0,
  refunded: 0,
};

export default function OrdersPage() {
  const { data: orders, isLoading } = useListOrdersQuery();

  return (
    <div className="container-wide py-10 lg:py-14">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">My orders</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">Order history</h1>
      </header>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders?.map((order, i) => {
            const stepIdx = STATUS_INDEX[order.status];
            return (
              <motion.article
                key={order.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border bg-background p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Order
                      </span>
                      <span className="font-medium">{order.number}</span>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "success"
                            : order.status === "cancelled" || order.status === "refunded"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Placed on {formatDate(order.createdAt, { dateStyle: "long" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold tracking-tight">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-2">
                  {STATUS_STEPS.map((step, idx) => {
                    const completed = idx <= stepIdx && order.status !== "cancelled";
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex flex-col items-center text-center">
                        <div
                          className={cn(
                            "grid h-10 w-10 place-items-center rounded-full border transition-colors",
                            completed
                              ? "border-success bg-success/10 text-success"
                              : "border-border bg-secondary text-muted-foreground",
                          )}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </div>
                        <p
                          className={cn(
                            "mt-2 text-xs",
                            completed ? "font-medium text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.id}`}
                        className="inline-flex items-center gap-2 rounded-full border bg-secondary/40 px-2 py-1 text-xs"
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground">× {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  {order.trackingNumber && (
                    <Link
                      href="#"
                      className="text-xs font-medium text-foreground/80 underline underline-offset-2 hover:text-foreground"
                    >
                      Track: {order.trackingNumber}
                    </Link>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
