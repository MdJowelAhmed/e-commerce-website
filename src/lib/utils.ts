import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { CURRENCY } from "@/lib/constants";

/**
 * Combine class names with Tailwind-aware conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as a currency string. Defaults to the storefront currency.
 */
export function formatCurrency(
  amount: number,
  options: { currency?: string; locale?: string; maximumFractionDigits?: number } = {},
): string {
  const {
    currency = CURRENCY.code,
    locale = CURRENCY.locale,
    maximumFractionDigits = 0,
  } = options;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(amount);
}

/**
 * Format a date as a human-readable string.
 */
export function formatDate(
  date: string | number | Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
): string {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
}

/**
 * Calculate the discount percentage between two prices.
 */
export function calculateDiscount(price: number, comparePrice?: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

/**
 * Clamp a number between a min and max value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce helper for client-side event handlers.
 */
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay = 200,
): (...args: TArgs) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: TArgs) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
