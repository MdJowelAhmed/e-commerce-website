"use client";

import { motion } from "framer-motion";
import { DollarSign, Eye, MousePointerClick, ShoppingCart } from "lucide-react";

import { SalesChart } from "@/features/admin/components/sales-chart";
import { StatCard } from "@/features/admin/components/stat-card";
import { PRODUCTS } from "@/lib/mock-data/products";
import { cn, formatCurrency } from "@/lib/utils";

const TRAFFIC_DATA = [
  { label: "Mon", value: 1240 },
  { label: "Tue", value: 1640 },
  { label: "Wed", value: 1880 },
  { label: "Thu", value: 2104 },
  { label: "Fri", value: 2412 },
  { label: "Sat", value: 2890 },
  { label: "Sun", value: 2210 },
];

const CHANNELS = [
  { label: "Direct", value: 42 },
  { label: "Organic search", value: 28 },
  { label: "Social", value: 18 },
  { label: "Email", value: 9 },
  { label: "Referral", value: 3 },
];

export default function AdminAnalyticsPage() {
  const topProducts = [...PRODUCTS]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Analytics</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Performance</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard index={0} label="Revenue" value={formatCurrency(48230)} delta={9.8} icon={DollarSign} />
        <StatCard index={1} label="Visits" value="38,420" delta={4.6} icon={Eye} />
        <StatCard index={2} label="Conversion" value="3.6%" delta={1.2} icon={MousePointerClick} />
        <StatCard index={3} label="AOV" value={formatCurrency(184)} delta={-0.4} icon={ShoppingCart} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart data={TRAFFIC_DATA} title="Daily visits" />
        </div>
        <div className="rounded-2xl border bg-background p-6">
          <h3 className="text-lg font-semibold">Traffic by channel</h3>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
          <div className="mt-5 space-y-4">
            {CHANNELS.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{c.label}</span>
                  <span className="text-muted-foreground">{c.value}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.value}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className={cn(
                      "h-full rounded-full",
                      i === 0
                        ? "bg-foreground"
                        : "bg-foreground/" + Math.max(20, 80 - i * 15),
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-6">
        <h3 className="text-lg font-semibold">Top performing products</h3>
        <p className="text-xs text-muted-foreground">Ranked by reviews and conversion</p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Product</th>
              <th className="py-2 pr-3 font-medium">Brand</th>
              <th className="py-2 pr-3 font-medium">Rating</th>
              <th className="py-2 pr-3 font-medium">Reviews</th>
              <th className="py-2 pr-3 text-right font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="border-b last:border-b-0"
              >
                <td className="py-3 pr-3 font-medium">{p.name}</td>
                <td className="py-3 pr-3 text-muted-foreground">{p.brand}</td>
                <td className="py-3 pr-3">{p.rating.toFixed(1)}</td>
                <td className="py-3 pr-3 text-muted-foreground">{p.reviewCount}</td>
                <td className="py-3 pr-3 text-right font-medium">{formatCurrency(p.price)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
