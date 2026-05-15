"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SalesChart } from "@/features/admin/components/sales-chart";
import { StatCard } from "@/features/admin/components/stat-card";
import { CUSTOMERS, ORDERS } from "@/lib/mock-data/orders";
import { PRODUCTS } from "@/lib/mock-data/products";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const SALES_DATA = [
  { label: "Wk1", value: 24 },
  { label: "Wk2", value: 38 },
  { label: "Wk3", value: 32 },
  { label: "Wk4", value: 54 },
  { label: "Wk5", value: 46 },
  { label: "Wk6", value: 62 },
  { label: "Wk7", value: 58 },
  { label: "Wk8", value: 72 },
  { label: "Wk9", value: 81 },
  { label: "Wk10", value: 76 },
  { label: "Wk11", value: 92 },
  { label: "Wk12", value: 108 },
];

export default function AdminDashboardPage() {
  const totalRevenue = ORDERS.reduce((sum, o) => sum + o.total, 0) + 18420;
  const totalOrders = ORDERS.length + 42;
  const totalCustomers = CUSTOMERS.length + 320;
  const totalProducts = PRODUCTS.length + 28;
  const topProducts = PRODUCTS.slice(0, 5);
  const recentOrders = ORDERS.slice(0, 5);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Overview</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">Welcome back</h1>
        </div>
        <Button asChild>
          <Link href="/admin/products">
            <Package className="h-4 w-4" />
            Add product
          </Link>
        </Button>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          index={0}
          label="Revenue"
          value={formatCurrency(totalRevenue)}
          delta={12.4}
          icon={DollarSign}
        />
        <StatCard
          index={1}
          label="Orders"
          value={String(totalOrders)}
          delta={8.2}
          icon={ShoppingCart}
        />
        <StatCard
          index={2}
          label="Customers"
          value={String(totalCustomers)}
          delta={4.1}
          icon={Users}
        />
        <StatCard
          index={3}
          label="Products"
          value={String(totalProducts)}
          delta={-1.3}
          icon={Package}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart data={SALES_DATA} />
        </div>
        <div className="rounded-2xl border bg-background p-6">
          <h3 className="text-lg font-semibold">Top products</h3>
          <p className="text-xs text-muted-foreground">Best sellers this month</p>
          <ul className="mt-4 space-y-3">
            {topProducts.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-secondary">
                  <Image
                    src={p.images[0].url}
                    alt={p.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(p.price)} · {p.reviewCount} reviews
                  </p>
                </div>
                <TrendingUp className="h-4 w-4 text-success" />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-background p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent orders</h3>
              <p className="text-xs text-muted-foreground">Latest activity</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Order</th>
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <motion.tr
                    key={o.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b last:border-b-0"
                  >
                    <td className="py-3 pr-3 font-medium">{o.number}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{o.customer.name}</td>
                    <td className="py-3 pr-3 text-muted-foreground">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="py-3 pr-3">
                      <Badge
                        variant={
                          o.status === "delivered"
                            ? "success"
                            : o.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {o.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-3 text-right font-medium">
                      {formatCurrency(o.total)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border bg-background p-6">
          <h3 className="text-lg font-semibold">Activity</h3>
          <p className="text-xs text-muted-foreground">A quick pulse</p>
          <ul className="mt-4 space-y-3">
            {[
              { title: "New order placed", body: "LX-10244 · $559.44", time: "2m ago", status: "info" },
              { title: "Refund issued", body: "LX-10211 · $189.00", time: "1h ago", status: "warn" },
              { title: "Stock running low", body: "Verona Suede Loafer · 4 left", time: "3h ago", status: "warn" },
              { title: "New 5-star review", body: "Milano Cashmere Coat", time: "5h ago", status: "good" },
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 rounded-xl border bg-secondary/30 p-3"
              >
                <div
                  className={cn(
                    "mt-0.5 grid h-7 w-7 place-items-center rounded-full",
                    item.status === "good" && "bg-success/15 text-success",
                    item.status === "warn" && "bg-amber-500/15 text-amber-600",
                    item.status === "info" && "bg-foreground/10 text-foreground",
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.body}</p>
                </div>
                <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                  {item.time}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
