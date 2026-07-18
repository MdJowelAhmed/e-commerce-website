"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackExperimentEvent, useExperiment } from "@/hooks/use-experiment";

const HERO_IMAGE_LEFT =
  "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&w=900&q=80";
const HERO_IMAGE_RIGHT =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80";
const HERO_BG =
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const variant = useExperiment("home-hero-cta");
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 120]);
  const fgY = useTransform(scrollY, [0, 500], [0, -40]);

  return (
    <section className="relative isolate overflow-hidden">
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-10 scale-110"
        aria-hidden
      >
        <Image
          src={HERO_BG}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30 blur-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
      </motion.div>

      <div className="container-wide relative grid gap-10 py-16 sm:py-20 md:py-24 lg:grid-cols-2 lg:gap-16 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="flex flex-col items-start justify-center"
        >
          <Badge variant="soft" className="gap-1.5">
            <Sparkles className="h-3 w-3 text-accent" />
            {variant === "A" ? "Summer 2026 Collection" : "Limited pieces · Bangladesh"}
          </Badge>
          <h1 className="mt-5 font-display text-5xl tracking-tight text-balance md:text-6xl lg:text-7xl">
            {variant === "A" ? (
              <>Quietly <span className="italic text-gradient-accent">extraordinary</span> things.</>
            ) : (
              <>Find your next <span className="italic text-gradient-accent">signature</span> piece.</>
            )}
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground md:text-lg">
            A curated edit of contemporary essentials and statement pieces — designed to be worn,
            loved, and passed down.
          </p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
            }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <Button asChild size="xl">
                <Link
                  href="/products"
                  onClick={() => trackExperimentEvent("home-hero-cta", variant, "primary-click")}
                >
                  {variant === "A" ? "Shop the collection" : "Explore best sellers"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <Button asChild size="xl" variant="outline">
                <Link href="/products?sort=newest">New arrivals</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-10 flex items-center gap-6"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <Image
                  key={i}
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=hero${i}`}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full border-2 border-background bg-secondary"
                />
              ))}
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-1 font-medium">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                4.9 · 12,400+ reviews
              </div>
              <p className="text-muted-foreground">Loved by tastemakers worldwide</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: fgY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square lg:aspect-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 1, delay: 0.3, ease: easeOut }}
            className="absolute left-0 top-0 h-[70%] w-[55%] overflow-hidden rounded-3xl border bg-secondary shadow-xl"
          >
            <Image
              src={HERO_IMAGE_LEFT}
              alt="Hero image left"
              fill
              priority
              sizes="(min-width: 1024px) 30vw, 60vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            transition={{ duration: 1, delay: 0.5, ease: easeOut }}
            className="absolute bottom-0 right-0 h-[75%] w-[60%] overflow-hidden rounded-3xl border bg-secondary shadow-xl"
          >
            <Image
              src={HERO_IMAGE_RIGHT}
              alt="Hero image right"
              fill
              priority
              sizes="(min-width: 1024px) 30vw, 60vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass-card absolute left-[40%] top-[45%] hidden p-3 lg:block"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold">Free 30-day returns</p>
                <p className="text-muted-foreground">On every order</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
