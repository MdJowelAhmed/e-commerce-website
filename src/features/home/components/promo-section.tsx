"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_IMAGES } from "@/lib/mock-data/media";

export function PromoSection() {
  return (
    <section className="container-wide py-16 sm:py-20 lg:py-24">
      <div className="grid gap-4 md:grid-cols-3">
        <PromoCard
          href="/products?sort=newest"
          eyebrow="The new"
          title="Spring layering"
          subtitle="Featherlight knits and breezy linens, just in."
          imageUrl={SITE_IMAGES.promoSpring}
          tall
        />
        <div className="grid gap-4">
          <PromoCard
            href="/products?sale=true"
            eyebrow="Up to 30% off"
            title="Mid-season edit"
            subtitle="A curated selection of pieces at a moment."
            imageUrl={SITE_IMAGES.promoSale}
          />
          <PromoCard
            href="/products?category=accessories"
            eyebrow="Accessories"
            title="The finishing touch"
            subtitle="Bags, jewelry and small leather goods."
            imageUrl={SITE_IMAGES.promoAccessories}
          />
        </div>
        <PromoCard
          href="/products?category=shoes"
          eyebrow="Footwear"
          title="Built to last"
          subtitle="Hand-finished leathers, made the old way."
          imageUrl={SITE_IMAGES.promoShoes}
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
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      const img = imageRef.current;
      if (!card || !img) return;

      const hasPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!hasPointer) return;

      gsap.set(card, { transformPerspective: 900, transformStyle: "preserve-3d", force3D: true });
      gsap.set(img, { force3D: true });

      const rotXTo = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power2.out" });
      const rotYTo = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power2.out" });
      const imgXTo = gsap.quickTo(img, "x", { duration: 0.7, ease: "power2.out" });
      const imgYTo = gsap.quickTo(img, "y", { duration: 0.7, ease: "power2.out" });

      const handleMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        rotXTo(-ny * 10);
        rotYTo(nx * 10);
        imgXTo(-nx * 12);
        imgYTo(-ny * 12);
      };

      const handleLeave = () => {
        rotXTo(0);
        rotYTo(0);
        imgXTo(0);
        imgYTo(0);
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={tall ? "h-full" : ""}
    >
      <Link
        ref={cardRef}
        href={href}
        className={`group relative block overflow-hidden rounded-3xl bg-secondary will-change-transform shadow-lg hover:shadow-2xl transition-shadow ${
          tall ? "aspect-[3/4] md:h-full md:min-h-[440px]" : "aspect-[4/3]"
        }`}
      >
        <div ref={imageRef} className="absolute -inset-2 will-change-transform">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover scale-[1.06] transition-transform duration-700 ease-out group-hover:scale-[1.12]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-black/70 pointer-events-none" />
        <div className="absolute inset-x-6 bottom-6 text-white pointer-events-none">
          <Badge variant="soft" className="border-white/30 bg-white/15 text-white backdrop-blur">
            {eyebrow}
          </Badge>
          <h3 className="mt-3 font-display text-3xl tracking-tight lg:text-4xl">{title}</h3>
          <p className="mt-1 max-w-sm text-sm text-white/80">{subtitle}</p>
          <Button
            asChild
            variant="ghost"
            className="mt-4 -ml-2 text-white hover:bg-white/10 hover:text-white pointer-events-auto"
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
