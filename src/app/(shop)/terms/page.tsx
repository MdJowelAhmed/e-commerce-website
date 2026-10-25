import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms that apply when you shop at Luxe.",
};

export default function TermsPage() {
  return (
    <article className="container-tight py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Legal</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Terms</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Placing an order is an offer to buy the items in your bag at the price shown,
          including shipping. We confirm the order on the success page.
        </p>
        <p>
          Prices are in Bangladeshi Taka. Standard delivery is 3–5 business days and express
          delivery is 1–2 business days inside Bangladesh.
        </p>
        <p>
          Eligible items can be returned within 14 days of delivery. See Returns for how to
          start a request. Membership benefits apply only while a plan is active.
        </p>
      </div>
    </article>
  );
}
