import Link from "next/link";

import { SITE_CONFIG } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80')",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-foreground">
              <span className="font-display text-lg font-bold leading-none">L</span>
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-white/70">A few words from us</p>
            <h2 className="mt-3 max-w-md font-display text-3xl leading-tight">
              "Beautifully made things, served beautifully."
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/70">
              Sign in to track orders, manage your wishlist, and unlock member-only previews.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background">
              <span className="font-display text-lg font-bold leading-none">L</span>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
            Back to home
          </Link>
        </header>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
