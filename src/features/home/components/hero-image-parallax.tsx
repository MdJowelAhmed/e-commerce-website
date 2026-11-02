"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Sparkles } from "lucide-react";

interface HeroImageParallaxProps {
  imageLeft: string;
  imageRight: string;
}

export function HeroImageParallax({ imageLeft, imageRight }: HeroImageParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !leftCardRef.current || !rightCardRef.current) return;

      // Enable 3D hardware-acceleration
      gsap.set([leftCardRef.current, rightCardRef.current], {
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
        force3D: true,
      });

      if (badgeRef.current) {
        gsap.set(badgeRef.current, { force3D: true });
      }

      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // 1. Initial Cinematic Reveal Animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        leftCardRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: 40,
          rotationY: -10,
          rotationX: 8,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotationY: 0,
          rotationX: 0,
          duration: 1.2,
          delay: 0.2,
        },
      ).fromTo(
        rightCardRef.current,
        {
          opacity: 0,
          scale: 0.88,
          y: 60,
          rotationY: 10,
          rotationX: -6,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotationY: 0,
          rotationX: 0,
          duration: 1.3,
        },
        "-=0.9",
      );

      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, scale: 0.7, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.6",
        );
      }

      if (prefersReducedMotion) return;

      // 2. High-Performance Mouse Movement (quickTo for 120fps with zero GC)
      const hasPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      if (hasPointer) {
        const xToLeft = gsap.quickTo(leftCardRef.current, "x", { duration: 0.9, ease: "power2.out" });
        const yToLeft = gsap.quickTo(leftCardRef.current, "y", { duration: 0.9, ease: "power2.out" });
        const rotXLeft = gsap.quickTo(leftCardRef.current, "rotationX", { duration: 0.9, ease: "power2.out" });
        const rotYLeft = gsap.quickTo(leftCardRef.current, "rotationY", { duration: 0.9, ease: "power2.out" });

        const xToRight = gsap.quickTo(rightCardRef.current, "x", { duration: 1.2, ease: "power2.out" });
        const yToRight = gsap.quickTo(rightCardRef.current, "y", { duration: 1.2, ease: "power2.out" });
        const rotXRight = gsap.quickTo(rightCardRef.current, "rotationX", { duration: 1.2, ease: "power2.out" });
        const rotYRight = gsap.quickTo(rightCardRef.current, "rotationY", { duration: 1.2, ease: "power2.out" });

        let xToBadge: ((v: number) => void) | null = null;
        let yToBadge: ((v: number) => void) | null = null;
        if (badgeRef.current) {
          xToBadge = gsap.quickTo(badgeRef.current, "x", { duration: 0.6, ease: "power2.out" });
          yToBadge = gsap.quickTo(badgeRef.current, "y", { duration: 0.6, ease: "power2.out" });
        }

        const onMouseMove = (e: MouseEvent) => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          // Normalized between -0.5 and 0.5
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;

          // Multi-layer depth parallax
          xToLeft(nx * -24);
          yToLeft(ny * -20);
          rotXLeft(ny * -8);
          rotYLeft(nx * 10);

          xToRight(nx * 32);
          yToRight(ny * 26);
          rotXRight(ny * 8);
          rotYRight(nx * -10);

          if (xToBadge && yToBadge) {
            xToBadge(nx * 44);
            yToBadge(ny * 36);
          }
        };

        const onMouseLeave = () => {
          xToLeft(0);
          yToLeft(0);
          rotXLeft(0);
          rotYLeft(0);

          xToRight(0);
          yToRight(0);
          rotXRight(0);
          rotYRight(0);

          if (xToBadge && yToBadge) {
            xToBadge(0);
            yToBadge(0);
          }
        };

        const target = containerRef.current;
        target.addEventListener("mousemove", onMouseMove, { passive: true });
        target.addEventListener("mouseleave", onMouseLeave, { passive: true });

        return () => {
          target.removeEventListener("mousemove", onMouseMove);
          target.removeEventListener("mouseleave", onMouseLeave);
        };
      } else {
        // Mobile / Touch Devices: ultra-efficient CSS transform oscillation
        gsap.to(leftCardRef.current, {
          y: -12,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(rightCardRef.current, {
          y: 12,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.4,
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative aspect-square lg:aspect-auto h-full w-full select-none"
      style={{ perspective: 1200 }}
    >
      {/* Left Layered Image Card */}
      <div
        ref={leftCardRef}
        className="absolute left-0 top-0 h-[70%] w-[55%] overflow-hidden rounded-3xl border bg-secondary shadow-2xl transition-shadow will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        <Image
          src={imageLeft}
          alt="Luxury Collection Showcase"
          fill
          priority
          sizes="(min-width: 1024px) 30vw, 60vw"
          className="object-cover scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Right Layered Image Card */}
      <div
        ref={rightCardRef}
        className="absolute bottom-0 right-0 h-[75%] w-[60%] overflow-hidden rounded-3xl border bg-secondary shadow-2xl transition-shadow will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        <Image
          src={imageRight}
          alt="Premium Ready-to-Wear"
          fill
          priority
          sizes="(min-width: 1024px) 30vw, 60vw"
          className="object-cover scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Floating 3D Badge */}
      <div
        ref={badgeRef}
        className="glass-card absolute left-[38%] top-[45%] hidden p-3 lg:block z-20 shadow-xl border border-white/40 dark:border-white/10 will-change-transform"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background shadow-md">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-foreground">Free 30-day returns</p>
            <p className="text-muted-foreground">On every order nationwide</p>
          </div>
        </div>
      </div>
    </div>
  );
}

