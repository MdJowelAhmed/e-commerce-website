import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FeaturedProductsSection } from "@/features/home/components/featured-products-section";
import { ProductDetails } from "@/features/products/components/product-details";
import { ProductReviews } from "@/features/products/components/product-reviews";
import {
  PRODUCTS,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/mock-data/products";
import { getReviewsForProduct } from "@/lib/mock-data/reviews";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.images[0]?.url }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const reviews = getReviewsForProduct(product.id);
  const related = getRelatedProducts(product.slug, 4);

  return (
    <>
      <ProductDetails product={product} />
      <ProductReviews
        reviews={reviews}
        rating={product.rating}
        reviewCount={product.reviewCount}
      />
      {related.length > 0 && (
        <FeaturedProductsSection
          products={related}
          eyebrow="You may also like"
          title="More to consider."
          description="Pieces that pair beautifully with what you're viewing."
          ctaLabel="Browse more"
          ctaHref="/products"
        />
      )}
    </>
  );
}
