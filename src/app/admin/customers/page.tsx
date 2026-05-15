"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CUSTOMERS } from "@/lib/mock-data/orders";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return CUSTOMERS;
    const q = search.toLowerCase();
    return CUSTOMERS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Customers</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">All customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtered.length} customers</p>
      </div>

      <div className="rounded-2xl border bg-background p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border bg-background p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={c.avatarUrl} alt={c.name} />
                <AvatarFallback>{c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium">{c.name}</p>
                  <Badge variant={c.status === "active" ? "success" : "secondary"}>
                    {c.status}
                  </Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">{c.email}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Orders</p>
                <p className="mt-0.5 text-sm font-semibold">{c.totalOrders}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Spent</p>
                <p className="mt-0.5 text-sm font-semibold">{formatCurrency(c.totalSpent)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Joined</p>
                <p className="mt-0.5 text-sm font-semibold">{formatDate(c.joinedAt, { year: "numeric", month: "short" })}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
