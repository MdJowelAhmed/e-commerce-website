import { Suspense } from "react";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { FloatingCompareBar } from "@/components/layout/floating-compare-bar";
import { Footer } from "@/components/layout/footer";
import { LiveChatWidget } from "@/components/layout/live-chat-widget";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Navbar } from "@/components/layout/navbar";
import { NewsletterPopup } from "@/components/layout/newsletter-popup";
import { SearchDialog } from "@/components/layout/search-dialog";
import { AbandonedCartTracker } from "@/features/cart/components/abandoned-cart-tracker";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Suspense fallback={<div className="h-16 border-b md:h-20" />}>
        <Navbar />
      </Suspense>
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <Suspense>
        <MobileMenu />
      </Suspense>
      <SearchDialog />
      <AbandonedCartTracker />
      <FloatingCompareBar />
      <LiveChatWidget />
      <NewsletterPopup />
    </div>
  );
}
