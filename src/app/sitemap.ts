import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/lib/constants";
import { PRODUCTS } from "@/lib/mock-data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/products",
    "/about",
    "/wishlist",
    "/compare",
    "/rewards",
    "/orders",
    "/returns",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_CONFIG.url}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...PRODUCTS.map((product) => ({
      url: `${SITE_CONFIG.url}/product/${product.slug}`,
      lastModified: new Date(product.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
