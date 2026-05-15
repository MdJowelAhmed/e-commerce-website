"use client";

import { motion } from "framer-motion";
import { Sparkles, Truck } from "lucide-react";

const ITEMS = [
  { icon: Sparkles, text: "New arrivals — handcrafted in limited quantities" },
  { icon: Truck, text: "Complimentary express shipping on orders over $75" },
  { icon: Sparkles, text: "Use code LUXE10 for 10% off your first order" },
  { icon: Truck, text: "Easy 30-day returns on every purchase" },
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
