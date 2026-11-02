"use client";

import { motion } from "framer-motion";
import { Flame, RefreshCw, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const ITEMS = [
  { icon: Sparkles, text: "Curated Summer 2026 Collection — Limited Run Pieces" },
  { icon: Truck, text: `Free shipping on orders over ${formatCurrency(FREE_SHIPPING_THRESHOLD)}` },
  { icon: Flame, text: "Special Offer: Use code LUXE15 for 15% off your first order" },
  { icon: ShieldCheck, text: "Cash on Delivery & Secure Online Payment Available" },
  { icon: RefreshCw, text: "Easy 30-day returns & exchanges across Bangladesh" },
];

export function AnnouncementBar() {
  const items = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-b border-foreground/10 bg-foreground text-background">
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap py-2 text-xs uppercase tracking-[0.18em]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-2 px-4">
              <Icon className="h-3.5 w-3.5 text-accent" />
              <span>{item.text}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
