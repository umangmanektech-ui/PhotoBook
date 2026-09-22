"use client";

import { useApp } from "@/lib/store/app-context";
import {
  ArrowRight,
  Calendar,
  Camera,
  Check,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import React, { useState } from "react";

interface CustomerProfileViewProps {
  onNavigate: (tab: string) => void;
}

export function CustomerProfileView({ onNavigate }: CustomerProfileViewProps) {
  const {
    currentUser,
    updateUserProfile,
    bookings,
    savedPhotographerIds,
    switchUserRole,
    logoutUser,
  } = useApp();

  const [fullName, setFullName] = useState(currentUser.full_name || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [city, setCity] = useState(currentUser.city || "Ahmedabad");
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar_url || "");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const myBookings = bookings.filter((b) => b.customer_id === currentUser.id);
  const activeBookingsCount = myBookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending",
  ).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      avatar_url: avatarUrl.trim() || currentUser.avatar_url,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-[#D9D2C2] bg-white p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={avatarUrl || currentUser.avatar_url}
                alt={currentUser.full_name}
                className="h-20 w-20 rounded-2xl object-cover border-2 border-[#C59B27]/40 shadow-xs"
              />
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1A1A1A] text-[#C59B27] shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className=" text-2xl font-bold text-[#1A1A1A]">
                  {currentUser.full_name || "Client Account"}
                </h1>
                <span className="rounded-full bg-[#C59B27]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#997316]">
                  Verified Patron
                </span>
              </div>
              <p className="text-xs text-[#767471] mt-0.5">
                {currentUser.email} • {currentUser.city || "Ahmedabad"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                switchUserRole("photographer");
                onNavigate("studio");
              }}
              className="flex items-center gap-1.5 rounded-xl border border-[#C59B27] bg-[#FDFBF7] px-3.5 py-2 text-xs font-bold text-[#997316] hover:bg-[#F0ECE1] transition shadow-xs"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Switch to Studio Pro</span>
            </button>
            <button
              type="button"
              onClick={() => {
                logoutUser();
                onNavigate("auth");
              }}
              className="flex items-center gap-1.5 rounded-xl border border-[#E8E2D2] px-3 py-2 text-xs font-semibold text-[#767471] hover:bg-red-50 hover:text-red-700 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#F0ECE1]">
          <button
            type="button"
            onClick={() => onNavigate("bookings")}
            className="flex items-center justify-between rounded-2xl bg-[#FBF9F5] border border-[#E8E2D2] p-3 text-left hover:border-[#C59B27] transition"
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#767471]">
                Active Bookings
              </div>
              <div className="text-lg font-bold text-[#1A1A1A]">
                {activeBookingsCount}
              </div>
            </div>
            <Calendar className="h-5 w-5 text-[#C59B27]" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate("saved")}
            className="flex items-center justify-between rounded-2xl bg-[#FBF9F5] border border-[#E8E2D2] p-3 text-left hover:border-[#C59B27] transition"
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#767471]">
                Saved Artists
              </div>
              <div className="text-lg font-bold text-[#1A1A1A]">
                {savedPhotographerIds.length}
              </div>
            </div>
            <Heart className="h-5 w-5 text-rose-500" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className="col-span-2 sm:col-span-1 flex items-center justify-between rounded-2xl bg-[#1A1A1A] text-white p-3 text-left hover:bg-[#333] transition shadow-xs"
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#C59B27]">
                Explore Catalog
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                Find Photographers
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-[#C59B27]" />
          </button>
        </div>
      </div>

      {/* Edit Profile Form Card */}
      <div className="rounded-3xl border border-[#D9D2C2] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className=" text-xl font-bold text-[#1A1A1A]">
              Manage Profile Information
            </h2>
            <p className="text-xs text-[#767471] mt-0.5">
              Keep your contact information current for seamless photographer
              coordination.
            </p>
          </div>
          {savedSuccess && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 animate-in fade-in">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Saved Successfully</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-[#767471]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-10 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#767471]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-10 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-[#767471]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98250 12345"
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-10 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                City / Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-[#767471]" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Ahmedabad, Mumbai, Jaipur"
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-10 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 px-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-[#1A1A1A] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#333] transition"
            >
              <Save className="h-4 w-4 text-[#C59B27]" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
