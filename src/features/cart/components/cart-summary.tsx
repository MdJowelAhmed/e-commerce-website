"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, TicketPercent } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectCartTotals } from "@/lib/store/selectors";
import {
  applyCoupon,
  COUPONS,
  removeCoupon,
} from "@/lib/store/slices/cart-slice";
import { cn, formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  ctaLabel?: string;
  ctaHref?: string;
  onSubmit?: () => void;
  loading?: boolean;
  hideCta?: boolean;
}

export function CartSummary({
  ctaLabel = "Checkout",
  ctaHref = "/checkout",
  onSubmit,
  loading,
  hideCta,
}: CartSummaryProps) {
  const dispatch = useAppDispatch();
  const totals = useAppSelector(selectCartTotals);
  const code = useAppSelector((s) => s.cart.couponCode);
  const discount = useAppSelector((s) => s.cart.couponDiscount);
  const [input, setInput] = useState("");
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    if (!input.trim()) return;
    setApplying(true);
    await new Promise((r) => setTimeout(r, 400));
    const normalized = input.toUpperCase().trim();
    dispatch(applyCoupon(normalized));
    setApplying(false);
    if (COUPONS[normalized]) {
      toast.success(`Coupon ${normalized} applied`);
      setInput("");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const remaining = totals.amountToFreeShipping;
  const showFreeShippingHint =
    totals.shippingMethod === "standard" && remaining > 0 && totals.subtotal > 0;

  return (
    <div className="space-y-5 rounded-2xl border bg-background p-6">
      <h2 className="text-lg font-semibold">Order summary</h2>

      <div>
        {code ? (
          <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success/5 p-3">
            <div>
              <p className="text-sm font-medium text-success">{code} applied</p>
              <p className="text-xs text-muted-foreground">{discount}% off your order</p>
            </div>
            <button
              type="button"
              onClick={() => dispatch(removeCoupon())}
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <TicketPercent className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Promo code"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleApply}
              disabled={applying || !input.trim()}
            >
              {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
            </Button>
          </div>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Try{" "}
          {Object.keys(COUPONS).map((c, i, arr) => (
            <span key={c}>
              <span className="font-medium">{c}</span>
              {i < arr.length - 1 ? (i === arr.length - 2 ? " or " : ", ") : ""}
            </span>
          ))}
        </p>
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
        {totals.discount > 0 && (
          <Row label="Discount" value={`-${formatCurrency(totals.discount)}`} highlight="success" />
        )}
        <Row
          label={totals.shippingMethod === "express" ? "Express shipping" : "Shipping"}
          value={totals.shipping === 0 ? "FREE" : formatCurrency(totals.shipping)}
          highlight={totals.shipping === 0 ? "success" : undefined}
        />
        <Row label="Tax" value={formatCurrency(totals.tax)} />
        {showFreeShippingHint && (
          <p className="rounded-xl bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
            You're {formatCurrency(remaining)} away from free standard shipping.
          </p>
        )}
      </div>

      <Separator />

      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Total</span>
        <motion.span
          key={totals.total}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl tracking-tight"
        >
          {formatCurrency(totals.total)}
        </motion.span>
      </div>

      {!hideCta && (
        <Button
          size="lg"
          className="w-full"
          asChild={!onSubmit}
          onClick={onSubmit}
          disabled={loading || totals.subtotal === 0}
        >
          {onSubmit ? (
            <span>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                ctaLabel
              )}
            </span>
          ) : (
            <Link href={ctaHref}>{ctaLabel}</Link>
          )}
        </Button>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "success";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium text-foreground", highlight === "success" && "text-success")}>
        {value}
      </span>
    </div>
  );
}
