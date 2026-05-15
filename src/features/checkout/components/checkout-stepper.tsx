"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  label: string;
}

interface CheckoutStepperProps {
  steps: Step[];
  current: number;
}

export function CheckoutStepper({ steps, current }: CheckoutStepperProps) {
  return (
    <ol className="flex items-center justify-between gap-2">
      {steps.map((step, i) => {
        const isComplete = i < current;
        const isActive = i === current;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                  backgroundColor: isComplete
                    ? "hsl(var(--success))"
                    : isActive
                      ? "hsl(var(--foreground))"
                      : "hsl(var(--secondary))",
                  color: isComplete || isActive ? "white" : "hsl(var(--muted-foreground))",
                }}
                transition={{ duration: 0.25 }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold"
              >
                {isComplete ? <Check className="h-4 w-4" /> : i + 1}
              </motion.div>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-px flex-1 bg-border">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isComplete ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformOrigin: "left" }}
                  className="h-full bg-success"
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
