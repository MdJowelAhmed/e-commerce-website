"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type Values = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async (data: Values) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSent(true);
    toast.success(`Reset link sent to ${data.email}`);
  };

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight md:text-4xl">Reset your password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the email on your account. We&apos;ll send a link to choose a new password.
      </p>

      {sent ? (
        <p className="mt-8 rounded-2xl border bg-secondary/40 p-5 text-sm text-muted-foreground">
          Check your inbox for the reset link. It expires after 30 minutes.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reset-email" className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="reset-email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                className="pl-9"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "reset-email-error" : undefined}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p id="reset-email-error" className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
