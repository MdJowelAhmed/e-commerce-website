"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Tag } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const SALE_DURATION = 48 * 60 * 60 * 1000;

export function FlashSaleCountdown() {
  const [remaining, setRemaining] = useState(SALE_DURATION);

  useEffect(() => {
    const key = "luxe.flash-sale.ends-at";
    const stored = Number(window.localStorage.getItem(key));
    const end = stored > Date.now() ? stored : Date.now() + SALE_DURATION;
    window.localStorage.setItem(key, String(end));
    const update = () => setRemaining(Math.max(0, end - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <section className="container-wide py-8">
      <div className="relative isolate overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-950 p-6 text-white shadow-2xl sm:p-8 lg:p-10">
        {/* Ambient subtle warm glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 -z-10 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md">
                <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                Limited Time Flash Event
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80">
                <Tag className="h-3 w-3 text-amber-400" />
                Extra 15% with <code className="font-mono font-semibold text-white">LUXE15</code>
              </span>
            </div>

            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl lg:text-5xl">
              Up to <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">35% off</span> rare archive pieces.
            </h2>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
                <span>Fast selling: <strong>76% of flash stock claimed</strong></span>
              </div>
              <div className="h-1.5 w-24 sm:w-36 overflow-hidden rounded-full bg-white/15">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "76%" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Countdown Cards */}
            <div className="flex gap-2 sm:gap-3" aria-label={`${days} days ${hours} hours ${minutes} minutes`}>
              <Time value={days} label="Days" />
              <Time value={hours} label="Hours" />
              <Time value={minutes} label="Mins" />
              <Time value={seconds} label="Secs" />
            </div>

            <Button
              asChild
              size="xl"
              className="rounded-2xl bg-white px-7 font-semibold text-black hover:bg-white/90 shadow-xl transition-all hover:scale-105"
            >
              <Link href="/products?sale=true" className="flex items-center gap-2">
                <span>Shop Sale</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Time({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-w-[58px] sm:min-w-[68px] rounded-2xl border border-white/15 bg-white/10 px-2.5 py-2.5 text-center backdrop-blur-md shadow-inner">
      <strong className="block text-xl sm:text-2xl font-bold font-mono tracking-tight tabular-nums text-white">
        {String(value).padStart(2, "0")}
      </strong>
      <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium">
        {label}
      </span>
    </div>
  );
}
