import { BrandMarquee } from "@/features/home/components/brand-marquee";
import { CategoriesSection } from "@/features/home/components/categories-section";
import { FeaturedProductsSection } from "@/features/home/components/featured-products-section";
import { FlashSaleCountdown } from "@/features/home/components/flash-sale-countdown";
import { HeroSection } from "@/features/home/components/hero-section";
import { PromoSection } from "@/features/home/components/promo-section";
import { TestimonialsSection } from "@/features/home/components/testimonials-section";
import { TrustBar } from "@/features/home/components/trust-bar";
import { CATEGORIES } from "@/lib/mock-data/categories";
import {
  FEATURED_PRODUCTS,
  NEW_PRODUCTS,
  PRODUCTS,
  SALE_PRODUCTS,
} from "@/lib/mock-data/products";
import { TESTIMONIALS } from "@/lib/mock-data/testimonials";

export default function HomePage() {
  const newArrivals = NEW_PRODUCTS.length
    ? NEW_PRODUCTS
    : PRODUCTS.slice(0, 4);

  return (
    <>
      <HeroSection />
      <TrustBar />
      <FlashSaleCountdown />
      <CategoriesSection categories={CATEGORIES} />
      <FeaturedProductsSection
        products={FEATURED_PRODUCTS.slice(0, 8)}
        eyebrow="Best sellers"
        title="The pieces everyone is talking about."
        description="Loved by 12,000+ customers. Free shipping & easy returns."
      />
      <PromoSection />
      <FeaturedProductsSection
        products={newArrivals.slice(0, 4)}
        eyebrow="Just landed"
        title="New arrivals."
        description="Limited-run pieces, refreshed weekly."
        ctaLabel="See all new arrivals"
        ctaHref="/products?sort=newest"
      />
      <TestimonialsSection testimonials={TESTIMONIALS} />
      {SALE_PRODUCTS.length > 0 && (
        <FeaturedProductsSection
          products={SALE_PRODUCTS.slice(0, 4)}
          eyebrow="On sale"
          title="A moment to indulge."
          description="A limited selection, marked down."
          ctaLabel="Shop the sale"
          ctaHref="/products?sale=true"
        />
      )}
      <BrandMarquee />
    </>
  );
}
