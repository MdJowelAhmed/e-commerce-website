"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface ActionTooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

/**
 * Desktop: hover tooltip.
 * Mobile / touch: tap or press shows the same label briefly so icon actions stay clear.
 */
export function ActionTooltip({
  label,
  children,
  side = "left",
  className,
}: ActionTooltipProps) {
  const isTouch = useMediaQuery("(hover: none), (pointer: coarse)");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const showOnTouch = () => {
    if (!isTouch) return;
    setOpen(true);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 1600);
  };

  return (
    <Tooltip
      delayDuration={isTouch ? 0 : 120}
      open={isTouch ? open : undefined}
      onOpenChange={isTouch ? setOpen : undefined}
    >
      <TooltipTrigger asChild>
        <span
          className={cn("inline-flex", className)}
          onPointerDown={showOnTouch}
          onFocus={showOnTouch}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={8}
        className="max-w-[11rem] rounded-lg border border-border bg-foreground px-2.5 py-1.5 text-center text-[11px] font-medium leading-snug text-background shadow-lg"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
