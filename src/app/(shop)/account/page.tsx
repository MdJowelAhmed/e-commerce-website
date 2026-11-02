"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Award,
  Check,
  Crown,
  FileText,
  Home,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { OrderInvoiceDialog } from "@/components/shared/order-invoice-dialog";
import { useMounted } from "@/hooks/use-mounted";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useListOrdersQuery } from "@/lib/store/services/api";
import { signOut } from "@/lib/store/slices/commerce-slice";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Address, Order } from "@/types";

interface SavedAddressItem extends Address {
  id: string;
  label: "Home" | "Work" | "Other";
  isDefault?: boolean;
}

const DEFAULT_ADDRESSES: SavedAddressItem[] = [
  {
    id: "addr-1",
    label: "Home",
    fullName: "Jowel Ahmed",
    email: "user@example.com",
    phone: "01712345678",
    line1: "House 24, Road 7, Block C",
    line2: "Banani",
    city: "Dhaka",
    state: "Dhaka",
    postalCode: "1213",
    country: "Bangladesh",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Work",
    fullName: "Jowel Ahmed",
    email: "user@example.com",
    phone: "01812345679",
    line1: "Plot 15, Gulshan Avenue",
    line2: "Level 8, Tower A",
    city: "Dhaka",
    state: "Dhaka",
    postalCode: "1212",
    country: "Bangladesh",
    isDefault: false,
  },
];

