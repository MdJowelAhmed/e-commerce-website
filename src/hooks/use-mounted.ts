"use client";

import { useEffect, useState } from "react";

/**
 * Returns true after the component has been mounted on the client.
 * Useful for avoiding hydration mismatches when reading from `window`,
 * `document` or persisted Redux state.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
