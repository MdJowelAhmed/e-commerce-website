"use client";

import { Printer, Download, CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

interface OrderInvoiceDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderInvoiceDialog({
  order,
  open,
  onOpenChange,
}: OrderInvoiceDialogProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 sm:p-6 print:m-0 print:p-0 print:border-none print:shadow-none">
        <div id="printable-invoice" className="p-6 bg-background rounded-xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-primary">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground border px-1.5 py-0.5 rounded">
                  Official Invoice
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {SITE_CONFIG.tagline} • {SITE_CONFIG.contact.phoneDisplay}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="font-mono text-sm font-semibold text-primary">
                Invoice #{order.number}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Date: {formatDate(order.createdAt)}
              </p>
              <Badge variant="outline" className="mt-2 capitalize text-xs">
                Status: {order.status}
              </Badge>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Billed / Shipped To:
              </p>
              <p className="font-medium text-foreground">
                {order.shippingAddress.fullName || order.customer.name}
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Phone: {order.shippingAddress.phone}
              </p>
              <p className="text-xs text-muted-foreground">
                Email: {order.shippingAddress.email || order.customer.email}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Payment & Shipping
              </p>
              <p className="text-xs text-muted-foreground">
                Payment Method:{" "}
                <span className="font-medium text-foreground uppercase">
                  {order.paymentMethod}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Shipping Method:{" "}
                <span className="font-medium text-foreground capitalize">
                  {order.shippingMethod}
                </span>
              </p>
              {order.trackingNumber && (
                <p className="text-xs text-muted-foreground mt-1">
                  Tracking No:{" "}
                  <span className="font-mono font-medium text-foreground">
                    {order.trackingNumber}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground border-b font-medium">
                <tr>
                  <th className="py-2.5 px-3">Item Details</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="py-3 px-3">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.colorName ? `Color: ${item.colorName} • ` : ""}
                        {item.sizeLabel ? `Size: ${item.sizeLabel}` : ""}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center text-foreground font-medium">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right text-muted-foreground">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Price Breakdown */}
          <div className="flex justify-end pt-5">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}
                </span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax / VAT</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-sm font-semibold text-foreground pt-1">
                <span>Grand Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="mt-8 border-t pt-4 text-center text-[11px] text-muted-foreground print:mt-4">
            <p>Thank you for shopping with {SITE_CONFIG.name}. Please keep this invoice for warranty and returns.</p>
            <p className="mt-0.5">Need help? Email {SITE_CONFIG.contact.email} or call {SITE_CONFIG.contact.phoneDisplay}.</p>
          </div>
        </div>

        {/* Modal Action Buttons (hidden in print) */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2 print:hidden">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-4 w-4" />
            Print / Save PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

