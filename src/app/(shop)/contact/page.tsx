"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE_CONFIG } from "@/lib/constants";

const FAQS = [
  {
    question: "What are your delivery charges and delivery times?",
    answer:
      "Inside Dhaka, standard delivery takes 24–48 hours for ৳80. Nationwide delivery takes 2–4 business days for ৳150. We also offer Free Standard Delivery on all orders over ৳5,000.",
  },
  {
    question: "How do I track my package after ordering?",
    answer:
      "As soon as your order is dispatched, you will receive an SMS and email with your live courier tracking number. You can also view live updates directly on our /orders page.",
  },
  {
    question: "What is your return & refund policy?",
    answer:
      "We provide a 30-day hassle-free return and exchange policy. Items must be unworn, undamaged, and retain original tags. You can initiate a return from /returns or message our concierge.",
  },
  {
    question: "Can I inspect the parcel before paying Cash on Delivery (COD)?",
    answer:
      "Yes! With our trusted courier partners (Steadfast, Pathao, RedX), you can open and verify the parcel in front of the rider before completing payment.",
  },
  {
    question: "How do I use my Luxe Loyalty Points and Membership?",
    answer:
      "Every purchase earns reward points automatically. 100 points equals ৳100 discount, which you can apply during checkout or in your account dashboard under /rewards.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    subject: "Order Inquiry",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thank you! Your message has been sent to our concierge team.");
      setForm({
        name: "",
        email: "",
        phone: "",
        orderNumber: "",
        subject: "Order Inquiry",
        message: "",
      });
    }, 800);
  };

  return (
    <div className="container-wide py-12 lg:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">
          Customer Care
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mt-1">
          How can we help?
        </h1>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Have a question about a product, delivery status, or styling advice?
          Our concierge team is here to help 7 days a week.
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-card p-5 text-center flex flex-col items-center">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
            <Phone className="h-5 w-5" />
          </div>
          <p className="font-semibold text-sm">Call Support</p>
          <p className="text-xs text-muted-foreground mt-1">10:00 AM – 8:00 PM</p>
          <a
            href={`tel:${SITE_CONFIG.contact.phone}`}
            className="text-xs font-semibold text-primary mt-2 hover:underline"
          >
            {SITE_CONFIG.contact.phoneDisplay}
          </a>
        </div>

        <div className="rounded-2xl border bg-card p-5 text-center flex flex-col items-center">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-3">
            <MessageCircle className="h-5 w-5" />
          </div>
          <p className="font-semibold text-sm">WhatsApp Concierge</p>
          <p className="text-xs text-muted-foreground mt-1">Instant reply</p>
          <a
            href={SITE_CONFIG.social.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-emerald-600 mt-2 hover:underline"
          >
            Chat Now
          </a>
        </div>

        <div className="rounded-2xl border bg-card p-5 text-center flex flex-col items-center">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
            <Mail className="h-5 w-5" />
          </div>
          <p className="font-semibold text-sm">Email Inquiries</p>
          <p className="text-xs text-muted-foreground mt-1">Within 24 hours</p>
          <a
            href={`mailto:${SITE_CONFIG.contact.email}`}
            className="text-xs font-semibold text-primary mt-2 hover:underline"
          >
            {SITE_CONFIG.contact.email}
          </a>
        </div>

        <div className="rounded-2xl border bg-card p-5 text-center flex flex-col items-center">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
            <MapPin className="h-5 w-5" />
          </div>
          <p className="font-semibold text-sm">Flagship Boutique</p>
          <p className="text-xs text-muted-foreground mt-1">Gulshan 2, Dhaka</p>
          <span className="text-xs font-medium text-foreground mt-2">
            Open daily 10 AM – 9 PM
          </span>
        </div>
      </div>

      {/* Form & FAQ Split Section */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <div className="rounded-3xl border bg-card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Send us a message
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Fill out the form below and we will get back to you promptly.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="contactName" className="text-xs">
                  Your Name *
                </Label>
                <Input
                  id="contactName"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactEmail" className="text-xs">
                  Email Address *
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="contactPhone" className="text-xs">
                  Phone (Optional)
                </Label>
                <Input
                  id="contactPhone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01712-XXXXXX"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="orderNo" className="text-xs">
                  Order Number (If applicable)
                </Label>
                <Input
                  id="orderNo"
                  value={form.orderNumber}
                  onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                  placeholder="LX-100000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Subject / Department</Label>
              <select
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                <option value="Order Inquiry">Order Inquiry & Shipping</option>
                <option value="Returns & Exchanges">Returns & Exchanges</option>
                <option value="Product Advice">Product Advice & Sizing</option>
                <option value="Corporate / Custom Order">Corporate / Custom Order</option>
                <option value="Feedback / Other">Feedback / Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-xs">
                Message *
              </Label>
              <textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help you today?"
                className="w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                required
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              <Send className="h-4 w-4" />
              {submitting ? "Sending..." : "Submit Inquiry"}
            </Button>
          </form>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Quick answers to standard questions about our luxury storefront.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-2xl border px-4 bg-card"
              >
                <AccordionTrigger className="text-sm font-medium hover:no-underline text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="rounded-2xl border bg-secondary/30 p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Need immediate assistance?</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our automated live concierge is ready 24/7.
              </p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href="/products">Shop Catalog</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

