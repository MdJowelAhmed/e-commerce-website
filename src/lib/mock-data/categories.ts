import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "cat-women",
    slug: "women",
    name: "Women",
    description: "Curated essentials and statement pieces for the modern woman.",
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    productCount: 124,
    featured: true,
  },
  {
    id: "cat-men",
    slug: "men",
    name: "Men",
    description: "Refined tailoring meets contemporary streetwear.",
    imageUrl:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80",
    productCount: 98,
    featured: true,
  },
  {
    id: "cat-accessories",
    slug: "accessories",
    name: "Accessories",
    description: "Finishing touches: bags, jewelry, eyewear and more.",
    imageUrl:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80",
    productCount: 76,
    featured: true,
  },
  {
    id: "cat-shoes",
    slug: "shoes",
    name: "Footwear",
    description: "Hand-finished footwear designed for every occasion.",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    productCount: 64,
    featured: true,
  },
  {
    id: "cat-home",
    slug: "home",
    name: "Home",
    description: "Considered objects to elevate your space.",
    imageUrl:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    productCount: 42,
  },
  {
    id: "cat-beauty",
    slug: "beauty",
    name: "Beauty",
    description: "Clean, considered beauty rituals.",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aaa2f6f5b026?auto=format&fit=crop&w=1200&q=80",
    productCount: 36,
  },
];
