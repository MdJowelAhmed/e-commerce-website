import type { AddressFormValues } from "@/features/checkout/schemas";
import type { PaymentMethod } from "@/types";

const ADDRESS_KEY = "luxe.checkout.address";
const PAYMENT_KEY = "luxe.checkout.payment";

export type SavedPayment = {
  method: PaymentMethod;
  last4?: string;
};

export function loadAddressDraft(): AddressFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ADDRESS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AddressFormValues;
  } catch {
    return null;
  }
}

export function saveAddressDraft(address: AddressFormValues): void {
  window.sessionStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
}

export function loadPaymentDraft(): SavedPayment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PAYMENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedPayment;
    if (parsed.method !== "card" && parsed.method !== "paypal" && parsed.method !== "cod") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function savePaymentDraft(payment: SavedPayment): void {
  window.sessionStorage.setItem(PAYMENT_KEY, JSON.stringify(payment));
}

export function clearCheckoutDraft(): void {
  window.sessionStorage.removeItem(ADDRESS_KEY);
  window.sessionStorage.removeItem(PAYMENT_KEY);
}
