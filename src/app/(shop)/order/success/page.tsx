"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, Mail, MessageCircle, Package, Truck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("n") ?? "LX-100000";
  const email = params.get("email") ?? "";
  const [copied, setCopied] = useState(false);
  const whatsappText = `Hi Luxe, I just placed order ${orderNumber}.`;
  const whatsappHref = `${SITE_CONFIG.social.whatsapp}?text=${encodeURIComponent(whatsappText)}`;

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      toast.success("Order number copied");
    } catch {
      toast.error("Could not copy the order number");
    }
  };

  return (
    <div className="container-tight py-16 lg:py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border bg-background p-8 text-center md:p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 220 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/10"
        >
          <CheckCircle2 className="h-10 w-10 text-success" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 font-display text-3xl tracking-tight md:text-4xl"
        >
          Thank you for your order
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-sm text-muted-foreground"
        >
          Order <span className="font-medium text-foreground">{orderNumber}</span> is confirmed.
          {email ? ` A receipt is on its way to ${email}.` : " We've sent the details to your email."}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.7 } },
          }}
          className="mt-8 grid gap-3 text-left sm:grid-cols-3"
        >
          {[
            { icon: Mail, title: "Confirmation sent", body: "Check your inbox shortly." },
            { icon: Package, title: "Packing your order", body: "Hand-picked & inspected." },
            { icon: Truck, title: "Shipping next", body: "You'll receive tracking soon." },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className="rounded-2xl border bg-secondary/40 p-4"
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-background">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm font-semibold">{step.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.body}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={copyNumber}>
            <Copy className="h-4 w-4" />
            {copied ? "Copied" : "Copy order number"}
          </Button>
          <Button asChild variant="outline">
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              Send on WhatsApp
            </a>
          </Button>
          <Button asChild>
            <Link href="/orders">Track your order</Link>
          </Button>
        </div>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {email && (
            <Button asChild variant="secondary">
              <Link href={`/register?email=${encodeURIComponent(email)}`}>
                Create an account with this email
              </Link>
            </Button>
          )}
          <Button asChild variant="ghost">
            <Link href="/products">Continue shopping</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
