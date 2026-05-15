"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS } from "@/lib/mock-data/products";
import { cn, formatCurrency } from "@/lib/utils";

type SortKey = "name" | "price" | "stock" | "rating";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "name",
    dir: "asc",
  });

  const filtered = useMemo(() => {
    let items = [...PRODUCTS];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
      );
    }
    if (category !== "all") items = items.filter((p) => p.category === category);
    items.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return items;
  }, [search, category, sort]);

  const totalStock = filtered.reduce((sum, p) => sum + p.stock, 0);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Catalog</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} products · {totalStock} units in stock
          </p>
        </div>
        <Button onClick={() => toast("Open the new product form (demo)")}>
          <Plus className="h-4 w-4" />
          Add product
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border bg-background p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="women">Women</SelectItem>
            <SelectItem value="men">Men</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="shoes">Footwear</SelectItem>
            <SelectItem value="home">Home</SelectItem>
            <SelectItem value="beauty">Beauty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3 font-medium">
                  <SortHeader label="Product" active={sort.key === "name"} dir={sort.dir} onClick={() => toggleSort("name")} />
                </th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">
                  <SortHeader label="Price" active={sort.key === "price"} dir={sort.dir} onClick={() => toggleSort("price")} />
                </th>
                <th className="p-3 font-medium">
                  <SortHeader label="Stock" active={sort.key === "stock"} dir={sort.dir} onClick={() => toggleSort("stock")} />
                </th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="h-7 w-7" />
                      <p>No products match your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => {
                  const lowStock = p.stock < 25;
                  const outOfStock = p.stock === 0;
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b last:border-b-0 transition-colors hover:bg-secondary/40"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-secondary">
                            <Image
                              src={p.images[0].url}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 capitalize text-muted-foreground">{p.category}</td>
                      <td className="p-3 font-medium">{formatCurrency(p.price)}</td>
                      <td className="p-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                            outOfStock
                              ? "bg-destructive/10 text-destructive"
                              : lowStock
                                ? "bg-amber-500/15 text-amber-700"
                                : "bg-success/15 text-success",
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              outOfStock
                                ? "bg-destructive"
                                : lowStock
                                  ? "bg-amber-500"
                                  : "bg-success",
                            )}
                          />
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {p.isFeatured && <Badge variant="secondary">Featured</Badge>}
                          {p.isNew && <Badge>New</Badge>}
                          {p.isOnSale && <Badge variant="accent">Sale</Badge>}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast("Editing product (demo)")}>
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast("Duplicating product (demo)")}>
                              <Plus className="h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => toast("Archiving product (demo)")}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 transition-colors hover:text-foreground",
        active && "text-foreground",
      )}
    >
      {label}
      {active && (dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
    </button>
  );
}
