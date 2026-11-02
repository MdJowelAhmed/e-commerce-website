"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ProductSocialShareProps {
  productName: string;
  url?: string;
}

export function ProductSocialShare({ productName, url }: ProductSocialShareProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (url) return url;
    if (typeof window !== "undefined") return window.location.href;
    return "";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      toast.success("Product link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleWhatsApp = () => {
    const text = `Check out this product: ${productName} - ${getUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
        <Share2 className="h-3.5 w-3.5" /> Share:
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="h-8 gap-1.5 text-xs rounded-full px-3"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy Link"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsApp}
        className="h-8 gap-1.5 text-xs rounded-full px-3 text-emerald-600 hover:text-emerald-700"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleFacebook}
        className="h-8 gap-1.5 text-xs rounded-full px-3 text-blue-600 hover:text-blue-700"
      >
        Facebook
      </Button>
    </div>
  );
}

