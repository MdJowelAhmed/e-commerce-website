"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMounted } from "@/hooks/use-mounted";
import { SITE_CONFIG } from "@/lib/constants";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "bot",
    text: "Hello! Welcome to Luxe Concierge. How can we assist with your shopping today?",
    timestamp: "Just now",
  },
];

const QUICK_ACTIONS = [
  { id: "track", label: "Track my order", icon: Package },
  { id: "shipping", label: "Delivery times", icon: Truck },
  { id: "returns", label: "Return policy", icon: RotateCcw },
  { id: "whatsapp", label: "Chat on WhatsApp", icon: MessageCircle },
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
  }, [messages, isOpen]);

  if (!mounted) return null;

  const handleSend = (userText: string) => {
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

    setTimeout(() => {
      let botReply =
        "Thank you for contacting us! Our support team is available 24/7. Would you like to connect directly on WhatsApp with our style concierge?";
      const lower = text.toLowerCase();

      if (lower.includes("track") || lower.includes("order")) {
        botReply =
          "To track an existing order, check your Order History under your Account or enter your order number on our Track Orders page (/orders).";
      } else if (lower.includes("ship") || lower.includes("deliver")) {
        botReply =
          "Standard delivery inside Dhaka takes 24–48 hours (৳80), and nationwide takes 2–4 business days (৳150). Free delivery applies on orders over ৳5,000!";
      } else if (lower.includes("return") || lower.includes("refund")) {
        botReply =
          "We offer a 30-day hassle-free return window for unworn items with tags attached. You can initiate a return directly from /returns.";
      } else if (lower.includes("size") || lower.includes("fit")) {
        botReply =
          "Our products follow standard international sizing. You can consult the interactive 'Size Guide' on any product page.";
      } else if (lower.includes("whatsapp") || lower.includes("human") || lower.includes("agent")) {
        botReply = `You can instantly reach our human concierge on WhatsApp at ${SITE_CONFIG.contact.phoneDisplay}.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleQuickAction = (id: string) => {
    if (id === "whatsapp") {
      window.open(SITE_CONFIG.social.whatsapp, "_blank");
      return;
    }
    const action = QUICK_ACTIONS.find((a) => a.id === id);
    if (action) {
      handleSend(action.label);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          aria-label="Open live chat"
          className="h-14 w-14 rounded-full shadow-2xl bg-primary text-primary-foreground hover:scale-105 transition-transform"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <MessageCircle className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
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
            className="fixed bottom-24 right-4 sm:right-6 z-40 w-[92vw] sm:w-[380px] h-[520px] rounded-3xl border border-border/80 bg-background shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Luxe Concierge</h3>
                  <p className="text-[11px] text-primary-foreground/80 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Live Shopping Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground p-1 rounded-full"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Actions Pills */}
            <div className="p-2 border-b bg-muted/40 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border bg-background hover:bg-secondary transition shrink-0 font-medium text-foreground"
                  >
                    <Icon className="h-3 w-3 text-primary" />
                    {action.label}
                  </button>
                );
              })}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "bot" && (
                    <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                      m.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
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
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-muted-foreground text-[11px]">
                  <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-primary animate-pulse" />
                  </div>
                  <div className="bg-secondary rounded-2xl px-3 py-1.5 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t bg-background flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about sizes, shipping, tracking..."
                className="text-xs h-9"
              />
              <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

