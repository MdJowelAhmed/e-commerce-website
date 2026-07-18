export const SITE_CONFIG = {
  name: "Luxe",
  tagline: "Premium goods for modern living",
  description:
    "A premium production-ready eCommerce experience: curated collections, fast checkout, and beautifully crafted UX.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  contact: {
    email: "support@luxe.example",
    phone: "+1 (555) 010-2024",
  },
  social: {
    twitter: "https://twitter.com/",
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
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
  ],
  Legal: [
    { href: "/about", label: "Privacy overview" },
    { href: "/about", label: "Terms overview" },
  ],
} as const;

export const CURRENCY = {
  code: "USD",
  symbol: "$",
  locale: "en-US",
} as const;

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD = 75;
export const STANDARD_SHIPPING_FEE = 6.99;
export const EXPRESS_SHIPPING_FEE = 14.99;

export const PRODUCTS_PER_PAGE = 12;
