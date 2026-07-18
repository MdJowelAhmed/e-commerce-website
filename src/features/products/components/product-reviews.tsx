"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CheckCircle2, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";

import { StarRating } from "@/components/shared/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function ProductReviews({ productId, reviews, rating, reviewCount }: ProductReviewsProps) {
  const [expanded, setExpanded] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);
  const [form, setForm] = useState({ author: "", title: "", body: "", rating: 5 });
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        window.localStorage.getItem(`luxe.reviews.${productId}`) ?? "[]",
      ) as Review[];
      if (Array.isArray(saved) && saved.length > 0) setLocalReviews([...saved, ...reviews]);
    } catch {
      // Keep server reviews when local demo data is unavailable.
    }
  }, [productId, reviews]);

  const distribution = useMemo(() => {
    const buckets: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    localReviews.forEach((r) => {
      const key = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
      buckets[key] = (buckets[key] ?? 0) + 1;
    });
    const total = localReviews.length || 1;
    return ([5, 4, 3, 2, 1] as const).map((star) => ({
      star,
      count: buckets[star] ?? 0,
      percent: ((buckets[star] ?? 0) / total) * 100,
    }));
  }, [localReviews]);

  const visible = expanded ? localReviews : localReviews.slice(0, 3);

  const submitReview = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.author.trim() || !form.title.trim() || form.body.trim().length < 10) {
      toast.error("Please complete the review form");
      return;
    }
    const review: Review = {
        id: `local-${Date.now()}`,
        author: form.author.trim(),
        title: form.title.trim(),
        body: form.body.trim(),
        rating: form.rating,
        imageUrls: photos,
        createdAt: new Date().toISOString(),
      };
    setLocalReviews((current) => [review, ...current]);
    try {
      const key = `luxe.reviews.${productId}`;
      const saved = JSON.parse(window.localStorage.getItem(key) ?? "[]") as Review[];
      window.localStorage.setItem(key, JSON.stringify([review, ...saved].slice(0, 10)));
    } catch {
      toast.info("Review added for this session; photos were too large to persist");
    }
    setWriteOpen(false);
    setForm({ author: "", title: "", body: "", rating: 5 });
    setPhotos([]);
    toast.success("Review submitted for moderation");
  };

  const loadPhotos = (files: FileList | null) => {
    if (!files) return;
    Array.from(files)
      .slice(0, 3)
      .forEach((file) => {
        if (!file.type.startsWith("image/") || file.size > 2_000_000) return;
        const reader = new FileReader();
        reader.onload = () =>
          setPhotos((current) => [...current, String(reader.result)].slice(0, 3));
        reader.readAsDataURL(file);
      });
  };

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
          <Button variant="outline" className="mt-5" onClick={() => setWriteOpen(true)}>
            Write a review
          </Button>
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
          {localReviews.length === 0 ? (
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
              <Button variant="outline" className="mt-2" onClick={() => setWriteOpen(true)}>
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
                    {review.imageUrls && review.imageUrls.length > 0 && (
                      <div className="mt-4 flex gap-2">
                        {review.imageUrls.map((url, index) => (
                          <div key={`${review.id}-${index}`} className="relative h-20 w-20 overflow-hidden rounded-lg bg-secondary">
                            <Image src={url} alt={`Review photo ${index + 1}`} fill unoptimized className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
              {localReviews.length > 3 && (
                <div className="text-center">
                  <Button variant="outline" onClick={() => setExpanded((v) => !v)}>
                    {expanded ? "Show less" : `Show ${localReviews.length - 3} more reviews`}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Dialog open={writeOpen} onOpenChange={setWriteOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle className="font-display text-2xl">Write a review</DialogTitle>
          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Your rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, rating: value }))}
                    aria-label={`${value} stars`}
                  >
                    <Star className={`h-6 w-6 ${value <= form.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <Input
              value={form.author}
              onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))}
              placeholder="Your name"
            />
            <Input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Review title"
            />
            <textarea
              value={form.body}
              onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
              placeholder="What did you like? How was the fit?"
              rows={4}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-sm text-muted-foreground hover:bg-secondary">
              <Camera className="h-4 w-4" />
              Add up to 3 photos (2 MB each)
              <input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => loadPhotos(event.target.files)} />
            </label>
            {photos.length > 0 && <p className="text-xs text-muted-foreground">{photos.length} photo(s) selected</p>}
            <Button type="submit" className="w-full">Submit review</Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
