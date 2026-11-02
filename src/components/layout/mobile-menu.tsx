"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Award,
  ChevronRight,
  Crown,
  Gift,
  LogIn,
  Package,
  RotateCcw,
  Search,
  Sparkles,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { isNavLinkActive } from "@/lib/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setMobileMenuOpen, setSearchOpen } from "@/lib/store/slices/ui-slice";

const ACCOUNT_LINKS = [
  { href: "/account", label: "My Account", icon: User },
  { href: "/orders", label: "My Orders", icon: Package },
  { href: "/custom-offer", label: "Custom Offer", icon: Gift },
  { href: "/returns", label: "Returns", icon: RotateCcw },
  { href: "/rewards", label: "Rewards", icon: Award },
  { href: "/membership", label: "Membership", icon: Crown },
] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

export function MobileMenu() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.mobileMenuOpen);
  const pathname = usePathname();
  const search = useSearchParams().toString();

  return (
    <Sheet open={open} onOpenChange={(v) => dispatch(setMobileMenuOpen(v))}>
      <SheetContent side="left" className="flex w-full max-w-sm flex-col gap-0 p-0">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="font-display text-2xl tracking-tight">
            {SITE_CONFIG.name}
          </SheetTitle>
        </SheetHeader>
        <motion.nav
          className="flex-1 overflow-y-auto px-2 py-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <Link
              href="/search"
              onClick={() => dispatch(setMobileMenuOpen(false))}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors bg-primary/10 text-primary hover:bg-primary/20 mb-2"
            >
              <span className="inline-flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                ✨ AI Semantic Search
              </span>
              <ChevronRight className="h-4 w-4 text-primary" />
            </Link>
          </motion.div>
          {NAV_LINKS.map((link) => {
            const isActive = isNavLinkActive(link.href, pathname, search);
            return (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  aria-current={isActive ? "page" : undefined}
                  className="group flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-secondary"
                >
                  <span className={isActive ? "text-foreground" : "text-foreground/80"}>
                    {link.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
          <motion.p
            variants={itemVariants}
            className="px-4 pb-1 pt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground"
          >
            Account
          </motion.p>
          {ACCOUNT_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = isNavLinkActive(link.href, pathname, search);
            return (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  aria-current={isActive ? "page" : undefined}
                  className="group flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-secondary"
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className={isActive ? "text-foreground" : "text-foreground/80"}>
                      {link.label}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
        <div className="border-t p-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/login" onClick={() => dispatch(setMobileMenuOpen(false))}>
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
