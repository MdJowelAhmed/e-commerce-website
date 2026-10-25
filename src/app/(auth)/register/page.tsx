"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas";
import { clamp } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const password = watch("password") ?? "";
  const strength = passwordStrength(password);

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    toast.success(`Welcome to Luxe, ${data.name.split(" ")[0]}!`);
    router.push("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="font-display text-3xl tracking-tight md:text-4xl">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Join our community of considered shoppers.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="register-name" className="text-xs uppercase tracking-wider text-muted-foreground">
            Full name
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-name"
              autoComplete="name"
              placeholder="Your name"
              className="pl-9"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "register-name-error" : undefined}
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p id="register-name-error" className="text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="register-email" className="text-xs uppercase tracking-wider text-muted-foreground">
            Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              className="pl-9"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "register-email-error" : undefined}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p id="register-email-error" className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="register-password" className="text-xs uppercase tracking-wider text-muted-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "register-password-error" : undefined}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={strength.value} className="h-1.5 flex-1" />
            <span className="text-[10px] text-muted-foreground">{strength.label}</span>
          </div>
          {errors.password && (
            <p id="register-password-error" className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="register-confirm" className="text-xs uppercase tracking-wider text-muted-foreground">
            Confirm password
          </Label>
          <Input
            id="register-confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={errors.confirmPassword ? true : undefined}
            aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p id="register-confirm-error" className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <label htmlFor="register-terms" className="flex items-start gap-2 text-sm text-muted-foreground">
          <Checkbox
            id="register-terms"
            checked={!!watch("terms")}
            onCheckedChange={(v) => setValue("terms", Boolean(v), { shouldValidate: true })}
            className="mt-0.5"
            aria-invalid={errors.terms ? true : undefined}
            aria-describedby={errors.terms ? "register-terms-error" : undefined}
          />
          <span>
            I agree to Luxe's{" "}
            <Link href="/terms" className="font-medium text-foreground hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-foreground hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.terms && (
          <p id="register-terms-error" className="text-xs text-destructive">
            {errors.terms.message}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}

function passwordStrength(password: string): { value: number; label: string } {
  if (!password) return { value: 0, label: "—" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const value = clamp((score / 4) * 100, 5, 100);
  const label = ["Too short", "Weak", "Okay", "Good", "Strong"][score] ?? "Weak";
  return { value, label };
}
