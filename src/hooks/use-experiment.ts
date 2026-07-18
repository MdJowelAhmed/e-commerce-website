"use client";

import { useEffect, useState } from "react";

export function useExperiment(name: string): "A" | "B" {
  const [variant, setVariant] = useState<"A" | "B">("A");

  useEffect(() => {
    const key = `luxe.experiment.${name}`;
    const existing = window.localStorage.getItem(key);
    if (existing === "A" || existing === "B") {
      setVariant(existing);
      return;
    }
    const assigned = Math.random() < 0.5 ? "A" : "B";
    window.localStorage.setItem(key, assigned);
    setVariant(assigned);
  }, [name]);

  return variant;
}

export function trackExperimentEvent(
  experiment: string,
  variant: "A" | "B",
  event: string,
) {
  if (typeof window === "undefined") return;
  const payload = { experiment, variant, event, at: new Date().toISOString() };
  window.dispatchEvent(new CustomEvent("luxe:experiment", { detail: payload }));
  const events = JSON.parse(window.localStorage.getItem("luxe.experiment.events") ?? "[]") as unknown[];
  window.localStorage.setItem(
    "luxe.experiment.events",
    JSON.stringify([...events, payload].slice(-50)),
  );
}
