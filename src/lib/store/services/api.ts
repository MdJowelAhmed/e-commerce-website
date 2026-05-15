import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  Category,
  Customer,
  Order,
  Paginated,
  Product,
  Review,
  Testimonial,
} from "@/types";

export type ProductsQuery = {
  category?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "popular";
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  brands?: string[];
  sale?: boolean;
  featured?: boolean;
  page?: number;
  perPage?: number;
};

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

/**
 * RTK Query API definition. All product, order, customer and analytics
 * endpoints go through this single api slice for consistent caching,
 * invalidation and request deduplication.
 */
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Products", "Product", "Categories", "Reviews", "Orders", "Customers", "Testimonials"],
  endpoints: (builder) => ({
    listProducts: builder.query<Paginated<Product>, ProductsQuery | void>({
      query: (params) => ({
        url: "/products",
        params: params ? serializeParams(params) : undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({ type: "Product" as const, id: p.id })),
              { type: "Products" as const, id: "LIST" },
            ]
          : [{ type: "Products" as const, id: "LIST" }],
    }),

    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Product", id: slug }],
    }),

    getRelatedProducts: builder.query<Product[], string>({
      query: (slug) => `/products/${slug}/related`,
    }),

    listCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),

    getReviews: builder.query<Review[], string>({
      query: (productId) => `/reviews/${productId}`,
      providesTags: (_result, _error, productId) => [{ type: "Reviews", id: productId }],
    }),

    listTestimonials: builder.query<Testimonial[], void>({
      query: () => "/testimonials",
      providesTags: [{ type: "Testimonials", id: "LIST" }],
    }),

    listOrders: builder.query<Order[], void>({
      query: () => "/orders",
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),

    listCustomers: builder.query<Customer[], void>({
      query: () => "/customers",
      providesTags: [{ type: "Customers", id: "LIST" }],
    }),

    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),

    subscribeNewsletter: builder.mutation<{ ok: true }, { email: string }>({
      query: (body) => ({ url: "/newsletter", method: "POST", body }),
    }),
  }),
});

function serializeParams(params: ProductsQuery): Record<string, string> {
  const out: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      if (value.length === 0) return;
      out[key] = value.join(",");
    } else {
      out[key] = String(value);
    }
  });
  return out;
}

export const {
  useListProductsQuery,
  useGetProductBySlugQuery,
  useGetRelatedProductsQuery,
  useListCategoriesQuery,
  useGetReviewsQuery,
  useListTestimonialsQuery,
  useListOrdersQuery,
  useListCustomersQuery,
  useCreateOrderMutation,
  useSubscribeNewsletterMutation,
} = api;
