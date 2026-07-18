export interface Money {
  amount: number;
  currency: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductColorOption {
  id: string;
  name: string;
  hex: string;
  imageUrl?: string;
}

export interface ProductSizeOption {
  id: string;
  label: string;
  available: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  colorId: string;
  sizeId: string;
  price: number;
  comparePrice?: number;
  stock: number;
  imageId?: string;
}

export interface Review {
  id: string;
  author: string;
  avatarUrl?: string;
  imageUrls?: string[];
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  brand: string;
  category: string;
  subcategory?: string;
  tags: string[];
  price: number;
  comparePrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: ProductImage[];
  colors: ProductColorOption[];
  sizes: ProductSizeOption[];
  variants: ProductVariant[];
  features: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  productCount: number;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  name: string;
  imageUrl: string;
  price: number;
  comparePrice?: number;
  quantity: number;
  variantId: string;
  colorId: string;
  colorName: string;
  sizeId: string;
  sizeLabel: string;
  stock: number;
}

export interface WishlistItem {
  productId: string;
  productSlug: string;
  name: string;
  imageUrl: string;
  price: number;
  comparePrice?: number;
  addedAt: string;
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type ShippingMethod = "standard" | "express";
export type PaymentMethod = "card" | "paypal" | "cod";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  id: string;
  number: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  shippingAddress: Address;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
  joinedAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  avatarUrl: string;
  quote: string;
  rating: number;
}

export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, string[]>;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface StockAlert {
  productId: string;
  variantId: string;
  email: string;
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  reason: string;
  details?: string;
  status: "submitted" | "approved" | "received" | "refunded";
  createdAt: string;
}
