"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center px-6 py-20">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Something went wrong</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">This page didn&apos;t load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Try again. If it keeps happening, head back to the shop.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
