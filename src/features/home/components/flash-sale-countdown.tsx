"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

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
      <div className="flex flex-col gap-6 rounded-3xl bg-foreground p-6 text-background sm:flex-row sm:items-center sm:justify-between lg:p-9">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-background/70">
            <Zap className="h-4 w-4 fill-current" />
            Bangladesh flash sale
          </p>
          <h2 className="mt-2 font-display text-3xl">Up to 35% off, while stock lasts.</h2>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2" aria-label={`${days} days ${hours} hours ${minutes} minutes`}>
            <Time value={days} label="Days" />
            <Time value={hours} label="Hrs" />
            <Time value={minutes} label="Min" />
            <Time value={seconds} label="Sec" />
          </div>
          <Button variant="secondary" asChild>
            <Link href="/products?sale=true">
              Shop sale <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Time({ value, label }: { value: number; label: string }) {
  return (
    <span className="min-w-14 rounded-xl bg-background/10 px-2 py-2 text-center">
      <strong className="block text-lg tabular-nums">{String(value).padStart(2, "0")}</strong>
      <span className="text-[9px] uppercase tracking-wider text-background/60">{label}</span>
    </span>
  );
}
