import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Luxe handles the information you share with the store.",
};

export default function PrivacyPage() {
  return (
    <article className="container-tight py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Legal</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Privacy</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Luxe stores the details you give us to complete an order: your name, email, phone,
          and shipping address. Payment card numbers are not saved after checkout.
        </p>
        <p>
          Your bag, wishlist, and compare list stay in this browser until you clear them.
          Newsletter signup stores only the email address you submit.
        </p>
        <p>
          We do not sell personal information. To ask about your data, email{" "}
          <a className="text-foreground underline" href="mailto:support@luxe.example">
            support@luxe.example
          </a>
          .
        </p>
      </div>
    </article>
  );
}
