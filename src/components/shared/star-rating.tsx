import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const SIZE_MAP = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" } as const;

export function StarRating({
  value,
  max = 5,
  size = "sm",
  showValue,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => {
          const filled = value >= i + 1;
          const partial = !filled && value > i;
          return (
            <span key={i} className="relative">
              <Star className={cn(SIZE_MAP[size], "text-muted-foreground/40")} />
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? "100%" : `${(value - i) * 100}%` }}
                >
                  <Star className={cn(SIZE_MAP[size], "fill-amber-400 text-amber-400")} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-muted-foreground">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
