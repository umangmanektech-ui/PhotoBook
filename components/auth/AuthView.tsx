"use client";

import { RegisterParams, useApp } from "@/lib/store/app-context";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Check,
  DollarSign,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import React, { useState } from "react";

interface AuthViewProps {
  initialMode?: "login" | "register";
  initialRole?: "customer" | "photographer";
  onComplete?: (role: "customer" | "photographer") => void;
  onSuccess?: (role: "customer" | "photographer") => void;
  onNavigate?: (tab: string) => void;
}

export function AuthView({
  initialMode = "login",
  initialRole = "customer",
  onComplete,
  onSuccess,
  onNavigate,
}: AuthViewProps) {
  const {
    registerUser,
    loginUser,
    logoutUser,
    currentUser,
    isAuthenticated,
    users,
    photographers,
  } = useApp();

  const handleFinish = (role: "customer" | "photographer") => {
    onSuccess?.(role);
    onComplete?.(role);
  };

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [role, setRole] = useState<"customer" | "photographer">(initialRole);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [city, setCity] = useState("Ahmedabad");

  // Photographer specific fields
  const [businessName, setBusinessName] = useState("");
  const [startingPrice, setStartingPrice] = useState(12000);
  const [bio, setBio] = useState(
    "Capturing unscripted emotions and timeless stories with artistic elegance.",
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Wedding",
    "Portrait",
  ]);
  const [gearText, setGearText] = useState(
    "Sony A7 IV, 24-70mm GM II, 85mm f/1.4",
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already authenticated, user cannot access login or register without signing out first
  if (isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-[#D9D2C2] bg-white p-8 sm:p-10 shadow-lg text-center my-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A1A1A] text-[#C59B27] shadow-sm mb-6">
          <ShieldCheck className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#C59B27] mb-3">
          <Lock className="h-3.5 w-3.5" />
          Active Session Detected
        </div>

        <h2 className=" text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
          Already Signed In
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-[#767471] leading-relaxed max-w-md mx-auto">
          You are currently signed in as{" "}
          <strong className="text-[#1A1A1A]">{currentUser.full_name}</strong> (
          {currentUser.email}) with an active{" "}
          <span className="font-bold text-[#C59B27]">
            {currentUser.role === "photographer"
              ? "Photographer Studio"
              : "Client Patron"}
          </span>{" "}
          account.
        </p>

        <div className="mt-5 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D2] p-4 text-xs text-[#52504E] text-left flex items-center gap-3">
          <img
            src={currentUser.avatar_url}
            alt={currentUser.full_name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-[#C59B27]/40"
          />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[#1A1A1A] text-sm truncate">
              {currentUser.full_name}
            </div>
            <div className="text-[11px] text-[#767471] truncate">
              {currentUser.email}
            </div>
            <div className="text-[10px] font-bold text-[#C59B27] uppercase tracking-wider mt-0.5">
              {currentUser.role === "photographer"
                ? "Studio Pro Account"
                : "Patron Account"}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 text-left flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Sign out required:</strong> To access the login page or
            register a new user account, please sign out of your current session
            first.
          </span>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            id="auth-signout-btn"
            onClick={() => {
              logoutUser();
              setErrorMsg(null);
              setSuccessMsg(
                "You have signed out. You can now login or create a new account.",
              );
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-bold text-white hover:bg-red-700 transition shadow-xs"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out Current Account</span>
          </button>

          <button
            id="auth-continue-btn"
            onClick={() => {
              if (onNavigate) {
                onNavigate(
                  currentUser.role === "photographer" ? "studio" : "home",
                );
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-5 py-3 text-xs font-bold text-white hover:bg-[#333] transition shadow-xs"
          >
            <span>Continue as {currentUser.full_name.split(" ")[0]}</span>
            <ArrowRight className="h-4 w-4 text-[#C59B27]" />
          </button>
        </div>
      </div>
    );
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === "register") {
      if (!fullName.trim() || !email.trim()) {
        setErrorMsg("Please enter your full name and email address.");
        return;
      }

      const params: RegisterParams = {
        role,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        business_name:
          role === "photographer"
            ? businessName || `${fullName} Photography`
            : undefined,
        bio: role === "photographer" ? bio : undefined,
        starting_price:
          role === "photographer" ? Number(startingPrice) : undefined,
        categories: role === "photographer" ? selectedCategories : undefined,
        gear:
          role === "photographer"
            ? gearText
                .split(",")
                .map((g) => g.trim())
                .filter(Boolean)
            : undefined,
      };

      const res = registerUser(params);
      if (res.success) {
        setSuccessMsg(`Welcome to PhotoBook, ${fullName}! Account created.`);
        setTimeout(() => {
          handleFinish(role);
          if (onNavigate)
            onNavigate(role === "photographer" ? "studio" : "home");
        }, 600);
      } else {
        setErrorMsg(res.error || "Failed to create account.");
      }
    } else {
      // Login
      if (!email.trim()) {
        setErrorMsg("Please enter your email address to sign in.");
        return;
      }
      const res = loginUser(email.trim(), role);
      if (res.success) {
        const userRole: "customer" | "photographer" =
          res.user?.role === "photographer" ? "photographer" : "customer";
        setSuccessMsg(`Signed in successfully as ${res.user?.full_name}!`);
        setTimeout(() => {
          handleFinish(userRole);
          if (onNavigate)
            onNavigate(userRole === "photographer" ? "studio" : "home");
        }, 500);
      } else {
        setErrorMsg(res.error || "Invalid credentials.");
      }
    }
  };

  const handleQuickLogin = (
    userEmail: string,
    userRole: "customer" | "photographer",
  ) => {
    const res = loginUser(userEmail, userRole);
    if (res.success) {
      const uRole: "customer" | "photographer" =
        res.user?.role === "photographer" ? "photographer" : "customer";
      handleFinish(uRole);
      if (onNavigate) onNavigate(uRole === "photographer" ? "studio" : "home");
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-xl rounded-3xl border border-[#D9D2C2] bg-white p-4 sm:p-10 shadow-xl">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#C59B27] mb-3">
            <Sparkles className="h-3 w-3" />
            PhotoBook Atelier
          </div>
          <h1 className=" text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            {mode === "login"
              ? "Sign In to Your Account"
              : "Create Your PhotoBook Account"}
          </h1>
          <p className="mt-1 text-xs text-[#767471] max-w-md mx-auto">
            {mode === "login"
              ? "Access your reservations, curated portfolios, and direct commission dashboard."
              : "Join as a client looking to book world-class visual artists or list your photography atelier."}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 rounded-2xl bg-[#F0ECE1] p-1.5 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
            }}
            className={`rounded-xl py-2 text-xs font-bold transition ${
              mode === "login"
                ? "bg-white text-[#1A1A1A] shadow-xs"
                : "text-[#767471] hover:text-[#1A1A1A]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg(null);
            }}
            className={`rounded-xl py-2 text-xs font-bold transition ${
              mode === "register"
                ? "bg-white text-[#1A1A1A] shadow-xs"
                : "text-[#767471] hover:text-[#1A1A1A]"
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#767471] mb-2">
            I am joining as
          </label>
          <div className="grid min-[380px]:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition ${
                role === "customer"
                  ? "border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-sm"
                  : "border-[#E8E2D2] bg-[#FBF9F5] text-[#1A1A1A] hover:border-[#C59B27]"
              }`}
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  role === "customer"
                    ? "bg-[#333] text-[#C59B27]"
                    : "bg-white text-[#767471] border border-[#E8E2D2]"
                }`}
              >
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold">Client / Patron</div>
                <div
                  className={`text-[10px] mt-0.5 ${role === "customer" ? "text-[#E8E2D2]" : "text-[#767471]"}`}
                >
                  Book verified photographers with zero upfront fees
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("photographer")}
              className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
                role === "photographer"
                  ? "border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-sm"
                  : "border-[#E8E2D2] bg-[#FBF9F5] text-[#1A1A1A] hover:border-[#C59B27]"
              }`}
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  role === "photographer"
                    ? "bg-[#333] text-[#C59B27]"
                    : "bg-white text-[#767471] border border-[#E8E2D2]"
                }`}
              >
                <Camera className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold">Photographer</div>
                <div
                  className={`text-[10px] mt-0.5 ${role === "photographer" ? "text-[#E8E2D2]" : "text-[#767471]"}`}
                >
                  Showcase portfolio & manage commissions
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-[#767471]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={
                    role === "photographer"
                      ? "e.g. Vikram Sharma"
                      : "e.g. Tanya Singhania"
                  }
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-9 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                />
              </div>
            </div>
          )}

          {mode === "register" && role === "photographer" && (
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Studio / Brand Name
              </label>
              <div className="relative">
                <Camera className="absolute left-3 top-2.5 h-4 w-4 text-[#767471]" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Vikram Visuals & Co."
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-9 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#767471]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-9 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
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
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-9 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {mode === "register" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[#767471]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-9 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  City / Base Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-[#767471]" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Ahmedabad, Mumbai, Jaipur"
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-9 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Extra Photographer Pro Fields */}
          {mode === "register" && role === "photographer" && (
            <div className="space-y-3 pt-2 border-t border-[#F0ECE1]">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Starting Session Rate (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-[#767471]" />
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-9 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Photography Specialties
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Wedding",
                    "Pre-Wedding",
                    "Portrait",
                    "Event",
                    "Fashion & Editorial",
                    "Maternity",
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition ${
                        selectedCategories.includes(cat)
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                          : "border-[#D9D2C2] bg-[#FBF9F5] text-[#52504E]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Camera Gear & Lenses
                </label>
                <input
                  type="text"
                  value={gearText}
                  onChange={(e) => setGearText(e.target.value)}
                  placeholder="e.g. Sony A7 IV, 24-70mm GM II, 85mm f/1.4"
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 px-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Artist Bio & Statement
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full mt-6 rounded-2xl bg-[#1A1A1A] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#333] transition flex items-center justify-center gap-2"
          >
            <span>
              {mode === "login" ? "Sign In" : "Create Atelier Account"}
            </span>
            <ArrowRight className="h-4 w-4 text-[#C59B27]" />
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-[#F0ECE1] text-center text-xs text-[#767471]">
          {mode === "login" ? (
            <span>
              New to PhotoBook?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-bold text-[#C59B27] hover:underline"
              >
                Create an account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
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
