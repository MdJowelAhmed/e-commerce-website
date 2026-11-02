import type { Product } from "@/types";

import { PRODUCT_IMAGES } from "./media";

const baseColors = [
  { id: "color-black", name: "Onyx Black", hex: "#0f0f10" },
  { id: "color-white", name: "Ivory", hex: "#f5f1ea" },
  { id: "color-sand", name: "Sand", hex: "#d6c5a8" },
  { id: "color-olive", name: "Olive", hex: "#6b6648" },
  { id: "color-camel", name: "Camel", hex: "#b6885a" },
  { id: "color-navy", name: "Midnight", hex: "#1c2541" },
  { id: "color-rose", name: "Rose Dust", hex: "#c98a8a" },
];

const baseSizes = [
  { id: "size-xs", label: "XS", available: true },
  { id: "size-s", label: "S", available: true },
  { id: "size-m", label: "M", available: true },
  { id: "size-l", label: "L", available: true },
  { id: "size-xl", label: "XL", available: false },
];

const shoeSizes = [
  { id: "size-7", label: "US 7", available: true },
  { id: "size-8", label: "US 8", available: true },
  { id: "size-9", label: "US 9", available: true },
  { id: "size-10", label: "US 10", available: true },
  { id: "size-11", label: "US 11", available: false },
];

const oneSize = [{ id: "size-one", label: "One Size", available: true }];

function buildVariants(
  productId: string,
  colors: { id: string }[],
  sizes: { id: string; available: boolean }[],
  basePrice: number,
  baseCompare: number | undefined,
): Product["variants"] {
  const variants: Product["variants"] = [];
  colors.forEach((c, ci) => {
    sizes.forEach((s, si) => {
      variants.push({
        id: `${productId}-${c.id}-${s.id}`,
        sku: `${productId.toUpperCase()}-${ci}${si}`,
        colorId: c.id,
        sizeId: s.id,
        price: basePrice + (si - 1) * 3,
        comparePrice: baseCompare ? baseCompare + (si - 1) * 3 : undefined,
        stock: s.available ? Math.max(0, 18 - si * 3 - ci) : 0,
      });
    });
  });
  return variants;
}

