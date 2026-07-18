"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Heart, Menu, Scale, Search, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectCartCount, selectWishlistItems } from "@/lib/store/selectors";
import { setCartOpen, setMobileMenuOpen, setSearchOpen } from "@/lib/store/slices/ui-slice";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const cartCount = useAppSelector(selectCartCount);
  const wishlist = useAppSelector(selectWishlistItems);
  const compareCount = useAppSelector((state) => state.commerce.compareIds.length);

  useEffect(() => {
    setHydrated(true);
    const handler = () => setScrolled(window.scrollY > 12);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const displayCart = hydrated ? cartCount : 0;
  const displayWishlist = hydrated ? wishlist.length : 0;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
          : "border-b border-transparent bg-background/80 backdrop-blur-md",
      )}
    >
      <div className="container-wide flex h-16 items-center justify-between gap-4 md:h-20">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => dispatch(setMobileMenuOpen(true))}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="group flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background"
            >
              <span className="font-display text-lg font-bold leading-none">L</span>
            </motion.div>
            <span className="font-display text-xl font-semibold tracking-tight">
              {SITE_CONFIG.name}
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground",
                  isActive && "text-foreground",
                )}
              >
                {link.label}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 bottom-1 h-px bg-foreground"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            onClick={() => dispatch(setSearchOpen(true))}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Account">
            <Link href="/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Rewards" className="hidden sm:inline-flex">
            <Link href="/rewards">
              <Award className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative" aria-label="Compare">
            <Link href="/compare">
              <Scale className="h-5 w-5" />
              {hydrated && compareCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {compareCount}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative" aria-label="Wishlist">
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              <AnimatePresence>
                {displayWishlist > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground"
                  >
                    {displayWishlist}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Open cart"
            onClick={() => dispatch(setCartOpen(true))}
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {displayCart > 0 && (
                <motion.span
                  key={displayCart}
                  initial={{ scale: 0, y: -6 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background"
                >
                  {displayCart}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
