import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/mock-data/products";
import { SITE_CONFIG } from "@/lib/constants";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const userText = (message || "").trim();

    if (!userText) {
      return NextResponse.json({
        reply: "Hello! How can I assist you with your luxury shopping today?",
        recommendations: [],
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If real Gemini API key is configured and available
    if (apiKey) {
      try {
        const catalogContext = PRODUCTS.slice(0, 10)
          .map((p) => `- ${p.name} (${p.category}): ৳${p.price}. ${p.shortDescription}`)
          .join("\n");

        const prompt = `You are Luxe Concierge, an AI luxury shopping assistant for Luxe eCommerce in Bangladesh.
Store info:
- Currency: BDT (৳)
- Phone: ${SITE_CONFIG.contact.phoneDisplay}
- Delivery: Inside Dhaka ৳80 (24-48h), Nationwide ৳150 (2-4 business days), Free on orders over ৳5,000
- Returns: 30 days hassle-free
- Products catalog:
${catalogContext}

Answer the user in a helpful, friendly, and elegant luxury brand tone. If they speak Bangla or Banglish, answer in polite Bangla/Banglish. Keep answers concise (2-4 sentences max).

User message: ${userText}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          },
        );

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            // Find recommended products based on user query
            const recommendations = findMatchingRecommendations(userText);
            return NextResponse.json({ reply, recommendations });
          }
        }
      } catch {
        // Fall back to built-in intelligent engine
      }
    }

    // Built-in Intelligent Concierge Engine (Works 100% offline & without API keys)
    const { reply, recommendations } = generateIntelligentResponse(userText);
    return NextResponse.json({ reply, recommendations });
  } catch (err) {
    return NextResponse.json(
      {
        reply: "Our style concierge is at your service. How may I assist you with sizes, orders, or fashion advice?",
        recommendations: [],
      },
      { status: 200 },
    );
  }
}

function findMatchingRecommendations(text: string): Product[] {
  const q = text.toLowerCase();
  return PRODUCTS.filter((p) => {
    const name = p.name.toLowerCase();
    const cat = p.category.toLowerCase();
    const tags = p.tags.map((t) => t.toLowerCase());
    return (
      q.includes(cat) ||
      name.split(" ").some((word) => word.length > 3 && q.includes(word)) ||
      tags.some((t) => q.includes(t))
    );
  }).slice(0, 2);
}

function generateIntelligentResponse(userText: string): { reply: string; recommendations: Product[] } {
  const q = userText.toLowerCase();

  // Recommendations query
  if (
    q.includes("recommend") ||
    q.includes("suggest") ||
    q.includes("shirt") ||
    q.includes("dress") ||
    q.includes("watch") ||
    q.includes("coat") ||
    q.includes("jacket") ||
    q.includes("gift") ||
    q.includes("best") ||
    q.includes("dekhan") ||
    q.includes("kinbo")
  ) {
    let matches: Product[] = [];
    if (q.includes("watch") || q.includes("ghori") || q.includes("accessory")) {
      matches = PRODUCTS.filter((p) => p.category === "accessories").slice(0, 2);
    } else if (q.includes("dress") || q.includes("women") || q.includes("meye")) {
      matches = PRODUCTS.filter((p) => p.category === "women").slice(0, 2);
    } else {
      matches = PRODUCTS.filter((p) => p.category === "men").slice(0, 2);
    }

    if (matches.length === 0) matches = PRODUCTS.slice(0, 2);

    return {
      reply: `Here are our top curated selections tailored to your taste. Each piece is crafted from premium materials and comes with our signature luxury packaging:`,
      recommendations: matches,
    };
  }

  // Delivery & Shipping query
  if (q.includes("delivery") || q.includes("ship") || q.includes("charge") || q.includes("koto din")) {
    return {
      reply:
        "Inside Dhaka delivery takes 24–48 hours for ৳80. Nationwide delivery takes 2–4 business days for ৳150. Orders over ৳5,000 enjoy Free Standard Delivery!",
      recommendations: [],
    };
  }

  // Return & Exchange query
  if (q.includes("return") || q.includes("refund") || q.includes("exchange") || q.includes("ferot")) {
    return {
      reply:
        "We offer a 30-day hassle-free return and exchange policy for unworn items with original tags intact. You can initiate a return directly from your Account or /returns page.",
      recommendations: [],
    };
  }

  // Order Tracking query
  if (q.includes("track") || q.includes("order") || q.includes("status")) {
    return {
      reply:
        "You can track your order status in real time anytime on our /orders page or under My Account. You will also receive SMS updates as soon as your courier rider is en route.",
      recommendations: [],
    };
  }

  // Payment methods
  if (q.includes("payment") || q.includes("pay") || q.includes("bkash") || q.includes("cod") || q.includes("card")) {
    return {
      reply:
        "We accept Cash on Delivery (COD) nationwide with parcel inspection, as well as Visa, Mastercard, bKash, and Nagad.",
      recommendations: [],
    };
  }

  // Bangla Greetings & general assistance
  if (q.includes("kemon") || q.includes("ki khobor") || q.includes("hello") || q.includes("hi")) {
    return {
      reply:
        "Hello! I am your Luxe AI Concierge. I can help you find products, check delivery charges, track orders, or curate a complete outfit. What are you looking for today?",
      recommendations: PRODUCTS.slice(0, 2),
    };
  }

  return {
    reply:
      "Thank you for reaching out to Luxe Concierge! I can help you discover matching outfits, check size fits, and track shipments. Feel free to ask about any product or styling advice.",
    recommendations: PRODUCTS.slice(0, 2),
  };
}

