"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-3 text-muted-foreground"
      >
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-xs uppercase tracking-[0.18em]">Loading</p>
      </motion.div>
    </div>
  );
}
