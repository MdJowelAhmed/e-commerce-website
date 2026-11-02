"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const image = images[active] ?? images[0];

  useEffect(() => {
    setActive(0);
  }, [images]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActive((a) => (a === images.length - 1 ? 0 : a + 1));
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActive((a) => (a === 0 ? images.length - 1 : a - 1));
  };

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[88px_1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border bg-secondary transition-all lg:w-full",
                i === active ? "border-foreground" : "border-transparent hover:border-border",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="88px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <div className="order-1 lg:order-2">
          <div
            ref={imageRef}
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary cursor-zoom-in"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setLightboxOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={image.url}
                  alt={image.alt || productName}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={cn(
                    "object-cover transition-transform duration-300 ease-out",
                    zoom && "scale-[1.6]",
                  )}
                  style={
                    zoom
                      ? { transformOrigin: `${pos.x}% ${pos.y}%` }
                      : undefined
                  }
                />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className="absolute right-3 top-3 hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur shadow-sm transition hover:bg-white group-hover:flex"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Fullscreen
            </button>

            <button
              type="button"
              onClick={prevImage}
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition hover:bg-white md:flex"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm transition hover:bg-white md:flex"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none text-white shadow-2xl">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full flex items-center justify-center">
            <Image
              src={image.url}
              alt={image.alt || productName}
              fill
              className="object-contain"
              priority
            />

            {/* Navigation inside Lightbox */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition backdrop-blur border border-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition backdrop-blur border border-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Bottom info */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-between px-6 text-xs text-white/80">
              <span className="font-medium truncate max-w-sm">{productName}</span>
              <span>
                {active + 1} / {images.length}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
