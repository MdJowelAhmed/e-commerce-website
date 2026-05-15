"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PromoSection() {
  return (
    <section className="container-wide py-16 sm:py-20 lg:py-24">
      <div className="grid gap-4 md:grid-cols-3">
        <PromoCard
          href="/products?sort=newest"
          eyebrow="The new"
          title="Spring layering"
          subtitle="Featherlight knits and breezy linens, just in."
          imageUrl="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
          tall
        />
        <div className="grid gap-4">
          <PromoCard
            href="/products?sale=true"
            eyebrow="Up to 30% off"
            title="Mid-season edit"
            subtitle="A curated selection of pieces at a moment."
            imageUrl="https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1200&q=80"
          />
          <PromoCard
            href="/products?category=accessories"
            eyebrow="Accessories"
            title="The finishing touch"
            subtitle="Bags, jewelry and small leather goods."
            imageUrl="https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80"
          />
        </div>
        <PromoCard
          href="/products?category=shoes"
          eyebrow="Footwear"
          title="Built to last"
          subtitle="Hand-finished leathers, made the old way."
          imageUrl="https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80"
          tall
        />
      </div>
    </section>
  );
}

function PromoCard({
  href,
  eyebrow,
  title,
  subtitle,
  imageUrl,
  tall,
}: {
  href: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  tall?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={tall ? "h-full" : ""}
    >
      <Link
        href={href}
        className={`group relative block overflow-hidden rounded-3xl bg-secondary ${
          tall ? "aspect-[3/4] md:h-full md:min-h-[440px]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60" />
        <div className="absolute inset-x-6 bottom-6 text-white">
          <Badge variant="soft" className="border-white/30 bg-white/15 text-white backdrop-blur">
            {eyebrow}
          </Badge>
          <h3 className="mt-3 font-display text-3xl tracking-tight lg:text-4xl">{title}</h3>
          <p className="mt-1 max-w-sm text-sm text-white/80">{subtitle}</p>
          <Button
            asChild
            variant="ghost"
            className="mt-4 -ml-2 text-white hover:bg-white/10 hover:text-white"
          >
            <span>
              Shop now
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
