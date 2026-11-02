"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground group"
        >
          <span>View all</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {featured.map((cat, i) => (
          <CategoryCardGsap key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </section>
  );
}

function CategoryCardGsap({ category, index }: { category: Category; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  useGSAP(
    () => {
      const card = cardRef.current;
      const img = imgRef.current;
      const arrow = arrowRef.current;
      if (!card || !img) return;

      const hasPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!hasPointer) return;

      gsap.set(card, { transformPerspective: 800, transformStyle: "preserve-3d", force3D: true });
      gsap.set(img, { force3D: true });

      const rotXTo = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power2.out" });
      const rotYTo = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power2.out" });
      const imgXTo = gsap.quickTo(img, "x", { duration: 0.6, ease: "power2.out" });
      const imgYTo = gsap.quickTo(img, "y", { duration: 0.6, ease: "power2.out" });
      const arrowXTo = arrow ? gsap.quickTo(arrow, "x", { duration: 0.4, ease: "power2.out" }) : null;
      const arrowYTo = arrow ? gsap.quickTo(arrow, "y", { duration: 0.4, ease: "power2.out" }) : null;

      const handleMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        rotXTo(-ny * 8);
        rotYTo(nx * 8);
        imgXTo(-nx * 10);
        imgYTo(-ny * 10);

        if (arrowXTo && arrowYTo) {
          arrowXTo(nx * 14);
          arrowYTo(ny * 14);
        }

        setSpotlight({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          opacity: 1,
        });
      };

      const handleLeave = () => {
        rotXTo(0);
        rotYTo(0);
        imgXTo(0);
        imgYTo(0);
        if (arrowXTo && arrowYTo) {
          arrowXTo(0);
          arrowYTo(0);
        }
        setSpotlight((prev) => ({ ...prev, opacity: 0 }));
      };

      card.addEventListener("mousemove", handleMove, { passive: true });
      card.addEventListener("mouseleave", handleLeave, { passive: true });

      return () => {
        card.removeEventListener("mousemove", handleMove);
        card.removeEventListener("mouseleave", handleLeave);
      };
    },
    { scope: cardRef },
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        ref={cardRef}
        href={`/products?category=${category.slug}`}
        className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-secondary will-change-transform shadow-md hover:shadow-2xl transition-shadow"
      >
        {/* Parallax Background Image */}
        <div ref={imgRef} className="absolute -inset-3 will-change-transform">
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover scale-[1.08] transition-transform duration-700 ease-out group-hover:scale-[1.15]"
          />
        </div>

        {/* Dynamic Light Spotlight Gradient */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(320px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255,255,255,0.22), transparent 70%)`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90 pointer-events-none" />

        {/* Category Pill Tag */}
        <div className="absolute top-4 left-4 pointer-events-none z-10">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-md">
            {index === 0 ? "Trending Edit" : index === 1 ? "New Season" : index === 2 ? "Fine Craft" : "Artisanal"}
          </span>
        </div>

        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white pointer-events-none">
          <div>
            <h3 className="font-display text-2xl tracking-tight md:text-3xl font-semibold">
              {category.name}
            </h3>
            <p className="mt-0.5 text-xs text-white/70">{category.productCount} products</p>
          </div>
          <div
            ref={arrowRef}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition-all group-hover:bg-white group-hover:text-foreground shadow-lg"
          >
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
