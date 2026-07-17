"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Lock,
  Mail,
  ShieldCheck,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { CheckoutStepper, type Step } from "@/features/checkout/components/checkout-stepper";
import {
  addressSchema,
  paymentSchema,
  type AddressFormValues,
  type PaymentFormValues,
} from "@/features/checkout/schemas";
import { EXPRESS_SHIPPING_FEE, STANDARD_SHIPPING_FEE } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectCartItems, selectCartTotals } from "@/lib/store/selectors";
import { useCreateOrderMutation } from "@/lib/store/services/api";
import { clearCart, setShippingMethod } from "@/lib/store/slices/cart-slice";
import { cn, formatCurrency } from "@/lib/utils";
import type { PaymentMethod, ShippingMethod } from "@/types";

const STEPS: Step[] = [
  { id: "address", label: "Address" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

type SafePayment = {
  method: PaymentMethod;
  last4?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);
  const shipping = useAppSelector((s) => s.cart.shippingMethod);
  const [createOrder] = useCreateOrderMutation();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState<AddressFormValues | null>(null);
  const [payment, setPayment] = useState<SafePayment | null>(null);

  if (items.length === 0) {
    return (
      <div className="container-wide py-16 text-center">
        <h1 className="font-display text-3xl">Your bag is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a few pieces before checking out.
        </p>
        <Button asChild className="mt-4">
          <Link href="/products">Shop now</Link>
        </Button>
      </div>
    );
  }

  const placeOrder = async () => {
    if (!address || !payment) return;
    setSubmitting(true);
    try {
      const order = await createOrder({
        items,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        discount: totals.discount,
        total: totals.total,
        paymentMethod: payment.method,
        shippingMethod: shipping,
        shippingAddress: address,
        customer: {
          id: "guest",
          name: address.fullName,
          email: address.email,
        },
      }).unwrap();
      dispatch(clearCart());
      toast.success("Order placed successfully");
      router.push(`/order/success?n=${order.number}`);
    } catch {
      toast.error("Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-wide py-10 lg:py-14">
      <div className="mb-8 flex flex-col gap-4">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bag
        </Link>
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">Checkout</h1>
        <CheckoutStepper steps={STEPS} current={step} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="rounded-2xl border bg-background p-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: easeOut }}
              >
                <AddressStep
                  defaultValues={address}
                  onNext={(data) => {
                    setAddress(data);
                    setStep(1);
                  }}
                />
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: easeOut }}
              >
                <ShippingStep
                  value={shipping}
                  onChange={(method) => dispatch(setShippingMethod(method))}
                  onBack={() => setStep(0)}
                  onNext={() => setStep(2)}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: easeOut }}
              >
                <PaymentStep
                  onBack={() => setStep(1)}
                  onNext={(data) => {
                    const digits = (data.cardNumber ?? "").replace(/\D/g, "");
                    setPayment({
                      method: data.method,
                      last4: data.method === "card" && digits.length >= 4 ? digits.slice(-4) : undefined,
                    });
                    setStep(3);
                  }}
                />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: easeOut }}
              >
                <ReviewStep
                  items={items}
                  totalsTotal={totals.total}
                  address={address!}
                  shipping={shipping}
                  payment={payment!}
                  onBack={() => setStep(2)}
                  onPlaceOrder={placeOrder}
                  submitting={submitting}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <CartSummary hideCta />
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-success" />
            Secure checkout · 256-bit SSL encryption
          </div>
        </div>
      </div>
    </div>
  );
}

