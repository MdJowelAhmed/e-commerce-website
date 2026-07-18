"use client";

import { useState } from "react";
import {
  Banknote,
  CalendarDays,
  Check,
  Crown,
  Gem,
  Medal,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MEMBERSHIP_TIERS,
  type MembershipTier,
} from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  activateMembership,
  cancelMembership,
} from "@/lib/store/slices/commerce-slice";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const TIER_ORDER = ["silver", "gold", "platinum"] as const;

const TIER_STYLES = {
  silver: {
    icon: Medal,
    card: "border-slate-300 bg-gradient-to-br from-slate-50 via-white to-slate-200/70 dark:from-slate-900 dark:via-slate-950 dark:to-slate-800",
    iconWrap: "bg-slate-700 text-white",
    accent: "text-slate-700 dark:text-slate-200",
    button: "bg-slate-800 text-white hover:bg-slate-700",
  },
  gold: {
    icon: Crown,
    card: "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-200/70 dark:from-amber-950 dark:via-slate-950 dark:to-amber-900",
    iconWrap: "bg-amber-500 text-amber-950",
    accent: "text-amber-700 dark:text-amber-300",
    button: "bg-amber-500 text-amber-950 hover:bg-amber-400",
  },
  platinum: {
    icon: Gem,
    card: "border-violet-400 bg-gradient-to-br from-violet-950 via-slate-950 to-fuchsia-950 text-white",
    iconWrap: "bg-violet-400 text-violet-950",
    accent: "text-violet-300",
    button: "bg-violet-400 text-violet-950 hover:bg-violet-300",
  },
} as const;

// Demo progress. Replace with authenticated order analytics when a backend is connected.
const MEMBER_PROGRESS = {
  spend: 18_450,
  orders: 5,
  activeMonths: 3,
};

