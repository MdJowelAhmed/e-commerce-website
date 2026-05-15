"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ReduxProvider } from "@/lib/store/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        <TooltipProvider delayDuration={150}>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast: "!rounded-2xl !border !bg-background !text-foreground !shadow-lg",
              },
            }}
          />
        </TooltipProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
