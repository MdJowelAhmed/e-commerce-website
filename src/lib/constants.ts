export const SITE_CONFIG = {
  name: "Luxe",
  tagline: "Premium goods for modern living",
  description:
    "A premium production-ready eCommerce experience: curated collections, fast checkout, and beautifully crafted UX.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  contact: {
    email: "support@luxe.example",
    phone: "01518792559",
    phoneDisplay: "01518-792559",
    whatsapp: "8801518792559",
  },
  social: {
    whatsapp: "https://wa.me/8801518792559",
    facebook: "https://www.facebook.com/",
    instagram: "https://instagram.com/",
    twitter: "https://twitter.com/",
    youtube: "https://youtube.com/",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/products?category=men", label: "Men" },
  { href: "/products?category=women", label: "Women" },
  { href: "/products?category=accessories", label: "Accessories" },
  { href: "/about", label: "About" },
] as const;

export const FOOTER_LINKS = {
  Shop: [
    { href: "/products", label: "All Products" },
    { href: "/custom-offer", label: "Build Custom Offer" },
    { href: "/products?sort=newest", label: "New Arrivals" },
    { href: "/products?sale=true", label: "On Sale" },
    { href: "/products?featured=true", label: "Featured" },
  ],
  Support: [
    { href: "/orders", label: "Track Order" },
    { href: "/returns", label: "Returns & Refunds" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/compare", label: "Compare Products" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/products", label: "Collections" },
    { href: "/login", label: "Account" },
    { href: "/register", label: "Join Luxe" },
    { href: "/rewards", label: "Rewards" },
    { href: "/membership", label: "Membership" },
  ],
  Legal: [
    { href: "/about", label: "Privacy overview" },
    { href: "/about", label: "Terms overview" },
  ],
} as const;

export const CURRENCY = {
  code: "BDT",
  symbol: "৳",
  locale: "en-BD",
} as const;

export const CUSTOM_OFFER_TIERS = [
  { minimum: 10_000, discount: 15 },
  { minimum: 5_000, discount: 10 },
  { minimum: 2_000, discount: 5 },
] as const;

export function getCustomOfferDiscount(subtotal: number): number {
  return CUSTOM_OFFER_TIERS.find((tier) => subtotal >= tier.minimum)?.discount ?? 0;
}

export type MembershipTier = "none" | "silver" | "gold" | "platinum";

export const MEMBERSHIP_TIERS = {
  silver: {
    name: "Silver",
    annualFee: 999,
    discount: 3,
    minSpend: 10_000,
    minOrders: 3,
    activeMonths: 2,
    color: "slate",
    benefits: ["3% member discount", "Early sale access", "Priority support"],
  },
  gold: {
    name: "Gold",
    annualFee: 2_499,
    discount: 7,
    minSpend: 30_000,
    minOrders: 8,
    activeMonths: 4,
    color: "amber",
    benefits: [
      "7% member discount",
      "Free standard shipping",
      "Double loyalty points",
      "Birthday reward",
    ],
  },
  platinum: {
    name: "Platinum",
    annualFee: 4_999,
    discount: 12,
    minSpend: 75_000,
    minOrders: 15,
    activeMonths: 6,
    color: "violet",
    benefits: [
      "12% member discount",
      "Free express shipping",
      "Triple loyalty points",
      "Priority returns",
      "Exclusive collection access",
    ],
  },
} as const;

export function getMembershipDiscount(tier: MembershipTier): number {
  return tier === "none" ? 0 : MEMBERSHIP_TIERS[tier].discount;
}

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD = 75;
export const STANDARD_SHIPPING_FEE = 6.99;
export const EXPRESS_SHIPPING_FEE = 14.99;

export const PRODUCTS_PER_PAGE = 12;
