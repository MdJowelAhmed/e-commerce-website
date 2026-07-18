"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  Crown,
  Gift,
  LogIn,
  LogOut,
  Moon,
  Package,
  RotateCcw,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMounted } from "@/hooks/use-mounted";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { signOut } from "@/lib/store/slices/commerce-slice";

export function ProfileMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const signedInEmail = useAppSelector((state) => state.commerce.signedInEmail);
  const loyaltyPoints = useAppSelector((state) => state.commerce.loyaltyPoints);
  const membershipTier = useAppSelector((state) => state.commerce.membershipTier);

  const handleLogout = () => {
    dispatch(signOut());
    toast.success("Signed out");
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open profile menu" className="relative">
          <User className="h-5 w-5" />
          {mounted && signedInEmail && (
            <span className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-success ring-2 ring-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          {signedInEmail ? signedInEmail.split("@")[0] : "Account"}
        </DropdownMenuLabel>
        {signedInEmail && (
          <p className="px-2 pb-2 text-xs text-muted-foreground">{signedInEmail}</p>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/orders">
            <Package className="h-4 w-4" />
            My Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/custom-offer">
            <Gift className="h-4 w-4" />
            Custom Offer
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/returns">
            <RotateCcw className="h-4 w-4" />
            Returns
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/rewards" className="justify-between">
            <span className="inline-flex items-center gap-2">
              <Award className="h-4 w-4" />
              Rewards
            </span>
            <span className="text-xs text-muted-foreground">{loyaltyPoints} pts</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/membership" className="justify-between">
            <span className="inline-flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Membership
            </span>
            {membershipTier !== "none" && (
              <span className="text-xs capitalize text-muted-foreground">
                {membershipTier}
              </span>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            setTheme(dark ? "light" : "dark");
          }}
        >
          {mounted && dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {mounted && dark ? "Light theme" : "Dark theme"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {signedInEmail ? (
          <DropdownMenuItem onSelect={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
