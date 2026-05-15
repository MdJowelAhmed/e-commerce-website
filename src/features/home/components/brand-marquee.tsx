"use client";

import { motion } from "framer-motion";

const BRANDS = [
  "Atelier Luxe",
  "Studio North",
  "Maison Field",
  "Hearth Studio",
  "Plein Air",
  "Common Thread",
  "House of Pia",
  "Lumière",
];

export function BrandMarquee() {
  const items = [...BRANDS, ...BRANDS];
  return (
    <section className="border-y bg-background py-10">
      <p className="text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
        As featured in
      </p>
      <div className="mt-6 overflow-hidden">
        <motion.div
          className="flex w-max gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {items.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="font-display text-2xl tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground sm:text-3xl"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