export default function MembershipPage() {
  const dispatch = useAppDispatch();
  const [activating, setActivating] = useState<MembershipTier>("none");
  const currentTier = useAppSelector((state) => state.commerce.membershipTier);
  const expiresAt = useAppSelector((state) => state.commerce.membershipExpiresAt);

  const activate = async (tier: Exclude<MembershipTier, "none">) => {
    setActivating(tier);
    await new Promise((resolve) => setTimeout(resolve, 450));
    dispatch(activateMembership(tier));
    setActivating("none");
    toast.success(`${MEMBERSHIP_TIERS[tier].name} membership activated for 12 months`);
  };

  return (
    <div className="container-wide py-10 lg:py-14">
      <header className="relative overflow-hidden rounded-[2rem] bg-foreground px-6 py-12 text-background md:px-10 lg:py-16">
        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-3xl">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-background/65">
            <Sparkles className="h-4 w-4 text-accent" />
            Luxe Membership
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-tight md:text-6xl">
            More rewards with every order.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-background/70 md:text-base">
            Join annually or qualify through consistent shopping activity. Your
            active tier automatically applies its discount at cart and checkout.
          </p>
        </div>

        {currentTier !== "none" && (
          <div className="relative mt-8 flex max-w-2xl flex-col gap-4 rounded-2xl border border-background/15 bg-background/10 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-background/60">
                Current membership
              </p>
              <p className="mt-1 font-display text-2xl">
                {MEMBERSHIP_TIERS[currentTier].name} ·{" "}
                {MEMBERSHIP_TIERS[currentTier].discount}% discount
              </p>
              {expiresAt && (
                <p className="mt-1 text-xs text-background/60">
                  Active until {formatDate(expiresAt, { dateStyle: "long" })}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                dispatch(cancelMembership());
                toast.success("Demo membership cancelled");
              }}
            >
              Cancel membership
            </Button>
          </div>
        )}
      </header>

      <section className="mt-10">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Choose your tier
          </p>
          <h2 className="mt-1 font-display text-3xl">Membership plans</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pay the annual fee now, or unlock a tier after meeting all three
            activity requirements during a rolling 12-month period.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {TIER_ORDER.map((tier) => {
            const plan = MEMBERSHIP_TIERS[tier];
            const style = TIER_STYLES[tier];
            const Icon = style.icon;
            const isCurrent = currentTier === tier;
            const mutedText =
              tier === "platinum" ? "text-white/60" : "text-muted-foreground";

            return (
              <article
                key={tier}
                className={cn(
                  "relative flex min-h-[620px] flex-col overflow-hidden rounded-[1.75rem] border p-6 shadow-sm",
                  style.card,
                  isCurrent && "ring-2 ring-accent ring-offset-2 ring-offset-background",
                )}
              >
                {tier === "gold" && (
                  <Badge className="absolute right-5 top-5 bg-amber-500 text-amber-950">
                    Most popular
                  </Badge>
                )}
                {isCurrent && tier !== "gold" && (
                  <Badge variant="success" className="absolute right-5 top-5">
                    Active
                  </Badge>
                )}

                <div className={cn("grid h-12 w-12 place-items-center rounded-2xl", style.iconWrap)}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className={cn("mt-6 text-xs uppercase tracking-[0.2em]", style.accent)}>
                  {plan.name} member
                </p>
                <h3 className="mt-2 font-display text-4xl">{plan.discount}% off</h3>
                <p className={cn("mt-2 text-sm", mutedText)}>
                  Automatically applied when this is your best available discount.
                </p>

                <div className="my-6 border-t border-current/10" />

                <p className={cn("text-xs uppercase tracking-wider", mutedText)}>
                  Join instantly
                </p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="font-display text-3xl">
                    {formatCurrency(plan.annualFee)}
                  </span>
                  <span className={cn("pb-1 text-xs", mutedText)}>/ 12 months</span>
                </div>

                <div className="my-6 border-t border-current/10" />

                <p className={cn("text-xs uppercase tracking-wider", mutedText)}>
                  Or qualify with all of these
                </p>
                <div className="mt-4 space-y-3">
                  <Requirement
                    icon={Banknote}
                    label="Total eligible spend"
                    value={`${formatCurrency(plan.minSpend)}+`}
                    muted={tier === "platinum"}
                  />
                  <Requirement
                    icon={ShoppingBag}
                    label="Completed orders"
                    value={`${plan.minOrders}+ orders`}
                    muted={tier === "platinum"}
                  />
                  <Requirement
                    icon={CalendarDays}
                    label="Active ordering"
                    value={`${plan.activeMonths}+ months`}
                    muted={tier === "platinum"}
                  />
                </div>

                <div className="mt-6 space-y-2">
                  {plan.benefits.map((benefit) => (
                    <p key={benefit} className="flex items-center gap-2 text-sm">
                      <span className={cn("grid h-5 w-5 place-items-center rounded-full", style.iconWrap)}>
                        <Check className="h-3 w-3" />
                      </span>
                      {benefit}
                    </p>
                  ))}
                </div>

                <Button
                  type="button"
                  size="lg"
                  className={cn("mt-auto w-full", style.button)}
                  disabled={isCurrent || activating !== "none"}
                  onClick={() => activate(tier)}
                >
                  {isCurrent
                    ? "Current membership"
                    : activating === tier
                      ? "Activating…"
                      : `Join ${plan.name}`}
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-12 grid gap-6 rounded-[2rem] border bg-secondary/35 p-6 lg:grid-cols-[1fr_1.2fr] lg:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Your activity
          </p>
          <h2 className="mt-2 font-display text-3xl">Membership progress</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This template uses demo progress. With a real account backend, paid
            and delivered orders would update these values automatically.
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-xl border bg-background p-3 text-sm">
            <ShieldCheck className="h-5 w-5 text-success" />
            Only completed, non-refunded orders count toward qualification.
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <ProgressCard
            label="Eligible spend"
            value={formatCurrency(MEMBER_PROGRESS.spend)}
            progress={(MEMBER_PROGRESS.spend / MEMBERSHIP_TIERS.silver.minSpend) * 100}
          />
          <ProgressCard
            label="Completed orders"
            value={`${MEMBER_PROGRESS.orders} orders`}
            progress={(MEMBER_PROGRESS.orders / MEMBERSHIP_TIERS.silver.minOrders) * 100}
          />
          <ProgressCard
            label="Active months"
            value={`${MEMBER_PROGRESS.activeMonths} months`}
            progress={(MEMBER_PROGRESS.activeMonths / MEMBERSHIP_TIERS.silver.activeMonths) * 100}
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl">How membership works</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <InfoCard
            number="01"
            title="Custom Offer + Membership stack"
            body="Custom Offer discount applies to your bundle first. Membership discount then applies to the remaining order total. A coupon is used only if it beats that combined saving."
          />
          <InfoCard
            number="02"
            title="Valid for 12 months"
            body="Paid and earned memberships stay active for 12 months. Renew or re-qualify before expiry."
          />
          <InfoCard
            number="03"
            title="Refund-safe progress"
            body="Cancelled and refunded orders do not count. Their spend and order credit are removed from progress."
          />
        </div>
      </section>
    </div>
  );
}

function Requirement({
  icon: Icon,
  label,
  value,
  muted,
}: {
  icon: typeof Banknote;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("grid h-9 w-9 place-items-center rounded-xl bg-black/5", muted && "bg-white/10")}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className={cn("text-xs text-muted-foreground", muted && "text-white/60")}>{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function ProgressCard({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress: number;
}) {
  return (
    <article className="rounded-2xl border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
      <Progress value={Math.min(100, progress)} className="mt-4 h-2" />
    </article>
  );
}

function InfoCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-2xl border p-5">
      <p className="text-xs font-semibold text-accent">{number}</p>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}
