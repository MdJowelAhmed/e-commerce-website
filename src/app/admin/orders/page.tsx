"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDERS } from "@/lib/mock-data/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (
        search &&
        !o.number.toLowerCase().includes(search.toLowerCase()) &&
        !o.customer.name.toLowerCase().includes(search.toLowerCase()) &&
        !o.customer.email.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Sales</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} orders · {formatCurrency(filtered.reduce((s, o) => s + o.total, 0))}{" "}
            total
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border bg-background p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order, name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus | "all")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3 font-medium">Order</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Items</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b last:border-b-0 transition-colors hover:bg-secondary/40"
                >
                  <td className="p-3 font-medium">{o.number}</td>
                  <td className="p-3">
                    <p className="font-medium">{o.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{o.customer.email}</p>
                  </td>
                  <td className="p-3 text-muted-foreground">{formatDate(o.createdAt)}</td>
                  <td className="p-3 text-muted-foreground">
                    {o.items.reduce((s, i) => s + i.quantity, 0)}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        o.status === "delivered"
                          ? "success"
                          : o.status === "cancelled" || o.status === "refunded"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {o.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-medium">{formatCurrency(o.total)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
