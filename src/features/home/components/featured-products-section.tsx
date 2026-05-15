"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/products/components/product-card";
import type { Product } from "@/types";

interface FeaturedProductsSectionProps {
  products: Product[];
  title?: string;
  eyebrow?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export function FeaturedProductsSection({
  products,
  eyebrow = "Editor's picks",
  title = "Pieces we're loving right now.",
  description = "A short, considered selection updated weekly.",
  ctaLabel = "View all products",
  ctaHref = "/products",
}: FeaturedProductsSectionProps) {
  return (
    <section className="container-wide py-16 sm:py-20 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-start justify-between gap-4 pb-10 sm:flex-row sm:items-end"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={ctaHref}>
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
      >
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} priority={i < 4} />
        ))}
      </motion.div>
    </section>
  );
}
