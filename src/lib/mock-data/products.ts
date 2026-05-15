import type { Product } from "@/types";

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
        url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
        alt: "Milano cashmere coat front",
      },
      {
        id: "p-001-2",
        url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=80",
        alt: "Milano cashmere coat detail",
      },
      {
        id: "p-001-3",
        url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80",
        alt: "Milano cashmere coat lifestyle",
      },
      {
        id: "p-001-4",
        url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1200&q=80",
        alt: "Milano cashmere coat back",
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
        url: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80",
        alt: "Leather derby shoes",
      },
      {
        id: "p-002-2",
        url: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=1200&q=80",
        alt: "Leather derby shoes side",
      },
      {
        id: "p-002-3",
        url: "https://images.unsplash.com/photo-1582897085656-c636d006a246?auto=format&fit=crop&w=1200&q=80",
        alt: "Leather derby shoes lifestyle",
      },
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
        url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80",
        alt: "Merino sweater on model",
      },
      {
        id: "p-003-2",
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80",
        alt: "Merino sweater flat lay",
      },
      {
        id: "p-003-3",
        url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80",
        alt: "Merino sweater detail",
      },
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
        url: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80",
        alt: "Soho leather tote",
      },
      {
        id: "p-004-2",
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
        alt: "Leather tote with model",
      },
      {
        id: "p-004-3",
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
        alt: "Leather tote interior",
      },
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
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
        alt: "Linen shirt on model",
      },
      {
        id: "p-005-2",
        url: "https://images.unsplash.com/photo-1593030103066-0093718efeb9?auto=format&fit=crop&w=1200&q=80",
        alt: "Linen shirt flat",
      },
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
        url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80",
        alt: "Aviator sunglasses",
      },
      {
        id: "p-006-2",
        url: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80",
        alt: "Aviator sunglasses on model",
      },
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
        url: "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1200&q=80",
        alt: "Silk slip dress on model",
      },
      {
        id: "p-007-2",
        url: "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&w=1200&q=80",
        alt: "Silk slip dress detail",
      },
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
        url: "https://images.unsplash.com/photo-1581101767113-1677fc2bf2e6?auto=format&fit=crop&w=1200&q=80",
        alt: "Suede loafer",
      },
      {
        id: "p-008-2",
        url: "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&w=1200&q=80",
        alt: "Suede loafer on foot",
      },
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
        url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=1200&q=80",
        alt: "Merino tee on model",
      },
      {
        id: "p-009-2",
        url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80",
        alt: "Merino tee flat lay",
      },
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
        url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80",
        alt: "Ceramic mug set",
      },
      {
        id: "p-010-2",
        url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80",
        alt: "Mug lifestyle shot",
      },
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
        url: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&q=80",
        alt: "Pearl earrings",
      },
      {
        id: "p-011-2",
        url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80",
        alt: "Pearl earrings on model",
      },
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
        url: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1200&q=80",
        alt: "Down parka on model",
      },
      {
        id: "p-012-2",
        url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80",
        alt: "Down parka detail",
      },
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
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.isFeatured);
export const NEW_PRODUCTS = PRODUCTS.filter((p) => p.isNew);
export const SALE_PRODUCTS = PRODUCTS.filter((p) => p.isOnSale);

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string, limit = 4): Product[] {
  const product = getProductBySlug(slug);
  if (!product) return [];
  return PRODUCTS.filter(
    (p) => p.slug !== slug && (p.category === product.category || p.brand === product.brand),
  ).slice(0, limit);
}