function AddressStep({
  defaultValues,
  onNext,
}: {
  defaultValues: AddressFormValues | null;
  onNext: (data: AddressFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues ?? {
      fullName: "",
      email: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <h2 className="text-lg font-semibold">Shipping address</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.fullName?.message}>
          <Input placeholder="Your name" {...register("fullName")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="email" placeholder="you@email.com" className="pl-9" {...register("email")} />
          </div>
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input placeholder="+1 555 012 0000" {...register("phone")} />
        </Field>
        <Field label="Country" error={errors.country?.message}>
          <Input {...register("country")} />
        </Field>
        <Field className="sm:col-span-2" label="Address" error={errors.line1?.message}>
          <Input placeholder="Street and number" {...register("line1")} />
        </Field>
        <Field className="sm:col-span-2" label="Apartment, suite (optional)">
          <Input {...register("line2")} />
        </Field>
        <Field label="City" error={errors.city?.message}>
          <Input {...register("city")} />
        </Field>
        <Field label="State / Region" error={errors.state?.message}>
          <Input {...register("state")} />
        </Field>
        <Field label="Postal code" error={errors.postalCode?.message}>
          <Input {...register("postalCode")} />
        </Field>
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Continue to shipping
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

function ShippingStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: ShippingMethod;
  onChange: (v: ShippingMethod) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">Shipping method</h2>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as ShippingMethod)}>
        <ShippingOption
          id="standard"
          icon={Truck}
          title="Standard shipping"
          subtitle="Arrives in 3–5 business days"
          price={STANDARD_SHIPPING_FEE}
          active={value === "standard"}
        />
        <ShippingOption
          id="express"
          icon={Zap}
          title="Express shipping"
          subtitle="Arrives in 1–2 business days"
          price={EXPRESS_SHIPPING_FEE}
          active={value === "express"}
        />
      </RadioGroup>
      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="button" size="lg" onClick={onNext}>
          Continue to payment
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ShippingOption({
  id,
  icon: Icon,
  title,
  subtitle,
  price,
  active,
}: {
  id: ShippingMethod;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  price: number;
  active: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all",
        active ? "border-foreground bg-secondary/50" : "hover:border-foreground/30",
      )}
    >
      <RadioGroupItem value={id} id={id} />
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <span className="text-sm font-semibold">{formatCurrency(price)}</span>
    </label>
  );
}

function PaymentStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: (data: PaymentFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: "card",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const method = watch("method");

  return (
    <form
      onSubmit={handleSubmit((data) => {
        // Never persist full card details past this form submit
        onNext(data);
      })}
      className="space-y-5"
    >
      <h2 className="text-lg font-semibold">Payment</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <PaymentMethodCard
          id="card"
          icon={CreditCard}
          label="Card"
          active={method === "card"}
          onClick={() => setValue("method", "card")}
        />
        <PaymentMethodCard
          id="paypal"
          icon={Wallet}
          label="PayPal"
          active={method === "paypal"}
          onClick={() => setValue("method", "paypal")}
        />
        <PaymentMethodCard
          id="cod"
          icon={Truck}
          label="Cash on delivery"
          active={method === "cod"}
          onClick={() => setValue("method", "cod")}
        />
      </div>

      <AnimatePresence mode="wait">
        {method === "card" && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <Field className="sm:col-span-2" label="Name on card" error={errors.cardName?.message}>
              <Input placeholder="Cardholder name" {...register("cardName")} />
            </Field>
            <Field className="sm:col-span-2" label="Card number" error={errors.cardNumber?.message}>
              <div className="relative">
                <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 1234 1234 1234"
                  className="pl-9"
                  {...register("cardNumber")}
                />
              </div>
            </Field>
            <Field label="Expiry" error={errors.cardExpiry?.message}>
              <Input placeholder="MM/YY" {...register("cardExpiry")} />
            </Field>
            <Field label="CVC" error={errors.cardCvc?.message}>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input inputMode="numeric" placeholder="123" className="pl-9" {...register("cardCvc")} />
              </div>
            </Field>
          </motion.div>
        )}
        {method !== "card" && (
          <motion.div
            key="alt"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="rounded-xl border bg-secondary/40 p-5 text-sm text-muted-foreground"
          >
            {method === "paypal"
              ? "You will be redirected to PayPal to complete your purchase securely."
              : "Pay in cash when your order is delivered. A small handling fee may apply."}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="submit" size="lg">
          Review order
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

function PaymentMethodCard({
  id,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 text-sm transition-all",
        active ? "border-foreground bg-secondary/50" : "hover:border-foreground/30",
      )}
      data-id={id}
    >
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary">
        <Icon className="h-4 w-4" />
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function ReviewStep({
  items,
  totalsTotal,
  address,
  shipping,
  payment,
  onBack,
  onPlaceOrder,
  submitting,
}: {
  items: ReturnType<typeof selectCartItems>;
  totalsTotal: number;
  address: AddressFormValues;
  shipping: ShippingMethod;
  payment: SafePayment;
  onBack: () => void;
  onPlaceOrder: () => void;
  submitting: boolean;
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">Review & place order</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryBlock title="Shipping to">
          <p className="font-medium text-foreground">{address.fullName}</p>
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p>{address.country}</p>
        </SummaryBlock>
        <SummaryBlock title="Shipping method">
          <p className="font-medium capitalize text-foreground">{shipping} shipping</p>
          <p>
            {shipping === "express"
              ? "Arrives in 1–2 business days"
              : "Arrives in 3–5 business days"}
          </p>
        </SummaryBlock>
        <SummaryBlock title="Payment method">
          <p className="font-medium capitalize text-foreground">{payment.method}</p>
          {payment.method === "card" && payment.last4 && (
            <p>•••• •••• •••• {payment.last4}</p>
          )}
        </SummaryBlock>
        <SummaryBlock title="Contact">
          <p>{address.email}</p>
          <p>{address.phone}</p>
        </SummaryBlock>
      </div>

      <Separator />

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.variantId}`}
            className="flex items-center gap-3 rounded-xl border bg-secondary/30 p-3"
          >
            <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-secondary">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.colorName} · {item.sizeLabel} · Qty {item.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="button" size="lg" onClick={onPlaceOrder} disabled={submitting}>
          <Lock className="h-4 w-4" />
          {submitting ? "Placing order…" : `Place order · ${formatCurrency(totalsTotal)}`}
        </Button>
      </div>
    </div>
  );
}

function SummaryBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-secondary/30 p-4 text-xs text-muted-foreground">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        {title}
      </p>
      <div className="mt-2 space-y-0.5">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
