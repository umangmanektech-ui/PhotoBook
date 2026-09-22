"use client";

import { useApp } from "@/lib/store/app-context";
import {
  AlertCircle,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import React, { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (role: "customer" | "photographer") => void;
  /** Called when the user clicks "Create account" — close modal and go to register page */
  onNavigateToRegister?: () => void;
  customTitle?: string;
  customDescription?: string;
  initialMode?: "login" | "register";
  initialRole?: "customer" | "photographer";
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  onNavigateToRegister,
  customTitle,
  customDescription,
  initialMode = "login",
  initialRole = "customer",
}: AuthModalProps) {
  const {
    loginUser,
    registerUser,
    logoutUser,
    currentUser,
    isAuthenticated,
    users,
    switchUserRole,
  } = useApp();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [role, setRole] = useState<"customer" | "photographer">(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Ahmedabad");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  if (isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
        <div className="w-full max-w-md rounded-3xl border border-[#D9D2C2] bg-white p-6 shadow-2xl animate-in zoom-in-95 text-center">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D2]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
              Active Session
            </span>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-[#767471] hover:bg-[#F0ECE1]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A1A1A] text-[#C59B27] mb-3">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className=" text-xl font-bold text-[#1A1A1A]">
              You are already signed in
            </h3>
            <p className="mt-1 text-xs text-[#767471]">
              Signed in as <strong>{currentUser.full_name}</strong> (
              {currentUser.email})
            </p>
          </div>

          <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200 text-left">
            Please sign out first if you want to switch to a different account
            or register a new user.
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => {
                logoutUser();
                setError(null);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out to Change Account</span>
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] hover:bg-white transition"
            >
              Continue Current Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "login") {
      const res = loginUser(email, role);
      if (res.success) {
        onSuccess?.(role);
        onClose();
      } else {
        setError(res.error || "Invalid email or credentials.");
      }
    } else {
      if (!fullName.trim() || !email.trim()) {
        setError("Please fill in all required fields.");
        return;
      }
      const res = registerUser({
        role,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
      });
      if (res.success) {
        onSuccess?.(role);
        onClose();
      } else {
        setError(res.error || "An account with this email already exists.");
      }
    }
  };

  const handleQuickCustomer = () => {
    switchUserRole("customer");
    onSuccess?.("customer");
    onClose();
  };

  const handleQuickPhotographer = () => {
    switchUserRole("photographer");
    onSuccess?.("photographer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-[#D9D2C2] bg-[#FBF9F5] p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D2]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1A1A1A] text-[#C59B27]">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className=" text-lg font-bold text-[#1A1A1A]">
              {customTitle ||
                (mode === "login"
                  ? "Patron & Atelier Access"
                  : "Create PhotoBook Account")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#767471] hover:bg-[#F0ECE1]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {customDescription && (
          <div className="mt-3 rounded-xl bg-[#F0ECE1]/70 border border-[#E8E2D2] p-3 text-xs text-[#52504E]">
            {customDescription}
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#767471] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full rounded-xl border border-[#D9D2C2] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#767471] mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-[#D9D2C2] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#767471] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ahmedabad"
                    className="w-full rounded-xl border border-[#D9D2C2] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-[#767471] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#767471]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-[#D9D2C2] bg-white py-2 pl-9 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#767471] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#767471]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#D9D2C2] bg-white py-2 pl-9 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
              />
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-[#767471] mb-1">
                Registration Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`rounded-xl py-2 px-3 text-xs font-semibold border transition ${
                    role === "customer"
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                      : "border-[#D9D2C2] bg-white text-[#52504E]"
                  }`}
                >
                  Client / Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("photographer")}
                  className={`rounded-xl py-2 px-3 text-xs font-semibold border transition ${
                    role === "photographer"
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                      : "border-[#D9D2C2] bg-white text-[#52504E]"
                  }`}
                >
                  Photographer Pro
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 rounded-xl bg-[#1A1A1A] py-3 text-xs font-semibold text-white hover:bg-[#333] transition"
          >
            {mode === "login" ? "Sign In" : "Register Account"}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#E8E2D2] text-center text-xs text-[#767471]">
          {mode === "login" ? (
            <span>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  setError(null);
                  onClose();
                  onNavigateToRegister?.();
                }}
                className="font-bold text-[#C59B27] hover:underline"
              >
                Create account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setError(null);
                  setMode("login");
                }}
                className="font-bold text-[#C59B27] hover:underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
