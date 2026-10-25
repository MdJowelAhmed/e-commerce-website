import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-xs uppercase tracking-[0.18em]">Loading</p>
      </div>
    </div>
  );
}
