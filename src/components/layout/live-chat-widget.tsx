"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  HelpCircle,
  MessageCircle,
  Package,
  RotateCcw,
  Send,
  Sparkles,
  Truck,
  User,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMounted } from "@/hooks/use-mounted";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  recommendations?: Product[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "bot",
    text: "Hello! I am your Luxe Gemini Live AI Concierge. How can I assist with your styling or order today?",
    timestamp: "Just now",
  },
];

const SUGGESTED_QUESTIONS = [
  "Recommend a summer shirt",
  "Delivery charge koto?",
  "Suggest a luxury gift under ৳5,000",
  "Return policy ki?",
];

export function LiveChatWidget() {
  const mounted = useMounted();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  if (!mounted) return null;

  const handleSend = async (userText: string) => {
    const text = userText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: data.reply || "I am here to help you choose the best luxury outfit.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            recommendations: data.recommendations,
          },
        ]);
      } else {
        throw new Error("Chat response failed");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "Our concierge is available 24/7. Delivery is ৳80 inside Dhaka (24-48h) and ৳150 nationwide. Free standard shipping applies on all orders above ৳5,000!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Prominent Floating Toggle Button in Bottom Right */}
      <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-2">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-background border border-primary/40 px-3 py-1 shadow-md text-[11px] font-semibold text-primary backdrop-blur"
          >
            <Sparkles className="h-3 w-3 text-amber-500 animate-spin" />
            <span>Need styling help? Ask Gemini AI</span>
          </motion.div>
        )}

        <Button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Gemini AI Concierge"
          className="h-14 px-4 sm:px-5 rounded-full shadow-2xl bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground hover:scale-105 transition-all flex items-center gap-2 border-2 border-white/20 ring-4 ring-primary/20"
        >
          {isOpen ? (
            <>
              <X className="h-6 w-6" />
              <span className="font-semibold text-xs hidden sm:inline">Close</span>
            </>
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-primary" />
              </div>
              <span className="font-semibold text-xs tracking-wide">
                Gemini AI Concierge
              </span>
            </>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-8 z-50 w-[94vw] sm:w-[400px] h-[550px] rounded-3xl border border-border/80 bg-background shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-2xl bg-primary-foreground/15 flex items-center justify-center border border-white/20 shadow-inner">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-sm">Gemini Live AI</h3>
                    <Badge variant="outline" className="border-amber-300/60 bg-amber-400/20 text-amber-200 text-[9px] px-1.5 py-0 uppercase">
                      Google Gemini
                    </Badge>
                  </div>
                  <p className="text-[11px] text-primary-foreground/80 mt-0.5">
                    Live Luxury Shopping & Style Concierge
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground p-1 rounded-full transition"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2 border-b bg-secondary/30 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full border bg-background hover:bg-secondary transition shrink-0 font-medium text-foreground text-left shadow-xs"
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                  {q}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "bot" && (
                    <div className="h-7 w-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                        m.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-secondary/70 border text-foreground rounded-bl-sm"
                      }`}
                    >
                      <p>{m.text}</p>
                      <span
                        className={`text-[9px] mt-1 block opacity-60 ${
                          m.sender === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {m.timestamp}
                      </span>
                    </div>

                    {/* In-chat Product Recommendations */}
                    {m.recommendations && m.recommendations.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 pt-1">
                        {m.recommendations.map((prod) => (
                          <Link
                            key={prod.id}
                            href={`/product/${prod.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="group flex items-center gap-2.5 p-2 rounded-xl border bg-card hover:border-primary/60 hover:bg-secondary/40 transition shadow-xs"
                          >
                            <div className="relative aspect-square w-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                              <Image
                                src={prod.images[0]?.url || ""}
                                alt={prod.name}
                                fill
                                sizes="48px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-semibold text-foreground truncate">
                                {prod.name}
                              </p>
                              <p className="text-[11px] font-medium text-primary">
                                {formatCurrency(prod.price)}
                              </p>
                            </div>
                            <span className="text-[10px] font-medium text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                              View <ArrowRight className="h-3 w-3" />
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-muted-foreground text-[11px]">
                  <div className="h-7 w-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  </div>
                  <div className="bg-secondary/70 border rounded-2xl px-3 py-2 flex items-center gap-1">
                    <span className="text-[10px] font-medium mr-1 text-primary">Gemini is thinking</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t bg-card flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Gemini about shirts, delivery, fit..."
                className="text-xs h-10 rounded-xl"
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl"
                disabled={!input.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
