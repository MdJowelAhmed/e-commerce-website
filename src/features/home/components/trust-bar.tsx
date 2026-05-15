"use client";

import { motion } from "framer-motion";
import { Award, Headphones, RefreshCw, ShieldCheck, Truck } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Free shipping", body: "On orders over $75" },
  { icon: RefreshCw, title: "30-day returns", body: "Easy and hassle-free" },
  { icon: ShieldCheck, title: "Secure checkout", body: "256-bit SSL encryption" },
  { icon: Headphones, title: "Concierge support", body: "Real humans, real fast" },
  { icon: Award, title: "Crafted with care", body: "Small batches, lifetime" },
];

export function TrustBar() {
  return (
    <section className="border-y bg-secondary/30">
      <div className="container-wide grid grid-cols-2 gap-4 py-8 md:grid-cols-5">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border bg-background">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
