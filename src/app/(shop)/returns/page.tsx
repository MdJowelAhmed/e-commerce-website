"use client";

import { useState } from "react";
import { CheckCircle2, PackageCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useListOrdersQuery } from "@/lib/store/services/api";

export default function ReturnsPage() {
  const { data: orders = [] } = useListOrdersQuery();
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("wrong-size");
  const [details, setDetails] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!orderId) {
      toast.error("Choose an order");
      return;
    }
    setSubmitted(true);
    toast.success("Return request submitted");
  };

  return (
    <div className="container-wide py-10 lg:py-14">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Easy returns</p>
        <h1 className="mt-1 font-display text-4xl">Start a return</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Eligible items can be returned within 30 days. A demo return reference is created locally.
        </p>
      </header>

      {submitted ? (
        <section className="mt-8 max-w-2xl rounded-2xl border bg-success/5 p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
          <h2 className="mt-4 font-display text-3xl">Request received</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Reference RTN-{Date.now().toString().slice(-6)}. We will review it within one business day.
          </p>
          <Button className="mt-5" variant="outline" onClick={() => setSubmitted(false)}>
            Start another return
          </Button>
        </section>
      ) : (
        <form onSubmit={submit} className="mt-8 max-w-2xl space-y-5 rounded-2xl border p-6">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Order</span>
            <select
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              className="h-11 w-full rounded-xl border bg-background px-4 text-sm"
            >
              <option value="">Select an order</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.number} · {order.items.length} items
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium">Reason</span>
            <select
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="h-11 w-full rounded-xl border bg-background px-4 text-sm"
            >
              <option value="wrong-size">Size or fit issue</option>
              <option value="damaged">Arrived damaged</option>
              <option value="different">Different from description</option>
              <option value="changed-mind">Changed my mind</option>
            </select>
          </label>
          <Input
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Optional details"
          />
          <div className="grid gap-3 rounded-xl bg-secondary/50 p-4 text-sm sm:grid-cols-3">
            <span className="flex items-center gap-2"><RotateCcw className="h-4 w-4" /> Submit</span>
            <span className="flex items-center gap-2"><PackageCheck className="h-4 w-4" /> Drop off</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Refund</span>
          </div>
          <Button type="submit" className="w-full">Submit return request</Button>
        </form>
      )}
    </div>
  );
}
