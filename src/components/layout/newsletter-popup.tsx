"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Copy, Gift, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem("luxe.newsletter_dismissed");
    if (dismissed) return;

    // Show after 5 seconds on first visit
    const timer = setTimeout(() => {
      setOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("luxe.newsletter_dismissed", "true");
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText("LUXE10");
      setCopied(true);
      toast.success("Coupon code LUXE10 copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("You are subscribed! Enjoy 10% off with LUXE10.");
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border border-border/80 shadow-2xl rounded-3xl bg-background">
        <div className="relative p-6 sm:p-8 text-center">
          {/* Badge */}
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Gift className="h-6 w-6" />
          </div>

          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">
            Welcome to Luxe
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1 text-foreground">
            Get 10% Off Your Order
          </h2>
          <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
            Subscribe to our weekly VIP drops and unlock 10% off your next purchase.
          </p>

          {/* Coupon Code Pill */}
          <div className="my-5 flex items-center justify-between border border-dashed border-primary/50 bg-primary/5 rounded-2xl p-3">
            <div className="text-left">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                Special Promo Code
              </p>
              <p className="font-mono text-base font-bold text-primary">LUXE10</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyCode}
              className="h-8 gap-1.5 text-xs rounded-xl"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Copied" : "Copy Code"}
            </Button>
          </div>

          {/* Email Subscription Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="text-xs text-center h-10 rounded-xl"
            />
            <Button type="submit" className="w-full rounded-xl">
              Unlock VIP Access
            </Button>
          </form>

          <p className="text-[10px] text-muted-foreground mt-3">
            No spam, ever. Unsubscribe anytime with 1-click.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

