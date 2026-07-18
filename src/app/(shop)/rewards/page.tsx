"use client";

import { Award, Copy, Gift, Share2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppSelector } from "@/lib/store/hooks";

export default function RewardsPage() {
  const { loyaltyPoints, referralCode, signedInEmail } = useAppSelector(
    (state) => state.commerce,
  );
  const nextReward = 500;

  const copyCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied");
  };

  return (
    <div className="container-wide py-10 lg:py-14">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Luxe Circle</p>
        <h1 className="mt-1 font-display text-4xl">Rewards & referrals</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {signedInEmail ? `Demo account: ${signedInEmail}` : "Sign in to sync these demo rewards."}
        </p>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border bg-foreground p-6 text-background lg:col-span-2">
          <Award className="h-8 w-8" />
          <p className="mt-8 text-sm text-background/70">Available balance</p>
          <p className="font-display text-5xl">{loyaltyPoints} points</p>
          <Progress value={(loyaltyPoints / nextReward) * 100} className="mt-6 bg-background/20" />
          <p className="mt-2 text-xs text-background/70">
            {Math.max(0, nextReward - loyaltyPoints)} more points to unlock ৳500 off.
          </p>
        </section>

        <section className="rounded-2xl border p-6">
          <Share2 className="h-7 w-7" />
          <h2 className="mt-5 font-display text-2xl">Give ৳300, get ৳300</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your code. Credit is added after your friend completes an order.
          </p>
          <Button variant="outline" className="mt-5 w-full justify-between" onClick={copyCode}>
            {referralCode}
            <Copy className="h-4 w-4" />
          </Button>
        </section>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Benefit icon={ShoppingBag} title="1 point per ৳10" description="Earn on every purchase." />
        <Benefit icon={Gift} title="Birthday reward" description="A member-only surprise." />
        <Benefit icon={Award} title="Early access" description="Shop selected drops first." />
      </div>
    </div>
  );
}

function Benefit({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Award;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border p-5">
      <Icon className="h-5 w-5" />
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </article>
  );
}
