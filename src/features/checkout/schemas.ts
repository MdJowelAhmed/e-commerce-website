import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  line1: z.string().min(3, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Region is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export const paymentSchema = z
  .object({
    method: z.enum(["card", "paypal", "cod"]),
    cardName: z.string().optional(),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method !== "card") return;
    if (!data.cardName || data.cardName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardName"],
        message: "Name on card is required",
      });
    }
    if (!data.cardNumber || data.cardNumber.replace(/\s/g, "").length < 13) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardNumber"],
        message: "Please enter a valid card number",
      });
    }
    if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardExpiry"],
        message: "Use MM/YY format",
      });
    }
    if (!data.cardCvc || !/^\d{3,4}$/.test(data.cardCvc)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardCvc"],
        message: "3 or 4 digit code",
      });
    }
  });

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export const shippingMethodSchema = z.object({
  shippingMethod: z.enum(["standard", "express"]),
});

export type ShippingMethodValues = z.infer<typeof shippingMethodSchema>;
