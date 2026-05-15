"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Facebook, Instagram, Loader2, Mail, Twitter, Youtube } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FOOTER_LINKS, SITE_CONFIG } from "@/lib/constants";
import { useSubscribeNewsletterMutation } from "@/lib/store/services/api";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t bg-secondary/40">
      <NewsletterBlock />
      <div className="container-wide grid gap-10 py-14 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
              <span className="font-display text-lg font-bold leading-none">L</span>
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {SITE_CONFIG.description}
          </p>
          <div className="mt-5 flex gap-1">
            <SocialLink href={SITE_CONFIG.social.instagram} label="Instagram">
              <Instagram className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={SITE_CONFIG.social.twitter} label="Twitter">
              <Twitter className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={SITE_CONFIG.social.facebook} label="Facebook">
              <Facebook className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={SITE_CONFIG.social.youtube} label="YouTube">
              <Youtube className="h-4 w-4" />
            </SocialLink>
          </div>
        </div>
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="text-sm font-semibold">{heading}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
          <p>
            Crafted with care · {SITE_CONFIG.contact.email}
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button asChild variant="ghost" size="icon" aria-label={label}>
      <Link href={href} target="_blank" rel="noreferrer">
        {children}
      </Link>
    </Button>
  );
}

function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [subscribe, { isLoading }] = useSubscribeNewsletterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscribe({ email }).unwrap();
      toast.success("Welcome to the list — keep an eye on your inbox.");
      setEmail("");
    } catch {
      toast.error("Please enter a valid email.");
    }
  };

  return (
    <div className="border-b">
      <div className="container-wide grid gap-6 py-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-3xl tracking-tight">
            Inside Luxe — first looks, before everyone else.
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            New collections, private events, and the occasional poetic newsletter.
          </p>
        </motion.div>
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-12 pl-11"
            />
          </div>
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
