"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const SIZE_ROWS = [
  { size: "XS", chest: "81–86", waist: "63–68", hip: "86–91" },
  { size: "S", chest: "87–92", waist: "69–74", hip: "92–97" },
  { size: "M", chest: "93–99", waist: "75–81", hip: "98–104" },
  { size: "L", chest: "100–107", waist: "82–89", hip: "105–112" },
  { size: "XL", chest: "108–116", waist: "90–99", hip: "113–121" },
];

export function SizeGuideDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [chest, setChest] = useState("");
  const recommendation = useMemo(() => {
    const value = Number(chest);
    if (!value) return null;
    if (value <= 86) return "XS";
    if (value <= 92) return "S";
    if (value <= 99) return "M";
    if (value <= 107) return "L";
    return "XL";
  }, [chest]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="font-display text-2xl">Size guide & fit finder</DialogTitle>
        <p className="text-sm text-muted-foreground">
          Enter your chest measurement in centimetres for a quick recommendation.
        </p>
        <div className="flex gap-3">
          <Input
            type="number"
            min={60}
            max={150}
            value={chest}
            onChange={(event) => setChest(event.target.value)}
            placeholder="Chest in cm"
          />
          <Button type="button" variant="secondary" className="min-w-28">
            {recommendation ? `Try ${recommendation}` : "Find size"}
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Size</th>
                <th className="p-3">Chest</th>
                <th className="p-3">Waist</th>
                <th className="p-3">Hip</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_ROWS.map((row) => (
                <tr key={row.size} className="border-t">
                  <td className="p-3 font-medium">{row.size}</td>
                  <td className="p-3">{row.chest} cm</td>
                  <td className="p-3">{row.waist} cm</td>
                  <td className="p-3">{row.hip} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Bangladesh fit note: if you are between sizes, choose the larger size for a relaxed fit.
        </p>
      </DialogContent>
    </Dialog>
  );
}
