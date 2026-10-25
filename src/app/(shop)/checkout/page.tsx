import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import CheckoutPage from "@/features/checkout/components/checkout-flow";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="container-wide grid gap-8 py-16 lg:grid-cols-[1fr_400px]">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      }
    >
      <CheckoutPage />
    </Suspense>
  );
}
