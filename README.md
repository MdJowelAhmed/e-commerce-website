# Luxe — Premium eCommerce Template

A production-ready, scalable, full-featured eCommerce template built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Redux Toolkit, and RTK Query.

The template ships with a polished storefront, multi-step checkout, an animated cart drawer, search, wishlist, a fully wired Redux store, mock API routes, and an admin dashboard for products, orders, customers, and analytics.

## Highlights

- **Modern stack** — Next.js 15 App Router, React 19, TypeScript strict mode, Tailwind CSS, shadcn/ui, Framer Motion, Redux Toolkit, RTK Query
- **Premium UI/UX** — Magazine-style hero, parallax, glassmorphism accents, micro-interactions, stagger reveals, hover effects, marquee, animated cart drawer
- **Scalable architecture** — Feature-based folder structure (`features/products`, `features/cart`, `features/admin`, etc.), clear separation between Server and Client Components
- **Type safety** — End-to-end typed Redux store, RTK Query, route params, props
- **Performance** — Static prerendering for product pages, optimized images, code splitting, font subsetting, lazy data fetching, RTK Query caching, suspense boundaries
- **Security** — Strict Content-Security headers, secret-safe env handling, Zod validation on every API route, input sanitization utilities, XSS-safe rendering, HttpOnly cookie-ready auth
- **A11y** — Focus rings, semantic HTML, `aria-label`s, keyboard navigation, prefers-reduced-motion friendly animations

## Tech Stack

| Concern             | Choice                                    |
| ------------------- | ----------------------------------------- |
| Framework           | Next.js 15 (App Router) + React 19        |
| Language            | TypeScript (strict)                       |
| Styling             | Tailwind CSS + CSS variables              |
| Components          | shadcn/ui + Radix Primitives              |
| Icons               | lucide-react                              |
| Animation           | Framer Motion                             |
| State (UI/Domain)   | Redux Toolkit                             |
| Server state / API  | RTK Query                                 |
| Forms               | react-hook-form + Zod                     |
| Toasts              | Sonner                                    |
| Theming             | next-themes (light/dark ready)            |
| Lint & format       | ESLint + Prettier + prettier-plugin-tailwindcss |

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment template (optional, the app runs without it)
cp .env.example .env.local

# Run the development server
npm run dev

# Build for production
npm run build

# Start the production server
npm start

