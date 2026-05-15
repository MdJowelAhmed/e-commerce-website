"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

import { StarRating } from "@/components/shared/star-rating";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="relative overflow-hidden border-y bg-secondary/40 py-16 sm:py-20 lg:py-24">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Praise from clients
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            What people are saying.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {testimonials.map((t) => (
            <motion.figure
              key={t.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -4 }}
              className="relative flex flex-col rounded-2xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <Quote className="h-6 w-6 text-muted-foreground/40" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
                "{t.quote}"
              </blockquote>
              <StarRating value={t.rating} className="mt-4" />
              <figcaption className="mt-4 flex items-center gap-3 border-t pt-4">
                <Image
                  src={t.avatarUrl}
                  alt={t.author}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full bg-secondary"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.author}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
