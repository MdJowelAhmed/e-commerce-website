"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare } from "lucide-react";

import { StarRating } from "@/components/shared/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

interface ProductReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function ProductReviews({ reviews, rating, reviewCount }: ProductReviewsProps) {
  const [expanded, setExpanded] = useState(false);

  const distribution = useMemo(() => {
    const buckets: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      const key = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
      buckets[key] = (buckets[key] ?? 0) + 1;
    });
    const total = reviews.length || 1;
    return ([5, 4, 3, 2, 1] as const).map((star) => ({
      star,
      count: buckets[star] ?? 0,
      percent: ((buckets[star] ?? 0) / total) * 100,
    }));
  }, [reviews]);

  const visible = expanded ? reviews : reviews.slice(0, 3);

  return (
    <section className="container-wide border-t py-12 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Customer reviews
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight">
            {rating.toFixed(1)} out of 5
          </h2>
          <div className="mt-3 flex items-center gap-2">
            <StarRating value={rating} size="md" />
            <span className="text-xs text-muted-foreground">{reviewCount} reviews</span>
          </div>
          <div className="mt-6 space-y-2">
            {distribution.map(({ star, count, percent }) => (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-3 font-medium">{star}</span>
                <Progress value={percent} className="h-1.5 flex-1" />
                <span className="w-8 text-right text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-secondary/40 py-16 text-center"
            >
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
              <h3 className="font-medium">Be the first to leave a review</h3>
              <p className="text-sm text-muted-foreground">
                Share your thoughts with other shoppers.
              </p>
              <Button variant="outline" className="mt-2">
                Write a review
              </Button>
            </motion.div>
          ) : (
            <>
              {visible.map((review, i) => (
                <motion.article
                  key={review.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border bg-background p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {review.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{review.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[10px] font-medium text-success">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <StarRating value={review.rating} />
                    <h3 className="mt-2 text-base font-semibold">{review.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {review.body}
                    </p>
                  </div>
                </motion.article>
              ))}
              {reviews.length > 3 && (
                <div className="text-center">
                  <Button variant="outline" onClick={() => setExpanded((v) => !v)}>
                    {expanded ? "Show less" : `Show ${reviews.length - 3} more reviews`}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