export const PRODUCTS: Product[] = [
  {
    id: "p-001",
    slug: "milano-cashmere-coat",
    name: "Milano Cashmere Coat",
    brand: "Atelier Luxe",
    category: "women",
    subcategory: "outerwear",
    tags: ["coat", "winter", "premium", "cashmere"],
    description:
      "Tailored from a custom blend of Mongolian cashmere and merino wool, the Milano coat is built to drape beautifully across the shoulders and fall in a clean A-line silhouette. Finished with horn buttons and a satin lining.",
    shortDescription: "Single-breasted cashmere coat with a clean A-line silhouette.",
    price: 489,
    comparePrice: 620,
    currency: "USD",
    rating: 4.8,
    reviewCount: 142,
    stock: 42,
    images: [
      {
        id: "p-001-1",
        url: PRODUCT_IMAGES["p-001"][0],
        alt: "front",
      },
      {
        id: "p-001-2",
        url: PRODUCT_IMAGES["p-001"][1],
        alt: "detail",
      },
      {
        id: "p-001-3",
        url: PRODUCT_IMAGES["p-001"][2],
        alt: "lifestyle",
      },
    ],
    colors: [baseColors[0], baseColors[2], baseColors[4]],
    sizes: baseSizes,
    variants: buildVariants(
      "p-001",
      [baseColors[0], baseColors[2], baseColors[4]],
      baseSizes,
      489,
      620,
    ),
    features: [
      "70% cashmere / 30% merino wool blend",
      "Italian horn buttons",
      "Cupro satin lining",
      "Dry clean only",
    ],
    isFeatured: true,
    isOnSale: true,
    createdAt: "2025-11-01T10:00:00.000Z",
  },
  {
    id: "p-002",
    slug: "luca-leather-derby",
    name: "Luca Leather Derby",
    brand: "Atelier Luxe",
    category: "shoes",
    subcategory: "men-shoes",
    tags: ["shoes", "leather", "formal"],
    description:
      "A hand-finished derby in vegetable-tanned Italian calf leather. Goodyear welted construction ensures decades of wear, and the lightly tapered last keeps a contemporary silhouette.",
    shortDescription: "Goodyear welted derby in vegetable-tanned Italian leather.",
    price: 349,
    currency: "USD",
    rating: 4.7,
    reviewCount: 96,
    stock: 28,
    images: [
      {
        id: "p-002-1",
        url: PRODUCT_IMAGES["p-002"][0],
        alt: "pair",
      },
      {
        id: "p-002-2",
        url: PRODUCT_IMAGES["p-002"][1],
        alt: "side",
      },
      {
        id: "p-002-3",
        url: PRODUCT_IMAGES["p-002"][2],
        alt: "lifestyle",
      }
    ],
    colors: [baseColors[0], baseColors[4]],
    sizes: shoeSizes,
    variants: buildVariants(
      "p-002",
      [baseColors[0], baseColors[4]],
      shoeSizes,
      349,
      undefined,
    ),
    features: [
      "Vegetable-tanned Italian calf leather",
      "Goodyear welted construction",
      "Leather sole with rubber heel",
      "Comes with cotton dust bag",
    ],
    isFeatured: true,
    isNew: true,
    createdAt: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "p-003",
    slug: "kyoto-merino-sweater",
    name: "Kyoto Merino Sweater",
    brand: "Studio North",
    category: "men",
    subcategory: "knitwear",
    tags: ["sweater", "merino", "knit"],
    description:
      "Knit from extra-fine 19.5-micron merino wool, the Kyoto sweater balances structure and softness. A clean crewneck profile makes it equally at home with tailored trousers or denim.",
    shortDescription: "Extra-fine merino crewneck with a relaxed modern fit.",
    price: 169,
    comparePrice: 210,
    currency: "USD",
    rating: 4.6,
    reviewCount: 213,
    stock: 64,
    images: [
      {
        id: "p-003-1",
        url: PRODUCT_IMAGES["p-003"][0],
        alt: "model",
      },
      {
        id: "p-003-2",
        url: PRODUCT_IMAGES["p-003"][1],
        alt: "flat lay",
      },
      {
        id: "p-003-3",
        url: PRODUCT_IMAGES["p-003"][2],
        alt: "knit detail",
      }
    ],
    colors: [baseColors[1], baseColors[3], baseColors[5]],
    sizes: baseSizes,
    variants: buildVariants(
      "p-003",
      [baseColors[1], baseColors[3], baseColors[5]],
      baseSizes,
      169,
      210,
    ),
    features: [
      "19.5-micron Australian merino wool",
      "Fully fashioned shoulders",
      "Machine washable on wool cycle",
      "Designed in New York, knit in Portugal",
    ],
    isFeatured: true,
    isOnSale: true,
    createdAt: "2025-10-04T10:00:00.000Z",
  },
  {
    id: "p-004",
    slug: "soho-leather-tote",
    name: "Soho Leather Tote",
    brand: "Maison Field",
    category: "accessories",
    subcategory: "bags",
    tags: ["bag", "leather", "tote"],
    description:
      "A spacious unstructured tote in supple full-grain leather. Designed to soften beautifully with wear, finished with hand-stitched handles and a removable pouch.",
    shortDescription: "Unstructured full-grain leather tote with hand-stitched handles.",
    price: 289,
    currency: "USD",
    rating: 4.9,
    reviewCount: 318,
    stock: 51,
    images: [
      {
        id: "p-004-1",
        url: PRODUCT_IMAGES["p-004"][0],
        alt: "tote",
      },
      {
        id: "p-004-2",
        url: PRODUCT_IMAGES["p-004"][1],
        alt: "with model",
      },
      {
        id: "p-004-3",
        url: PRODUCT_IMAGES["p-004"][2],
        alt: "interior",
      }
    ],
    colors: [baseColors[0], baseColors[4], baseColors[2]],
    sizes: oneSize,
    variants: buildVariants(
      "p-004",
      [baseColors[0], baseColors[4], baseColors[2]],
      oneSize,
      289,
      undefined,
    ),
    features: [
      "Full-grain Italian leather",
      "Removable interior pouch",
      "Magnetic top closure",
      "Lifetime craftsmanship guarantee",
    ],
    isFeatured: true,
    isNew: true,
    createdAt: "2026-02-18T10:00:00.000Z",
  },
  {
    id: "p-005",
    slug: "harbor-linen-shirt",
    name: "Harbor Linen Shirt",
    brand: "Studio North",
    category: "men",
    subcategory: "shirts",
    tags: ["shirt", "linen", "summer"],
    description:
      "Garment-dyed European linen with a relaxed camp collar. Designed to wrinkle elegantly and breathe through the warmest afternoons.",
    shortDescription: "Garment-dyed European linen camp-collar shirt.",
    price: 129,
    currency: "USD",
    rating: 4.5,
    reviewCount: 78,
    stock: 92,
    images: [
      {
        id: "p-005-1",
        url: PRODUCT_IMAGES["p-005"][0],
        alt: "folded linen shirts",
      },
      {
        id: "p-005-2",
        url: PRODUCT_IMAGES["p-005"][1],
        alt: "linen shirt on model",
      },
      {
        id: "p-005-3",
        url: PRODUCT_IMAGES["p-005"][2],
        alt: "linen collar and button detail",
      }
    ],
    colors: [baseColors[1], baseColors[2], baseColors[3]],
    sizes: baseSizes,
    variants: buildVariants(
      "p-005",
      [baseColors[1], baseColors[2], baseColors[3]],
      baseSizes,
      129,
      undefined,
    ),
    features: [
      "100% European linen",
      "Garment dyed for a lived-in finish",
      "Mother-of-pearl buttons",
      "Machine washable",
    ],
    isNew: true,
    createdAt: "2026-03-02T10:00:00.000Z",
  },
  {
    id: "p-006",
    slug: "atlas-aviator-sunglasses",
    name: "Atlas Aviator Sunglasses",
    brand: "Maison Field",
    category: "accessories",
    subcategory: "eyewear",
    tags: ["sunglasses", "eyewear", "summer"],
    description:
      "A modernized aviator silhouette cut from premium Mazzucchelli acetate. Polarized CR-39 lenses cut glare without distorting color.",
    shortDescription: "Modernized aviator in Mazzucchelli acetate with polarized lenses.",
    price: 198,
    currency: "USD",
    rating: 4.7,
    reviewCount: 156,
    stock: 38,
    images: [
      {
        id: "p-006-1",
        url: PRODUCT_IMAGES["p-006"][0],
        alt: "aviator sunglasses front",
      },
      {
        id: "p-006-2",
        url: PRODUCT_IMAGES["p-006"][1],
        alt: "sunglasses frame angle",
      },
      {
        id: "p-006-3",
        url: PRODUCT_IMAGES["p-006"][2],
        alt: "sunglasses lifestyle",
      }
    ],
    colors: [baseColors[0], baseColors[4]],
    sizes: oneSize,
    variants: buildVariants(
      "p-006",
      [baseColors[0], baseColors[4]],
      oneSize,
      198,
      undefined,
    ),
    features: [
      "Mazzucchelli acetate frames",
      "Polarized CR-39 lenses",
      "Adjustable nose pads",
      "Comes with leather case",
    ],
    isFeatured: true,
    createdAt: "2025-09-18T10:00:00.000Z",
  },
  {
    id: "p-007",
    slug: "noir-silk-slip-dress",
    name: "Noir Silk Slip Dress",
    brand: "Atelier Luxe",
    category: "women",
    subcategory: "dresses",
    tags: ["dress", "silk", "evening"],
    description:
      "A bias-cut slip dress in 22-momme mulberry silk. French seams and adjustable straps make it effortless to dress up or down.",
    shortDescription: "Bias-cut 22-momme mulberry silk slip dress.",
    price: 259,
    comparePrice: 320,
    currency: "USD",
    rating: 4.8,
    reviewCount: 201,
    stock: 33,
    images: [
      {
        id: "p-007-1",
        url: PRODUCT_IMAGES["p-007"][0],
        alt: "on model",
      },
      {
        id: "p-007-2",
        url: PRODUCT_IMAGES["p-007"][1],
        alt: "movement",
      },
      {
        id: "p-007-3",
        url: PRODUCT_IMAGES["p-007"][2],
        alt: "fabric drape",
      }
    ],
    colors: [baseColors[0], baseColors[6]],
    sizes: baseSizes,
    variants: buildVariants(
      "p-007",
      [baseColors[0], baseColors[6]],
      baseSizes,
      259,
      320,
    ),
    features: [
      "22-momme mulberry silk",
      "French seams",
      "Adjustable straps",
      "Hand wash cold",
    ],
    isOnSale: true,
    isFeatured: true,
    createdAt: "2025-08-22T10:00:00.000Z",
  },
  {
    id: "p-008",
    slug: "verona-suede-loafer",
    name: "Verona Suede Loafer",
    brand: "Atelier Luxe",
    category: "shoes",
    subcategory: "women-shoes",
    tags: ["loafer", "suede", "shoes"],
    description:
      "A soft Italian suede loafer with a hand-stitched apron and signature gold horsebit. Engineered for all-day comfort with a cushioned leather footbed.",
    shortDescription: "Italian suede loafer with hand-stitched apron and gold hardware.",
    price: 299,
    currency: "USD",
    rating: 4.6,
    reviewCount: 88,
    stock: 24,
    images: [
      {
        id: "p-008-1",
        url: PRODUCT_IMAGES["p-008"][0],
        alt: "pair",
      },
      {
        id: "p-008-2",
        url: PRODUCT_IMAGES["p-008"][1],
        alt: "suede loafer angle",
      },
      {
        id: "p-008-3",
        url: PRODUCT_IMAGES["p-008"][2],
        alt: "suede texture",
      }
    ],
    colors: [baseColors[0], baseColors[4], baseColors[3]],
    sizes: shoeSizes,
    variants: buildVariants(
      "p-008",
      [baseColors[0], baseColors[4], baseColors[3]],
      shoeSizes,
      299,
      undefined,
    ),
    features: [
      "Italian water-resistant suede",
      "Cushioned leather footbed",
      "Signature gold horsebit",
      "Made in Italy",
    ],
    isFeatured: true,
    createdAt: "2025-12-10T10:00:00.000Z",
  },
  {
    id: "p-009",
    slug: "everyday-merino-tee",
    name: "Everyday Merino Tee",
    brand: "Studio North",
    category: "men",
    subcategory: "tees",
    tags: ["t-shirt", "merino", "basic"],
    description:
      "Soft-handed 17.5-micron merino tee with a clean crewneck. Naturally temperature regulating and odor resistant.",
    shortDescription: "Featherlight 17.5-micron merino t-shirt.",
    price: 79,
    currency: "USD",
    rating: 4.4,
    reviewCount: 412,
    stock: 180,
    images: [
      {
        id: "p-009-1",
        url: PRODUCT_IMAGES["p-009"][0],
        alt: "on model",
      },
      {
        id: "p-009-2",
        url: PRODUCT_IMAGES["p-009"][1],
        alt: "folded",
      },
      {
        id: "p-009-3",
        url: PRODUCT_IMAGES["p-009"][2],
        alt: "neckline",
      }
    ],
    colors: [baseColors[0], baseColors[1], baseColors[2], baseColors[5]],
    sizes: baseSizes,
    variants: buildVariants(
      "p-009",
      [baseColors[0], baseColors[1], baseColors[2], baseColors[5]],
      baseSizes,
      79,
      undefined,
    ),
    features: [
      "17.5-micron merino wool jersey",
      "Reinforced shoulder taping",
      "Odor resistant & temperature regulating",
      "Machine washable",
    ],
    createdAt: "2025-07-14T10:00:00.000Z",
  },
  {
    id: "p-010",
    slug: "kobe-ceramic-mug-set",
    name: "Kobe Ceramic Mug Set",
    brand: "Hearth Studio",
    category: "home",
    subcategory: "ceramics",
    tags: ["home", "ceramic", "kitchen"],
    description:
      "Set of four hand-thrown stoneware mugs with a reactive glaze that varies subtly from piece to piece. Dishwasher and microwave safe.",
    shortDescription: "Set of four hand-thrown stoneware mugs with reactive glaze.",
    price: 88,
    comparePrice: 110,
    currency: "USD",
    rating: 4.9,
    reviewCount: 67,
    stock: 41,
    images: [
      {
        id: "p-010-1",
        url: PRODUCT_IMAGES["p-010"][0],
        alt: "set",
      },
      {
        id: "p-010-2",
        url: PRODUCT_IMAGES["p-010"][1],
        alt: "table lifestyle",
      },
      {
        id: "p-010-3",
        url: PRODUCT_IMAGES["p-010"][2],
        alt: "ceramic glaze detail",
      }
    ],
    colors: [baseColors[1], baseColors[2]],
    sizes: oneSize,
    variants: buildVariants(
      "p-010",
      [baseColors[1], baseColors[2]],
      oneSize,
      88,
      110,
    ),
    features: [
      "Hand-thrown stoneware",
      "Reactive glaze finish",
      "Dishwasher & microwave safe",
      "Set of four 11oz mugs",
    ],
    isOnSale: true,
    createdAt: "2025-11-20T10:00:00.000Z",
  },
  {
    id: "p-011",
    slug: "selene-pearl-earrings",
    name: "Selene Pearl Earrings",
    brand: "Maison Field",
    category: "accessories",
    subcategory: "jewelry",
    tags: ["jewelry", "earrings", "pearl"],
    description:
      "Single freshwater pearls suspended from 14k gold-filled chains. A weightless, modern take on a classic.",
    shortDescription: "Freshwater pearls on 14k gold-filled chains.",
    price: 119,
    currency: "USD",
    rating: 4.8,
    reviewCount: 134,
    stock: 56,
    images: [
      {
        id: "p-011-1",
        url: PRODUCT_IMAGES["p-011"][0],
        alt: "pearl drop earrings pair",
      },
      {
        id: "p-011-2",
        url: PRODUCT_IMAGES["p-011"][1],
        alt: "pearl jewelry close-up",
      },
      {
        id: "p-011-3",
        url: PRODUCT_IMAGES["p-011"][2],
        alt: "earring luster detail",
      }
    ],
    colors: [baseColors[1]],
    sizes: oneSize,
    variants: buildVariants("p-011", [baseColors[1]], oneSize, 119, undefined),
    features: [
      "AAA-grade freshwater pearls",
      "14k gold-filled chains",
      "Hypoallergenic posts",
      "Hand-finished in California",
    ],
    isNew: true,
    createdAt: "2026-02-26T10:00:00.000Z",
  },
  {
    id: "p-012",
    slug: "ridgeline-down-parka",
    name: "Ridgeline Down Parka",
    brand: "Studio North",
    category: "men",
    subcategory: "outerwear",
    tags: ["parka", "down", "winter"],
    description:
      "An expedition-grade parka built around a responsibly sourced 800-fill goose down. Three-layer waterproof shell and fully sealed seams.",
    shortDescription: "Three-layer waterproof parka with 800-fill responsibly sourced down.",
    price: 549,
    comparePrice: 689,
    currency: "USD",
    rating: 4.7,
    reviewCount: 102,
    stock: 22,
    images: [
      {
        id: "p-012-1",
        url: PRODUCT_IMAGES["p-012"][0],
        alt: "hooded technical parka front",
      },
      {
        id: "p-012-2",
        url: PRODUCT_IMAGES["p-012"][1],
        alt: "waterproof shell and zipper detail",
      },
      {
        id: "p-012-3",
        url: PRODUCT_IMAGES["p-012"][2],
        alt: "parka in cold weather",
      }
    ],
    colors: [baseColors[0], baseColors[3], baseColors[5]],
    sizes: baseSizes,
    variants: buildVariants(
      "p-012",
      [baseColors[0], baseColors[3], baseColors[5]],
      baseSizes,
      549,
      689,
    ),
    features: [
      "800-fill responsibly sourced goose down",
      "Three-layer waterproof shell",
      "Fully sealed seams",
      "YKK Aquaguard zippers",
    ],
    isOnSale: true,
    isFeatured: true,
    createdAt: "2025-10-30T10:00:00.000Z",
  },
  {
    id: "p-013",
    slug: "capri-camp-collar-silk-shirt",
    name: "Capri Camp-Collar Silk Shirt",
    brand: "Studio North",
    category: "men",
    subcategory: "shirts",
    tags: ["shirt", "silk", "summer", "resort", "casual", "men"],
    description:
      "Crafted from a fluid mulberry silk and organic linen blend, the Capri shirt delivers breezy Mediterranean elegance. Cut with a relaxed camp collar, mother-of-pearl buttons, and French seams throughout.",
    shortDescription: "Camp-collar resort shirt in airy silk-linen weave with mother-of-pearl buttons.",
    price: 185,
    comparePrice: 220,
    currency: "USD",
    rating: 4.9,
    reviewCount: 64,
    stock: 28,
    images: [
      { id: "p-013-1", url: PRODUCT_IMAGES["p-013"][0], alt: "front view" },
      { id: "p-013-2", url: PRODUCT_IMAGES["p-013"][1], alt: "detail" },
      { id: "p-013-3", url: PRODUCT_IMAGES["p-013"][2], alt: "lifestyle" },
    ],
    colors: [baseColors[1], baseColors[2], baseColors[3]],
    sizes: baseSizes,
    variants: buildVariants(
      "p-013",
      [baseColors[1], baseColors[2], baseColors[3]],
      baseSizes,
      185,
      220,
    ),
    features: [
      "70% Mulberry silk, 30% organic linen",
      "Genuine Australian mother-of-pearl buttons",
      "Relaxed camp-collar styling",
      "Pre-washed for an effortless fluid drape",
    ],
    isNew: true,
    isFeatured: true,
    createdAt: "2025-11-01T10:00:00.000Z",
  },
  {
    id: "p-014",
    slug: "monaco-pleated-linen-trousers",
    name: "Monaco Pleated Linen Trousers",
    brand: "Studio North",
    category: "men",
    subcategory: "pants",
    tags: ["pants", "trousers", "linen", "summer", "tailored", "men"],
    description:
      "Woven in Northern Italy from heavyweight Belgian flax linen. Features double forward pleats, an extended tab waistband, and a relaxed straight taper that flatters any summer silhouette.",
    shortDescription: "Double-pleated Belgian flax linen trousers with extended tab waistband.",
    price: 215,
    comparePrice: 260,
    currency: "USD",
    rating: 4.8,
    reviewCount: 52,
    stock: 35,
    images: [
      { id: "p-014-1", url: PRODUCT_IMAGES["p-014"][0], alt: "front view" },
      { id: "p-014-2", url: PRODUCT_IMAGES["p-014"][1], alt: "fabric texture" },
      { id: "p-014-3", url: PRODUCT_IMAGES["p-014"][2], alt: "tailoring" },
    ],
    colors: [baseColors[2], baseColors[5], baseColors[0]],
    sizes: baseSizes,
    variants: buildVariants(
      "p-014",
      [baseColors[2], baseColors[5], baseColors[0]],
      baseSizes,
      215,
      260,
    ),
    features: [
      "100% Belgian flax linen",
      "Double forward pleats",
      "Adjustable side cinch tabs",
      "Horn button closures",
    ],
    isFeatured: true,
    createdAt: "2025-11-01T10:00:00.000Z",
  },
  {
    id: "p-015",
    slug: "sorrento-suede-penny-loafers",
    name: "Sorrento Suede Penny Loafers",
    brand: "Velluto",
    category: "shoes",
    subcategory: "loafers",
    tags: ["shoes", "loafers", "suede", "casual", "italian", "men"],
    description:
      "Bench-made in Tuscany using unlined Italian calf suede for exceptional slipper-like flexibility. Set on a Blake-stitched leather sole with inset rubber traction pods.",
    shortDescription: "Hand-stitched Tuscan calf suede penny loafers with flexible leather sole.",
    price: 295,
    comparePrice: 350,
    currency: "USD",
    rating: 4.9,
    reviewCount: 88,
    stock: 22,
    images: [
      { id: "p-015-1", url: PRODUCT_IMAGES["p-015"][0], alt: "profile" },
      { id: "p-015-2", url: PRODUCT_IMAGES["p-015"][1], alt: "leather detail" },
      { id: "p-015-3", url: PRODUCT_IMAGES["p-015"][2], alt: "sole craftsmanship" },
    ],
    colors: [baseColors[4], baseColors[0], baseColors[5]],
    sizes: shoeSizes,
    variants: buildVariants(
      "p-015",
      [baseColors[4], baseColors[0], baseColors[5]],
      shoeSizes,
      295,
      350,
    ),
    features: [
      "Water-repellent Tuscan calf suede",
      "Traditional Blake-stitched construction",
      "Memory foam cushioned leather footbed",
      "Hand-stitched moccasin apron",
    ],
    isNew: true,
    isFeatured: true,
    createdAt: "2025-11-01T10:00:00.000Z",
  },
  {
    id: "p-016",
    slug: "zurich-chronograph-watch",
    name: "Zurich Chronograph Watch",
    brand: "Koto Horology",
    category: "accessories",
    subcategory: "watches",
    tags: ["watch", "chronograph", "luxury", "accessories", "leather"],
    description:
      "Engineered with a high-precision meca-quartz movement within a 39mm 316L stainless steel case. Features double-domed sapphire crystal with anti-reflective coating and a vegetable-tanned Horween leather strap.",
    shortDescription: "39mm meca-quartz chronograph with anti-reflective sapphire crystal.",
    price: 420,
    comparePrice: 520,
    currency: "USD",
    rating: 4.9,
    reviewCount: 110,
    stock: 15,
    images: [
      { id: "p-016-1", url: PRODUCT_IMAGES["p-016"][0], alt: "watch face" },
      { id: "p-016-2", url: PRODUCT_IMAGES["p-016"][1], alt: "dial detail" },
      { id: "p-016-3", url: PRODUCT_IMAGES["p-016"][2], alt: "leather strap" },
    ],
    colors: [baseColors[0], baseColors[4]],
    sizes: oneSize,
    variants: buildVariants(
      "p-016",
      [baseColors[0], baseColors[4]],
      oneSize,
      420,
      520,
    ),
    features: [
      "Double-domed sapphire crystal",
      "316L surgical stainless steel casing",
      "50m water resistance (5 ATM)",
      "Quick-release vegetable-tanned Horween strap",
    ],
    isFeatured: true,
    createdAt: "2025-11-01T10:00:00.000Z",
  },
  {
    id: "p-017",
    slug: "bellagio-structured-blazer",
    name: "Bellagio Structured Blazer",
    brand: "Atelier Luxe",
    category: "women",
    subcategory: "outerwear",
    tags: ["blazer", "formal", "office", "wool", "tailored", "women"],
    description:
      "A commanding double-breasted silhouette tailored from high-twist virgin wool crepe. Defined peak lapels, structured roped shoulders, and tortoiseshell buttons create a timeless sartorial statement.",
    shortDescription: "Double-breasted virgin wool crepe blazer with peak lapels.",
    price: 380,
    comparePrice: 460,
    currency: "USD",
    rating: 4.7,
    reviewCount: 46,
    stock: 26,
    images: [
      { id: "p-017-1", url: PRODUCT_IMAGES["p-017"][0], alt: "front view" },
      { id: "p-017-2", url: PRODUCT_IMAGES["p-017"][1], alt: "lapel detail" },
      { id: "p-017-3", url: PRODUCT_IMAGES["p-017"][2], alt: "styling" },
    ],
    colors: [baseColors[0], baseColors[1], baseColors[5]],
    sizes: baseSizes,
    variants: buildVariants(
      "p-017",
      [baseColors[0], baseColors[1], baseColors[5]],
      baseSizes,
      380,
      460,
    ),
    features: [
      "100% Virgin wool crepe",
      "Cupro silk breathable lining",
      "Interior passport & card pockets",
      "Surgeon cuffs with functioning buttons",
    ],
    isNew: true,
    createdAt: "2025-11-01T10:00:00.000Z",
  },
  {
    id: "p-018",
    slug: "florence-mulberry-silk-scarf",
    name: "Florence Mulberry Silk Scarf",
    brand: "Atelier Luxe",
    category: "accessories",
    subcategory: "scarves",
    tags: ["scarf", "silk", "accessories", "gift", "luxury", "women"],
    description:
      "Screen-printed on 18-momme mulberry silk twill with artisan hand-rolled edges. Features an abstract geometric motif inspired by Italian Renaissance architecture.",
    shortDescription: "Hand-rolled 18-momme mulberry silk twill architectural square scarf.",
    price: 110,
    comparePrice: 140,
    currency: "USD",
    rating: 4.8,
    reviewCount: 39,
    stock: 30,
    images: [
      { id: "p-018-1", url: PRODUCT_IMAGES["p-018"][0], alt: "flatlay" },
      { id: "p-018-2", url: PRODUCT_IMAGES["p-018"][1], alt: "silk twill detail" },
    ],
    colors: [baseColors[5], baseColors[6], baseColors[4]],
    sizes: oneSize,
    variants: buildVariants(
      "p-018",
      [baseColors[5], baseColors[6], baseColors[4]],
      oneSize,
      110,
      140,
    ),
    features: [
      "100% Grade 6A mulberry silk twill",
      "Hand-rolled and stitched hems",
      "90cm x 90cm square silhouette",
      "Complimentary gift packaging",
    ],
    createdAt: "2025-11-01T10:00:00.000Z",
  },
  {
    id: "p-019",
    slug: "portofino-cashmere-cardigan",
    name: "Portofino Cashmere Cardigan",
    brand: "Atelier Luxe",
    category: "women",
    subcategory: "knitwear",
    tags: ["cardigan", "cashmere", "winter", "knitwear", "warm", "women"],
    description:
      "Knitted from plush 4-ply Mongolian cashmere with a clean ribbed texture. Cut with dropped shoulders, deep patch pockets, and genuine horn buttons for effortless layering.",
    shortDescription: "Plush 4-ply ribbed Mongolian cashmere cardigan with horn buttons.",
    price: 360,
    comparePrice: 440,
    currency: "USD",
    rating: 4.9,
    reviewCount: 78,
    stock: 19,
    images: [
      { id: "p-019-1", url: PRODUCT_IMAGES["p-019"][0], alt: "front" },
      { id: "p-019-2", url: PRODUCT_IMAGES["p-019"][1], alt: "ribbed knit texture" },
    ],
    colors: [baseColors[1], baseColors[2], baseColors[4]],
    sizes: baseSizes,
    variants: buildVariants(
      "p-019",
      [baseColors[1], baseColors[2], baseColors[4]],
      baseSizes,
      360,
      440,
    ),
    features: [
      "100% Grade A Mongolian cashmere",
      "Chunky 4-ply knit warmth",
      "Dropped shoulder silhouette",
      "Natural horn button fastening",
    ],
    isOnSale: true,
    createdAt: "2025-11-01T10:00:00.000Z",
  },
  {
    id: "p-020",
    slug: "st-moritz-quilted-down-gilet",
    name: "St. Moritz Quilted Down Gilet",
    brand: "Studio North",
    category: "men",
    subcategory: "outerwear",
    tags: ["gilet", "vest", "down", "winter", "waterproof", "men"],
    description:
      "Insulated with ultra-lofty 850-fill power European goose down inside a matte micro-ripstop Japanese shell. Designed for modular warmth across transitional seasons.",
    shortDescription: "850-fill European goose down vest in Japanese micro-ripstop.",
    price: 240,
    comparePrice: 290,
    currency: "USD",
    rating: 4.8,
    reviewCount: 56,
    stock: 24,
    images: [
      { id: "p-019-1", url: PRODUCT_IMAGES["p-020"][0], alt: "profile" },
      { id: "p-019-2", url: PRODUCT_IMAGES["p-020"][1], alt: "quilted detail" },
    ],
    colors: [baseColors[0], baseColors[3], baseColors[5]],
    sizes: baseSizes,
    variants: buildVariants(
      "p-020",
      [baseColors[0], baseColors[3], baseColors[5]],
      baseSizes,
      240,
      290,
    ),
    features: [
      "850-fill European goose down",
      "Japanese DWR micro-ripstop shell",
      "Fleece-lined handwarmer pockets",
      "Internal windproof storm flap",
    ],
    isNew: true,
    isFeatured: true,
    createdAt: "2025-11-01T10:00:00.000Z",
  },
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.isFeatured);
export const NEW_PRODUCTS = PRODUCTS.filter((p) => p.isNew);
export const SALE_PRODUCTS = PRODUCTS.filter((p) => p.isOnSale);

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string, limit = 8): Product[] {
  const product = getProductBySlug(slug);
  if (!product) return [];

  // 1. Same category first
  const sameCategory = PRODUCTS.filter((p) => p.slug !== slug && p.category === product.category);

  // 2. Complementary categories (accessories, shoes, or same brand)
  const complementary = PRODUCTS.filter(
    (p) =>
      p.slug !== slug &&
      p.category !== product.category &&
      (p.category === "accessories" || p.category === "shoes" || p.brand === product.brand),
  );

  // 3. Other products as fallback
  const others = PRODUCTS.filter(
    (p) => p.slug !== slug && !sameCategory.includes(p) && !complementary.includes(p),
  );

  const combined = [...sameCategory, ...complementary, ...others];
  return combined.slice(0, limit);
}