# Lint / format / type-check
npm run lint
npm run format
npm run type-check
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront. The admin dashboard is at [http://localhost:3000/admin](http://localhost:3000/admin).

## Project Structure

```text
src/
├─ app/                          # Next.js App Router
│  ├─ (auth)/                    # Auth route group (login, register)
│  ├─ (shop)/                    # Shop route group (storefront pages)
│  │  ├─ page.tsx                # Homepage
│  │  ├─ products/               # Listing page (filters, sort, search, pagination)
│  │  ├─ product/[slug]/         # Product details (variants, gallery, zoom, reviews)
│  │  ├─ cart/                   # Bag page
│  │  ├─ checkout/               # Multi-step checkout
│  │  ├─ wishlist/               # Wishlist
│  │  ├─ orders/                 # Order tracking
│  │  └─ order/success/          # Order confirmation
│  ├─ admin/                     # Admin dashboard (sidebar layout)
│  ├─ api/                       # Mock REST API routes
│  ├─ layout.tsx                 # Root layout (providers, fonts, metadata)
│  ├─ loading.tsx                # Global loading UI
│  └─ not-found.tsx              # 404 page
│
├─ components/
│  ├─ ui/                        # shadcn/ui primitives (button, dialog, sheet, …)
│  ├─ layout/                    # Navbar, footer, cart drawer, mobile menu, search
│  └─ shared/                    # Cross-cutting bits (star rating, etc.)
│
├─ features/                     # Feature-based modules
│  ├─ products/                  # Product card, filters, gallery, details, reviews
│  ├─ cart/                      # Cart summary, coupon logic
│  ├─ checkout/                  # Stepper, schemas, multi-step form
│  ├─ home/                      # Homepage sections (hero, categories, testimonials)
│  ├─ auth/                      # Auth Zod schemas
│  └─ admin/                     # Admin sidebar, topbar, stat card, chart
│
├─ lib/
│  ├─ store/                     # Redux store, slices, selectors, RTK Query API
│  ├─ mock-data/                 # Static mock data: products, categories, orders, …
│  ├─ constants.ts               # Site config, nav links, currency, thresholds
│  └─ utils.ts                   # cn(), formatCurrency, sanitize, debounce, …
│
├─ hooks/                        # Reusable hooks (useMounted, useMediaQuery)
└─ types/                        # Shared TypeScript types
```

## Architecture & Patterns

### Server vs. Client Components

- All marketing/static surfaces (homepage sections, layout chrome, product pages metadata, mock API routes) are **Server Components** by default for fastest TTFB and lightest JS payloads.
- Interactive surfaces (cart drawer, product details with variants, filters, admin tables, charts, forms) are explicitly **Client Components** (`"use client"`).
- The Redux Provider is mounted in `src/lib/store/provider.tsx` and wrapped around the entire app inside `src/components/providers.tsx` — there is one store per request which is then hydrated client-side.

### State Management

- **`cartSlice`** — Items, coupon code, coupon discount. Persists to `localStorage` for resilience across reloads.
- **`wishlistSlice`** — Wishlist items. Persists to `localStorage`.
- **`uiSlice`** — Ephemeral UI state: cart drawer open, mobile menu open, search open, filters open.
- **Selectors** — `selectCartCount`, `selectCartSubtotal`, `selectCartTotals` use `createSelector` for memoized derived state.

### Server State / API

All server data flows through a single **RTK Query** `api` slice (`src/lib/store/services/api.ts`) with cache tags for granular invalidation:

- `useListProductsQuery`, `useGetProductBySlugQuery`, `useGetRelatedProductsQuery`
- `useListCategoriesQuery`, `useGetReviewsQuery`, `useListTestimonialsQuery`
- `useListOrdersQuery`, `useListCustomersQuery`
- `useCreateOrderMutation`, `useSubscribeNewsletterMutation`

These hit the mock API routes under `/api/*` — swap the `baseUrl` (or set `NEXT_PUBLIC_API_BASE_URL`) to point at your real backend without touching component code.

### Performance Strategy

- `generateStaticParams()` builds static HTML for every product slug at build time.
- `experimental.optimizePackageImports` for `lucide-react` and `framer-motion`.
- `next/image` everywhere, with AVIF/WebP preferred and explicit `sizes`.
- `next/font` for `Inter` (UI) and `Playfair Display` (display) — self-hosted, no network round-trips.
- Skeleton loaders for product grids and orders.
- Code is split per route automatically; heavy interactive sections (`ProductGallery`, charts, drawers) only ship on the routes that need them.
- `revalidate = 3600` is set on the categories and testimonials endpoints, demonstrating ISR-friendly patterns.
- `useScroll` / `useTransform` from Framer Motion drive hero parallax in a GPU-friendly way.

### Security Best Practices

- `next.config.ts` sets a defense-in-depth header policy: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- `poweredByHeader: false` removes the `X-Powered-By` fingerprint.
- Every public API route validates payloads with **Zod** before doing anything else.
- Secrets are kept in server-only env vars; `NEXT_PUBLIC_*` is reserved for non-sensitive config.
- A `sanitizeString` helper is provided for any user-generated content that ends up rendered as HTML.
- `next-themes` runs with `suppressHydrationWarning` only on `<html>` to avoid leaking attributes.

### Animation System

Framer Motion drives every interaction in a consistent, performant way:

- **Page-level reveals** — `whileInView` + `viewport={{ once: true }}` for one-shot section reveals.
- **Stagger** — `staggerChildren` for product grids, navbar items, testimonials.
- **Layout animations** — `layoutId` for the nav underline indicator and the admin sidebar pill.
- **Drawers** — Radix `Dialog`/`Sheet` primitives + Framer Motion for cart drawer items.
- **Microinteractions** — `whileTap`, `whileHover`, spring physics on cards, buttons and icons.
- **Scroll-driven** — `useScroll` + `useTransform` for hero parallax.
- **Marquees** — Infinite-loop announcement bar and brand strip.
- **Reduced motion** — Animations rely on transforms/opacity and short durations; can be guarded with `useReducedMotion` if needed.

### Forms & Validation

- `react-hook-form` with `zodResolver` powers every form (auth, checkout address, payment).
- Validation schemas live in `features/*/schemas.ts` so they can be shared between client and server (the order API route reuses Zod).
- Password strength meter and password visibility toggle on `/register`.
- Card form supports `cardName`, `cardNumber`, expiry `MM/YY`, and CVC with conditional validation depending on the selected payment method.

## Feature Coverage

### Storefront
- Modern homepage: parallax hero, trust bar, category cards, featured/new/sale product carousels, promo blocks, testimonials, brand marquee, newsletter
- Animated navbar with active route indicator, cart count, wishlist count
- Mobile menu, search dialog with type-ahead, cart drawer with free-shipping progress
- Product listing with category, price, color, size, brand, sale and featured filters; debounced search; multi-key sort; pagination
- Product details with image gallery + cursor-zoom, color & size variant selection that updates price/stock/image, quantity stepper, add-to-cart, wishlist, reviews, related products
- Wishlist page with quick "move to bag" action
- Multi-step animated checkout: address → shipping method → payment → review
- Order success page with celebratory animation
- Orders page with shipment tracking timeline

### Admin
- Dashboard with KPIs, animated SVG sales chart, top products, recent orders, activity feed
- Products table with search, category filter, sort, status badges, row actions
- Orders table with status filter
- Customers grid with avatars and lifetime value
- Analytics page with traffic chart and channel breakdown

### Auth
- Login & register with email/password, password strength meter, T&C checkbox

## Available NPM Scripts

| Script              | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload                        |
| `npm run build`     | Production build with SSG/ISR                               |
| `npm start`         | Start the production server                                 |
| `npm run lint`      | Lint with ESLint                                            |
| `npm run type-check`| Strict TypeScript validation                                |
| `npm run format`    | Format the codebase with Prettier + tailwind class sorting  |

## Replacing the Mock Backend

The template ships with API routes under `src/app/api/*` that read from `src/lib/mock-data/*`. To connect to a real backend:

1. Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to point at your service.
2. Either delete `src/app/api/*` or keep them as a BFF that proxies your backend.
3. The RTK Query endpoints in `src/lib/store/services/api.ts` will continue to work without changes thanks to the shared types in `src/types/`.

## Promo / Coupon Codes (Demo)

| Code        | Discount |
| ----------- | -------- |
| `LUXE10`    | 10% off  |
| `WELCOME15` | 15% off  |
| `VIP25`     | 25% off  |

## License

MIT. Use this as a starting point for your own production eCommerce build.
