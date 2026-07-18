"use client";

import Image from "next/image";
import Link from "next/link";
import { Scale, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/mock-data/products";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearCompare, toggleCompare } from "@/lib/store/slices/commerce-slice";
import { formatCurrency } from "@/lib/utils";

export default function ComparePage() {
  const dispatch = useAppDispatch();
  const ids = useAppSelector((state) => state.commerce.compareIds);
  const products = ids
    .map((id) => PRODUCTS.find((product) => product.id === id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <div className="container-wide py-10 lg:py-14">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Decision helper</p>
          <h1 className="mt-1 font-display text-3xl md:text-4xl">Compare products</h1>
          <p className="mt-2 text-sm text-muted-foreground">Compare up to four items side by side.</p>
        </div>
        {products.length > 0 && (
          <Button variant="outline" onClick={() => dispatch(clearCompare())}>
            Clear all
          </Button>
        )}
      </header>

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border bg-secondary/30 py-20 text-center">
          <Scale className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-display text-2xl">Nothing to compare yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use the scale icon on product cards to add items.
          </p>
          <Button asChild className="mt-5">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <div
            className="grid min-w-[720px] gap-4"
            style={{ gridTemplateColumns: `repeat(${products.length}, minmax(220px, 1fr))` }}
          >
            {products.map((product) => (
              <article key={product.id} className="relative rounded-2xl border bg-background p-4">
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-6 top-6 z-10"
                  onClick={() => dispatch(toggleCompare(product.id))}
                  aria-label={`Remove ${product.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
                  <Image src={product.images[0].url} alt={product.images[0].alt} fill className="object-cover" />
                </div>
                <h2 className="mt-4 font-semibold">{product.name}</h2>
                <p className="mt-1 text-lg font-semibold">{formatCurrency(product.price)}</p>
                <dl className="mt-5 space-y-3 border-t pt-4 text-sm">
                  <Row label="Brand" value={product.brand} />
                  <Row label="Rating" value={`${product.rating}/5`} />
                  <Row label="Stock" value={`${product.stock} units`} />
                  <Row label="Colors" value={String(product.colors.length)} />
                  <Row label="Sizes" value={product.sizes.filter((size) => size.available).map((size) => size.label).join(", ")} />
                </dl>
                <Button asChild className="mt-5 w-full">
                  <Link href={`/product/${product.slug}`}>View product</Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
