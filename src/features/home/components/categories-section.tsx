"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { Category } from "@/types";

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const featured = categories.filter((c) => c.featured).slice(0, 4);
  return (
    <section className="container-wide py-16 sm:py-20 lg:py-24">
      <div className="flex flex-col items-start justify-between gap-4 pb-10 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Shop by category</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            Find your edit.
          </h2>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground"
        >
          View all
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {featured.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/products?category=${cat.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-secondary"
            >
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/80" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
                <div>
                  <h3 className="font-display text-2xl tracking-tight md:text-3xl">{cat.name}</h3>
                  <p className="mt-0.5 text-xs text-white/70">{cat.productCount} products</p>
                </div>
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 4, y: -4 }}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition-all group-hover:bg-white group-hover:text-foreground"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