type AccountTab = "profile" | "addresses" | "orders" | "security";

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mounted = useMounted();
  const signedInEmail = useAppSelector((state) => state.commerce.signedInEmail);
  const loyaltyPoints = useAppSelector((state) => state.commerce.loyaltyPoints);
  const membershipTier = useAppSelector((state) => state.commerce.membershipTier);
  const { data: orders } = useListOrdersQuery();

  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [profileName, setProfileName] = useState("Jowel Ahmed");
  const [profilePhone, setProfilePhone] = useState("01712-345678");
  const [addresses, setAddresses] = useState<SavedAddressItem[]>(DEFAULT_ADDRESSES);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  // New address form state
  const [newAddr, setNewAddr] = useState<Partial<SavedAddressItem>>({
    label: "Home",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "Dhaka",
    state: "Dhaka",
    postalCode: "1213",
    country: "Bangladesh",
    isDefault: false,
  });

  // Password change state
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("luxe.saved_addresses");
      if (saved) {
        setAddresses(JSON.parse(saved));
      }
      const savedName = localStorage.getItem("luxe.profile.name");
      if (savedName) setProfileName(savedName);
      const savedPhone = localStorage.getItem("luxe.profile.phone");
      if (savedPhone) setProfilePhone(savedPhone);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveAddressesToStorage = (updated: SavedAddressItem[]) => {
    setAddresses(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("luxe.saved_addresses", JSON.stringify(updated));
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("luxe.profile.name", profileName);
      localStorage.setItem("luxe.profile.phone", profilePhone);
    }
    toast.success("Profile information updated successfully!");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.line1 || !newAddr.city) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const item: SavedAddressItem = {
      id: `addr-${Date.now()}`,
      label: newAddr.label || "Home",
      fullName: newAddr.fullName,
      email: signedInEmail || "user@example.com",
      phone: newAddr.phone,
      line1: newAddr.line1,
      line2: newAddr.line2 || "",
      city: newAddr.city,
      state: newAddr.state || "Dhaka",
      postalCode: newAddr.postalCode || "1200",
      country: newAddr.country || "Bangladesh",
      isDefault: Boolean(newAddr.isDefault),
    };

    let updated = [...addresses];
    if (item.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: false }));
    }
    updated.push(item);
    saveAddressesToStorage(updated);
    setAddressModalOpen(false);
    toast.success("New address added to address book!");
    setNewAddr({
      label: "Home",
      fullName: "",
      phone: "",
      line1: "",
      line2: "",
      city: "Dhaka",
      state: "Dhaka",
      postalCode: "1213",
      country: "Bangladesh",
      isDefault: false,
    });
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    saveAddressesToStorage(updated);
    toast.success("Address removed");
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    saveAddressesToStorage(updated);
    toast.success("Default address updated");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwords.newPass.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    toast.success("Password changed successfully!");
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  const handleLogout = () => {
    dispatch(signOut());
    toast.success("Signed out successfully");
    router.push("/");
  };

  const displayName = profileName || (signedInEmail ? signedInEmail.split("@")[0] : "Guest User");
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="container-wide py-10 lg:py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-sm">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
                {displayName}
              </h1>
              {membershipTier !== "none" && (
                <Badge variant="outline" className="capitalize gap-1 border-amber-500/50 text-amber-600 bg-amber-500/10">
                  <Crown className="h-3 w-3" />
                  {membershipTier} Member
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {signedInEmail || "guest@luxe.example"} • {loyaltyPoints} Rewards Points
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild size="sm">
            <Link href="/rewards" className="gap-1.5">
              <Award className="h-4 w-4" />
              Rewards ({loyaltyPoints} pts)
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4 mr-1.5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Grid: Tabs & Content */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
              activeTab === "profile"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserIcon className="h-4 w-4" />
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
              activeTab === "addresses"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="h-4 w-4" />
            Address Book
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {addresses.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
              activeTab === "orders"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-4 w-4" />
            Orders & Invoices
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
              activeTab === "security"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Security & Login
          </button>
        </aside>

        {/* Tab Content */}
        <section className="md:col-span-3">
          {/* TAB 1: Profile Info */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border bg-card p-6 md:p-8">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your contact details and default account identity.
                </p>

                <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4 max-w-lg">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={signedInEmail || "user@example.com"}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Contact support to change your verified primary email.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="e.g. 01712-345678"
                    />
                  </div>

                  <Button type="submit" className="mt-2">
                    Save Changes
                  </Button>
                </form>
              </div>

              {/* Membership & Loyalty Banner */}
              <div className="rounded-2xl border bg-secondary/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    Luxe VIP Club
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    You currently have <span className="font-semibold text-foreground">{loyaltyPoints}</span> loyalty points.
                    Earn points on every purchase and redeem for instant discounts.
                  </p>
                </div>
                <Button variant="outline" asChild size="sm">
                  <Link href="/membership">View Benefits</Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Address Book */}
          {activeTab === "addresses" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Address Book</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Manage delivery and billing destinations for express checkout.
                  </p>
                </div>

                <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1.5">
                      <Plus className="h-4 w-4" />
                      Add Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Delivery Address</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddAddress} className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Address Label</Label>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={newAddr.label}
                            onChange={(e) =>
                              setNewAddr({ ...newAddr, label: e.target.value as "Home" | "Work" | "Other" })
                            }
                          >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Recipient Name *</Label>
                          <Input
                            placeholder="Full name"
                            value={newAddr.fullName}
                            onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Phone Number *</Label>
                        <Input
                          placeholder="e.g. 01712345678"
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Street Address / House *</Label>
                        <Input
                          placeholder="House, road, flat number"
                          value={newAddr.line1}
                          onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Area / Landmark</Label>
                        <Input
                          placeholder="Apartment, suite, unit (optional)"
                          value={newAddr.line2}
                          onChange={(e) => setNewAddr({ ...newAddr, line2: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">City *</Label>
                          <Input
                            value={newAddr.city}
                            onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">District/State</Label>
                          <Input
                            value={newAddr.state}
                            onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Postal Code</Label>
                          <Input
                            value={newAddr.postalCode}
                            onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 pt-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={newAddr.isDefault}
                          onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                          className="rounded border-input"
                        />
                        Set as default shipping address
                      </label>

                      <Button type="submit" className="w-full mt-4">
                        Save Address
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-2xl border p-5 relative transition-all ${
                      addr.isDefault ? "border-primary bg-primary/5 shadow-sm" : "bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-semibold">
                          {addr.label}
                        </Badge>
                        {addr.isDefault && (
                          <Badge variant="secondary" className="text-[11px] bg-primary/10 text-primary">
                            Default
                          </Badge>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-muted-foreground hover:text-destructive p-1"
                        aria-label="Delete address"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 text-sm">
                      <p className="font-semibold text-foreground">{addr.fullName}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ""}
                        <br />
                        {addr.city}, {addr.state} - {addr.postalCode}
                        <br />
                        {addr.country}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Phone: <span className="text-foreground">{addr.phone}</span>
                      </p>
                    </div>

                    {!addr.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="mt-4 text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                      >
                        Set as default
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: Orders & Invoices */}
          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Order History & Invoices</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    View order status and generate official PDF invoices.
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/orders">Full Order Tracker</Link>
                </Button>
              </div>

              {!orders?.length ? (
                <div className="rounded-2xl border bg-card p-12 text-center">
                  <Package className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="mt-3 font-medium">No orders found yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your recent purchases and invoices will appear here.
                  </p>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/products">Shop Now</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{order.number}</span>
                          <Badge variant="secondary" className="capitalize text-xs">
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Placed on {formatDate(order.createdAt)} • {order.items.length} item(s)
                        </p>
                        <p className="text-xs text-foreground font-medium mt-1">
                          Total: {formatCurrency(order.total)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => {
                            setSelectedInvoiceOrder(order);
                            setInvoiceOpen(true);
                          }}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          View Invoice
                        </Button>
                        <Button size="sm" variant="ghost" asChild className="h-8 text-xs">
                          <Link href="/orders">Track Status</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: Security & Login */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border bg-card p-6 md:p-8">
                <h2 className="text-xl font-semibold">Change Password</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Ensure your account is using a long, random password to stay secure.
                </p>

                <form onSubmit={handlePasswordChange} className="mt-6 space-y-4 max-w-lg">
                  <div className="space-y-1.5">
                    <Label htmlFor="currPass">Current Password</Label>
                    <Input
                      id="currPass"
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="newPass">New Password</Label>
                    <Input
                      id="newPass"
                      type="password"
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                      placeholder="At least 6 characters"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confPass">Confirm New Password</Label>
                    <Input
                      id="confPass"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Repeat new password"
                      required
                    />
                  </div>

                  <Button type="submit" className="mt-2">
                    Update Password
                  </Button>
                </form>
              </div>

              <div className="rounded-2xl border bg-card p-6 md:p-8">
                <h3 className="font-semibold text-base">Account Security & Sessions</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  You are currently logged in from this browser session.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs border rounded-xl p-3 bg-muted/30">
                  <div>
                    <p className="font-medium">Active Web Session</p>
                    <p className="text-muted-foreground">Windows • Chrome • Bangladesh</p>
                  </div>
                  <Badge variant="outline" className="text-emerald-600 bg-emerald-500/10">
                    Active Now
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </section>
      </div>

      {/* Invoice Modal */}
      <OrderInvoiceDialog
        order={selectedInvoiceOrder}
        open={invoiceOpen}
        onOpenChange={setInvoiceOpen}
      />
    </div>
  );
}

