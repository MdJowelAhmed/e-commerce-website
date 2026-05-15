"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, Globe, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const VALUES = [
  {
    icon: Sparkles,
    title: "Quietly extraordinary",
    body: "We work with small workshops and artisans who care deeply about the craft.",
  },
  {
    icon: Globe,
    title: "Made considered",
    body: "Responsibly sourced materials, transparent supply chains, lifetime guarantees.",
  },
  {
    icon: Award,
    title: "Built to last",
    body: "Every piece is engineered to be worn for decades — not seasons.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-wide py-14 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">About us</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
          Quietly extraordinary things, made for everyday life.
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          We started Luxe to bring you the kind of beautifully made, thoughtfully sourced pieces
          that we couldn't find anywhere else — with the service to match.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mt-12 aspect-[16/8] overflow-hidden rounded-3xl"
      >
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {VALUES.map((v, i) => {
          const Icon = v.icon;
          return (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border bg-background p-6"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 flex flex-col items-center justify-between gap-4 rounded-3xl border bg-secondary/40 p-10 text-center md:flex-row md:text-left"
      >
        <div>
          <h2 className="font-display text-3xl tracking-tight">Browse the latest collection.</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            New arrivals every week. Free shipping on orders over $75.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/products">
            Shop now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
