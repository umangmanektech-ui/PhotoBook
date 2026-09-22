"use client";

import { useApp } from "@/lib/store/app-context";
import {
  ArrowRight,
  Camera,
  Lock,
  LogIn,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("customer" | "photographer")[];
  fallbackTitle?: string;
  fallbackDescription?: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenAuth?: (
    initialMode?: "login" | "register",
    initialRole?: "customer" | "photographer",
  ) => void;
}

export function ProtectedRoute({
  children,
  allowedRoles = ["customer", "photographer"],
  fallbackTitle,
  fallbackDescription,
  onNavigate,
  onOpenAuth,
}: ProtectedRouteProps) {
  const { currentUser, switchUserRole } = useApp();

  const isGuest =
    currentUser.id === "user-guest" ||
    !currentUser.email ||
    currentUser.email === "guest@photobook.app";
  const hasAllowedRole = allowedRoles.includes(currentUser.role as any);

  // If user is authenticated and has required role, render protected child view
  if (!isGuest && hasAllowedRole) {
    return <>{children}</>;
  }

  // 1. Case: Photographer-only protected route accessed by a customer or guest
  if (
    allowedRoles.length === 1 &&
    allowedRoles[0] === "photographer" &&
    currentUser.role !== "photographer"
  ) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-[#D9D2C2] bg-white p-8 sm:p-10 shadow-lg text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A1A1A] text-[#C59B27] shadow-sm mb-5">
            <Camera className="h-7 w-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#C59B27] mb-3">
            <Lock className="h-3 w-3" />
            Studio Access Restricted
          </div>

          <h2 className=" text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            {fallbackTitle || "Photographer Portal Only"}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-[#767471] leading-relaxed max-w-md mx-auto">
            {fallbackDescription ||
              "This studio workspace, portfolio editor, pricing tiers, and inquiry calendar are reserved exclusively for registered photographer pros."}
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => {
                if (onOpenAuth) {
                  onOpenAuth("login", "photographer");
                } else {
                  onNavigate("auth", "photographer");
                }
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#333] transition"
            >
              <LogIn className="h-4 w-4 text-[#C59B27]" />
              <span>Sign In as Photographer</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>

            <button
              onClick={() => {
                if (onOpenAuth) {
                  onOpenAuth("register", "photographer");
                } else {
                  onNavigate("register", "photographer");
                }
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-6 py-3 text-xs font-bold text-[#1A1A1A] hover:bg-white transition"
            >
              <UserPlus className="h-4 w-4 text-[#C59B27]" />
              <span>Register as a New Photographer</span>
            </button>

            <div className="pt-3">
              <button
                onClick={() => switchUserRole("photographer")}
                className="text-[11px] font-semibold text-[#767471] hover:text-[#C59B27] underline"
              >
                Or instant demo switch to Photographer Pro profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Case: General protected route (e.g. My Bookings, Profile, Saved) accessed as guest
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#D9D2C2] bg-white p-8 sm:p-10 shadow-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A1A1A] text-[#C59B27] shadow-sm mb-5">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#C59B27] mb-3">
          <Lock className="h-3 w-3" />
          Protected Route
        </div>

        <h2 className=" text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
          {fallbackTitle || "Authentication Required"}
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-[#767471] leading-relaxed max-w-md mx-auto">
          {fallbackDescription ||
            "Please sign in or create an account to view and manage your reservations, curated shortlists, and private patron settings."}
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => {
              if (onOpenAuth) {
                onOpenAuth("login", "customer");
              } else {
                onNavigate("auth", "customer");
              }
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#333] transition"
          >
            <LogIn className="h-4 w-4 text-[#C59B27]" />
            <span>Sign In to Your Account</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>

          <button
            onClick={() => {
              if (onOpenAuth) {
                onOpenAuth("register", "customer");
              } else {
                onNavigate("register", "customer");
              }
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-6 py-3 text-xs font-bold text-[#1A1A1A] hover:bg-white transition"
          >
            <UserPlus className="h-4 w-4 text-[#C59B27]" />
            <span>Create a Free Account</span>
          </button>

          <div className="pt-3">
            <button
              onClick={() => onNavigate("home")}
              className="text-[11px] font-semibold text-[#767471] hover:text-[#1A1A1A]"
            >
              Return to Public Gallery & Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
