import type { Category } from "@/types";

import { SITE_IMAGES } from "./media";

export const CATEGORIES: Category[] = [
  {
    id: "cat-women",
    slug: "women",
    name: "Women",
    description: "Curated essentials and statement pieces for the modern woman.",
    imageUrl: SITE_IMAGES.catWomen,
    productCount: 124,
    featured: true,
  },
  {
    id: "cat-men",
    slug: "men",
    name: "Men",
    description: "Refined tailoring meets contemporary streetwear.",
    imageUrl: SITE_IMAGES.catMen,
    productCount: 98,
    featured: true,
  },
  {
    id: "cat-accessories",
    slug: "accessories",
    name: "Accessories",
    description: "Finishing touches: bags, jewelry, eyewear and more.",
    imageUrl: SITE_IMAGES.catAccessories,
    productCount: 76,
    featured: true,
  },
  {
    id: "cat-shoes",
    slug: "shoes",
    name: "Footwear",
    description: "Hand-finished footwear designed for every occasion.",
    imageUrl: SITE_IMAGES.catShoes,
    productCount: 64,
    featured: true,
  },
  {
    id: "cat-home",
    slug: "home",
    name: "Home",
    description: "Considered objects to elevate your space.",
    imageUrl: SITE_IMAGES.catHome,
    productCount: 42,
  },
  {
    id: "cat-beauty",
    slug: "beauty",
    name: "Beauty",
    description: "Clean, considered beauty rituals.",
    imageUrl: SITE_IMAGES.catBeauty,
    productCount: 36,
  },
];
