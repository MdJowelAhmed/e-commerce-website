"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const BRANDS = [
  "Atelier Luxe",
  "Studio North",
  "Maison Field",
  "Hearth Studio",
  "Plein Air",
  "Common Thread",
  "House of Pia",
  "Lumière",
];

export function BrandMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const items = [...BRANDS, ...BRANDS, ...BRANDS];

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      gsap.set(track, { force3D: true });

      // Continuous infinite horizontal glide
      const tween = gsap.to(track, {
        xPercent: -33.333,
        ease: "none",
        duration: 25,
        repeat: -1,
      });

      // QuickTo pipe to smoothly interpolate timeScale (speed)
      const speedTo = gsap.quickTo(tween, "timeScale", { duration: 0.6, ease: "power2.out" });

      let lastScrollY = window.scrollY;
      let scrollTimeout: NodeJS.Timeout;

      const onScroll = () => {
        const currentScrollY = window.scrollY;
        const delta = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;

        // Boost speed based on scroll velocity (capped at 3.5x)
        const boost = 1 + Math.min(delta * 0.04, 2.8);
        speedTo(boost);

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          speedTo(1); // Smoothly ease back to cruise speed
        }, 120);
      };

      const onMouseEnter = () => speedTo(0.35); // Slow down for readability
      const onMouseLeave = () => speedTo(1);

      window.addEventListener("scroll", onScroll, { passive: true });
      const container = containerRef.current;
      if (container) {
        container.addEventListener("mouseenter", onMouseEnter);
        container.addEventListener("mouseleave", onMouseLeave);
      }

      return () => {
        window.removeEventListener("scroll", onScroll);
        if (container) {
          container.removeEventListener("mouseenter", onMouseEnter);
          container.removeEventListener("mouseleave", onMouseLeave);
        }
        tween.kill();
      };
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="border-y bg-background/50 py-10 backdrop-blur-sm select-none overflow-hidden">
      <p className="text-center text-xs uppercase tracking-[0.24em] text-muted-foreground font-medium">
        As featured in luxury editorials
      </p>
      <div className="mt-6 overflow-hidden flex">
        <div ref={trackRef} className="flex gap-16 whitespace-nowrap will-change-transform">
          {items.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="font-display text-2xl tracking-tight text-muted-foreground/60 transition-colors hover:text-foreground sm:text-3xl cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
