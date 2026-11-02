"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { formatCurrency } from "@/lib/utils";
import type { SupportedCurrency } from "@/lib/store/slices/commerce-slice";

const RATES: Record<
  SupportedCurrency,
  { rate: number; locale: string; fraction: number }
> = {
  BDT: { rate: 1, locale: "en-BD", fraction: 0 },
  USD: { rate: 1 / 120, locale: "en-US", fraction: 2 },
  EUR: { rate: 1 / 130, locale: "de-DE", fraction: 2 },
};

export function useCurrencyPrice() {
  const currency = useAppSelector(
    (state) => state.commerce.currency ?? "BDT",
  ) as SupportedCurrency;
  const cfg = RATES[currency] ?? RATES.BDT;

  const format = (amountInBDT: number) => {
    const converted = amountInBDT * cfg.rate;
    return formatCurrency(converted, {
      currency,
      locale: cfg.locale,
      maximumFractionDigits: cfg.fraction,
    });
  };

  return { currency, format };
}

