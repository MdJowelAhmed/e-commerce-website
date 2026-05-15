"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl text-center"
      >
        <p className="font-display text-[140px] leading-none tracking-tighter text-foreground/10 md:text-[200px]">
          404
        </p>
        <h1 className="-mt-8 font-display text-3xl tracking-tight md:text-4xl">
          We couldn't find that page
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          The link may be broken, or the page may have been moved. Let's get you back.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" />
              Shop the collection
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
