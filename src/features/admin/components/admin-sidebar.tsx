"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChartBar,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: ChartBar },
  { href: "/admin/promotions", label: "Promotions", icon: Tag },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r bg-background lg:flex lg:w-64 lg:flex-col">
      <div className="border-b p-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
            <span className="font-display text-lg font-bold leading-none">L</span>
          </div>
          <div>
            <p className="font-display text-lg leading-none tracking-tight">{SITE_CONFIG.name}</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Admin</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {LINKS.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground",
                isActive && "text-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="admin-nav-bg"
                  className="absolute inset-0 -z-10 rounded-xl bg-secondary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </Button>
      </div>
    </aside>
  );
}
