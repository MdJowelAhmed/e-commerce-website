"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMounted } from "@/hooks/use-mounted";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setCurrency,
  type SupportedCurrency,
} from "@/lib/store/slices/commerce-slice";

const CURRENCIES: { code: SupportedCurrency; symbol: string; label: string }[] = [
  { code: "BDT", symbol: "৳", label: "BDT (৳)" },
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
];

export function CurrencySwitcher() {
  const mounted = useMounted();
  const dispatch = useAppDispatch();
  const currency = useAppSelector((state) => state.commerce.currency ?? "BDT");

  if (!mounted) {
    return (
      <div className="h-8 w-16 rounded-md bg-secondary/50 animate-pulse hidden sm:inline-block" />
    );
  }

  const current = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  const handleSelect = (code: SupportedCurrency) => {
    dispatch(setCurrency(code));
    toast.success(`Currency switched to ${code}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          aria-label="Select currency"
        >
          <span className="font-semibold text-foreground">{current.symbol}</span>
          <span>{current.code}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {CURRENCIES.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => handleSelect(c.code)}
            className="flex items-center justify-between text-xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="font-semibold">{c.symbol}</span>
              <span>{c.code}</span>
            </span>
            {c.code === currency && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

