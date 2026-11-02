"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Scale, Search, ShoppingBag, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { isNavLinkActive } from "@/lib/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectCartCount, selectWishlistItems } from "@/lib/store/selectors";
import { setCartOpen, setMobileMenuOpen, setSearchOpen } from "@/lib/store/slices/ui-slice";
import { cn } from "@/lib/utils";

import { CurrencySwitcher } from "./currency-switcher";
import { ProfileMenu } from "./profile-menu";

export function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const storeReady = useAppSelector((state) => state.ui.storeReady);
  const cartCount = useAppSelector(selectCartCount);
  const wishlist = useAppSelector(selectWishlistItems);
  const compareCount = useAppSelector((state) => state.commerce.compareIds.length);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        dispatch(setSearchOpen(true));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  const displayCart = storeReady ? cartCount : 0;
  const displayWishlist = storeReady ? wishlist.length : 0;

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
            const isActive = isNavLinkActive(link.href, pathname, search);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
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

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Unified Single Search Trigger (Desktop: interactive search bar | Mobile: single icon) */}
          <button
            type="button"
            onClick={() => dispatch(setSearchOpen(true))}
            className="hidden md:flex items-center gap-2.5 h-9 rounded-full border border-border/80 bg-secondary/40 px-3.5 text-xs text-muted-foreground transition hover:border-foreground/30 hover:bg-secondary/70 hover:text-foreground"
            aria-label="Search products with AI"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-normal">Search or ask AI...</span>
            <span className="flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              <Sparkles className="h-2.5 w-2.5 text-amber-500" />
              <span>AI</span>
            </span>
            <kbd className="hidden lg:inline-flex rounded border bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Search"
            aria-keyshortcuts="Control+K"
            onClick={() => dispatch(setSearchOpen(true))}
          >
            <Search className="h-5 w-5" />
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
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative hidden sm:inline-flex"
            aria-label="Compare"
          >
            <Link href="/compare">
              <Scale className="h-5 w-5" />
              {storeReady && compareCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {compareCount}
                </span>
              )}
            </Link>
          </Button>
          <CurrencySwitcher />
          <ProfileMenu />
        </div>
      </div>
    </motion.header>
  );
}
