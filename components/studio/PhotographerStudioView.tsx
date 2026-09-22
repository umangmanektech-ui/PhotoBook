"use client";

import { useApp } from "@/lib/store/app-context";
import { Booking } from "@/lib/types";
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useState } from "react";

interface PhotographerStudioViewProps {
  initialTab?:
    | "requests"
    | "packages"
    | "portfolio"
    | "calendar"
    | "deliveries"
    | "profile";
  onNavigate?: (tab: string, param?: string) => void;
}

export function PhotographerStudioView({
  initialTab = "requests",
  onNavigate,
}: PhotographerStudioViewProps) {
  const {
    currentUser,
    photographers,
    bookings,
    updateBookingStatus,
    packages,
    createPackage,
    deletePackage,
    portfolioItems,
    addPortfolioItem,
    deletePortfolioItem,
    blockedDates,
    toggleDateBlock,
    updatePhotographerProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | "requests"
    | "packages"
    | "portfolio"
    | "calendar"
    | "deliveries"
    | "profile"
  >(initialTab);

  // Photographer profile record
  const currentPhotographer =
    photographers.find((p) => p.id === currentUser.id) || photographers[0];

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    business_name: currentPhotographer?.business_name || "",
    bio: currentPhotographer?.bio || "",
    city: currentPhotographer?.city || "",
    state: currentPhotographer?.state || "",
    starting_price: currentPhotographer?.starting_price || 25000,
    experience_years: currentPhotographer?.experience_years || 8,
    gear: currentPhotographer?.gear?.join(", ") || "",
    honors: currentPhotographer?.honors?.join("\n") || "",
    languages: currentPhotographer?.languages?.join(", ") || "",
    categories: currentPhotographer?.categories?.join(", ") || "",
    hero_images: currentPhotographer?.hero_images?.join("\n") || "",
  });
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);

  // New package modal form state
  const [showNewPackageModal, setShowNewPackageModal] = useState(false);
  const [newPkgName, setNewPkgName] = useState("");
  const [newPkgTagline, setNewPkgTagline] = useState("");
  const [newPkgPrice, setNewPkgPrice] = useState(25000);
  const [newPkgHours, setNewPkgHours] = useState(6);
  const [newPkgTurnaround, setNewPkgTurnaround] = useState(7);
  const [newPkgDeliverables, setNewPkgDeliverables] = useState(
    "300 Color-Graded High-Res Stills\nOnline Private Gallery Access\n1 Premium Hardcover Coffee Table Album\nDrone Aerial Cinematography",
  );

  // New portfolio item modal form state
  const [showNewPortfolioModal, setShowNewPortfolioModal] = useState(false);
  const [newPortTitle, setNewPortTitle] = useState("");
  const [newPortCategory, setNewPortCategory] = useState("Wedding");
  const [newPortUrl, setNewPortUrl] = useState(
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  );
  const [newPortCaption, setNewPortCaption] = useState(
    "Golden hour sunset couple portraits",
  );

  // Gallery Delivery Modal
  const [deliveryModalBooking, setDeliveryModalBooking] =
    useState<Booking | null>(null);
  const [deliveryPhotoCount, setDeliveryPhotoCount] = useState(350);
  const [deliveryPin, setDeliveryPin] = useState("PB-8890");

  // Relevant bookings for studio
  const studioBookings = bookings.filter(
    (b) =>
      b.photographer_id === currentPhotographer?.id ||
      b.photographer_id === currentUser.id,
  );
  const pendingRequests = studioBookings.filter((b) => b.status === "pending");
  const confirmedBookings = studioBookings.filter(
    (b) => b.status === "confirmed",
  );
  const deliveredBookings = studioBookings.filter(
    (b) => b.status === "delivered",
  );

  // My packages
  const myPackages = packages.filter(
    (p) =>
      p.photographer_id === currentPhotographer?.id ||
      p.photographer_id === currentUser.id,
  );

  // My portfolio
  const myPortfolio = portfolioItems.filter(
    (p) =>
      p.photographer_id === currentPhotographer?.id ||
      p.photographer_id === currentUser.id,
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPhotographer) return;
    updatePhotographerProfile(currentPhotographer.id, {
      business_name: profileForm.business_name,
      bio: profileForm.bio,
      city: profileForm.city,
      state: profileForm.state,
      starting_price: Number(profileForm.starting_price),
      experience_years: Number(profileForm.experience_years),
      gear: profileForm.gear
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      honors: profileForm.honors
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      languages: profileForm.languages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      categories: profileForm.categories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      hero_images: profileForm.hero_images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setProfileSavedSuccess(true);
    setTimeout(() => setProfileSavedSuccess(false), 3000);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    createPackage({
      name: newPkgName,
      tagline: newPkgTagline,
      price: Number(newPkgPrice),
      duration_hours: Number(newPkgHours),
      turnaround_days: Number(newPkgTurnaround),
      deliverables: newPkgDeliverables.split("\n").filter((d) => d.trim()),
      is_popular: false,
      is_active: true,
    });
    setShowNewPackageModal(false);
    setNewPkgName("");
    setNewPkgTagline("");
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    addPortfolioItem({
      title: newPortTitle,
      category: newPortCategory,
      image_url: newPortUrl,
      caption: newPortCaption,
    });
    setShowNewPortfolioModal(false);
    setNewPortTitle("");
  };

  const handleConfirmDelivery = () => {
    if (!deliveryModalBooking) return;
    updateBookingStatus(deliveryModalBooking.id, "delivered");
    setDeliveryModalBooking(null);
  };

  // Studio Calendar Month Navigation State
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [studioCalYear, setStudioCalYear] = useState<number>(2026);
  const [studioCalMonth, setStudioCalMonth] = useState<number>(8); // September (0-indexed)

  const studioMonthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date(studioCalYear, studioCalMonth, 1));
  const daysInStudioMonth = new Date(
    studioCalYear,
    studioCalMonth + 1,
    0,
  ).getDate();
  const firstDayStudioWeekday = new Date(
    studioCalYear,
    studioCalMonth,
    1,
  ).getDay();

  const handleStudioPrevMonth = () => {
    if (studioCalMonth === 0) {
      setStudioCalMonth(11);
      setStudioCalYear((y) => y - 1);
    } else {
      setStudioCalMonth((m) => m - 1);
    }
  };

  const handleStudioNextMonth = () => {
    if (studioCalMonth === 11) {
      setStudioCalMonth(0);
      setStudioCalYear((y) => y + 1);
    } else {
      setStudioCalMonth((m) => m + 1);
    }
  };

  // Calendar dates for blocking & bookings
  const studioDays = Array.from({ length: daysInStudioMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${studioCalYear}-${String(studioCalMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isBlocked = blockedDates.includes(dateStr);
    const hasBooking = studioBookings.some(
      (b) =>
        b.event_date === dateStr &&
        (b.status === "confirmed" || b.status === "pending"),
    );
    const isPast = dateStr < todayStr;
    return { day, date: dateStr, isBlocked, hasBooking, isPast };
  });

  return (
    <div className="min-h-screen pb-24 text-[#1A1A1A]">
      {/* Studio Header */}
      <div className="border-b border-[#E8E2D2] bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
                <Sparkles className="h-3 w-3" />
                Photographer Studio Portal
              </div>
              <h1 className="mt-2  text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
                {currentPhotographer?.business_name || "My Photography Studio"}
              </h1>
              <p className="mt-1 text-xs text-[#767471]">
                Manage booking requests, update portfolio works, configure
                collections, and maintain profile details.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2 text-xs font-semibold text-[#1A1A1A]">
                Status:{" "}
                <strong className="text-[#2D6A4F]">
                  Accepting Reservations
                </strong>
              </span>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-4 border-t border-[#F0ECE1]">
            <div className="rounded-2xl border border-[#E8E2D2] bg-[#FBF9F5] p-4">
              <div className="text-[10px] uppercase font-bold text-[#767471]">
                Pipeline Value
              </div>
              <div className="mt-1  text-xl font-bold text-[#1A1A1A]">
                ₹
                {studioBookings
                  .reduce((acc, b) => acc + b.total_price, 0)
                  .toLocaleString("en-IN")}
              </div>
              <div className="text-[10px] text-[#767471] mt-0.5">
                {studioBookings.length} total client inquiries
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8E2D2] bg-[#FBF9F5] p-4">
              <div className="text-[10px] uppercase font-bold text-[#767471]">
                Pending Review
              </div>
              <div className="mt-1  text-xl font-bold text-[#997316]">
                {pendingRequests.length} Requests
              </div>
              <div className="text-[10px] text-[#767471] mt-0.5">
                Awaiting your response
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8E2D2] bg-[#FBF9F5] p-4">
              <div className="text-[10px] uppercase font-bold text-[#767471]">
                Confirmed Shoots
              </div>
              <div className="mt-1  text-xl font-bold text-[#2D6A4F]">
                {confirmedBookings.length} Scheduled
              </div>
              <div className="text-[10px] text-[#767471] mt-0.5">
                Session passes issued
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8E2D2] bg-[#FBF9F5] p-4">
              <div className="text-[10px] uppercase font-bold text-[#767471]">
                Artist Rating
              </div>
              <div className="mt-1  text-xl font-bold text-[#1A1A1A] flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#C59B27] text-[#C59B27]" />
                {currentPhotographer?.rating.toFixed(1) || "4.9"} / 5.0
              </div>
              <div className="text-[10px] text-[#767471] mt-0.5">
                {currentPhotographer?.review_count || 120} Client reviews
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="mt-6 flex gap-2 overflow-x-auto border-t border-[#F0ECE1] pt-4 scrollbar-none">
            {[
              {
                id: "requests",
                label: `Inquiries & Requests (${pendingRequests.length})`,
              },
              {
                id: "portfolio",
                label: `Manage Portfolio (${myPortfolio.length})`,
              },
              { id: "profile", label: "Studio Profile & Bio" },
              {
                id: "packages",
                label: `Pricing & Packages (${myPackages.length})`,
              },
              { id: "calendar", label: "Availability Calendar" },
              {
                id: "deliveries",
                label: `Delivered Galleries (${deliveredBookings.length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#1A1A1A] text-white shadow-xs"
                    : "bg-[#F0ECE1] text-[#767471] hover:text-[#1A1A1A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio View Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TAB 1: Inquiries & Commission Requests */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className=" text-xl font-bold text-[#1A1A1A]">
                  Manage Booking Requests
                </h2>
                <p className="text-xs text-[#767471]">
                  Accept or decline incoming client reservations. Confirming
                  locks the dates and creates a verified session pass.
                </p>
              </div>
            </div>

            {studioBookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#D9D2C2] bg-white p-12 text-center text-xs text-[#767471]">
                No booking requests found.
              </div>
            ) : (
              <div className="space-y-4">
                {studioBookings.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-3xl border border-[#E8E2D2] bg-white p-6 shadow-xs transition hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#F0ECE1]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#C59B27]">
                            {req.booking_code}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                              req.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : req.status === "confirmed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : req.status === "delivered"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <h3 className=" text-lg font-bold text-[#1A1A1A] mt-1">
                          {req.customer_name} • {req.event_type}
                        </h3>
                        <p className="text-xs text-[#767471]">
                          {req.package_name}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className=" text-xl font-bold text-[#1A1A1A]">
                          ₹{req.total_price.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-[#767471]">
                          {req.duration_hours}h duration
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#52504E]">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#C59B27]" />
                        <span>
                          {req.event_date} ({req.event_time_start} -{" "}
                          {req.event_time_end})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <MapPin className="h-4 w-4 text-[#C59B27]" />
                        <span className="truncate">
                          {req.venue_name}, {req.venue_address}
                        </span>
                      </div>
                    </div>

                    {req.creative_notes && (
                      <div className="mt-3 rounded-xl bg-[#FBF9F5] p-3 text-xs text-[#52504E] border border-[#E8E2D2]">
                        <strong className="text-[#1A1A1A] block mb-0.5">
                          Client Creative Vision:
                        </strong>
                        &ldquo;{req.creative_notes}&rdquo;
                      </div>
                    )}

                    {/* Actions Row */}
                    <div className="mt-4 pt-4 border-t border-[#F0ECE1] flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-[#767471]">
                        Client Contact:{" "}
                        <strong>
                          {req.customer_email || "client@photobook.in"}
                        </strong>
                      </div>

                      {req.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            id={`decline-booking-${req.id}`}
                            onClick={() =>
                              updateBookingStatus(req.id, "rejected")
                            }
                            className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                          >
                            Decline Request
                          </button>
                          <button
                            id={`confirm-booking-${req.id}`}
                            onClick={() =>
                              updateBookingStatus(req.id, "confirmed")
                            }
                            className="flex items-center gap-1.5 rounded-xl bg-[#2D6A4F] px-5 py-2 text-xs font-bold text-white hover:bg-[#24533e] transition shadow-xs"
                          >
                            <Check className="h-4 w-4" />
                            <span>Accept & Confirm Date</span>
                          </button>
                        </div>
                      )}

                      {req.status === "confirmed" && (
                        <div className="flex items-center gap-2">
                          <button
                            id={`deliver-gallery-${req.id}`}
                            onClick={() => setDeliveryModalBooking(req)}
                            className="flex items-center gap-1.5 rounded-xl bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#333] transition"
                          >
                            <Upload className="h-4 w-4 text-[#C59B27]" />
                            <span>Deliver Client Gallery</span>
                          </button>
                        </div>
                      )}

                      {req.status === "delivered" && (
                        <span className="text-xs text-[#2D6A4F] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Master Gallery
                          Delivered (PIN:{" "}
                          {req.delivered_gallery_pin || "PB-7892"})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Portfolio Catalog Manager */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className=" text-xl font-bold text-[#1A1A1A]">
                  Manage Portfolio & Selected Works
                </h2>
                <p className="text-xs text-[#767471]">
                  Add your best photos, showcase specific genres, and curate
                  your client catalog.
                </p>
              </div>
              <button
                id="add-portfolio-photo-btn"
                onClick={() => setShowNewPortfolioModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-[#FBF9F5] hover:bg-[#333] transition"
              >
                <Plus className="h-4 w-4 text-[#C59B27]" />
                <span>Add Portfolio Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {myPortfolio.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-[#E8E2D2] bg-white shadow-xs"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button
                        onClick={() => deletePortfolioItem(item.id)}
                        className="rounded-full bg-white p-2 text-red-600 shadow-md hover:bg-red-50"
                        title="Delete photo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#C59B27]">
                      {item.category}
                    </div>
                    <div className=" text-xs font-bold text-[#1A1A1A] truncate">
                      {item.title}
                    </div>
                    {item.caption && (
                      <p className="text-[10px] text-[#767471] truncate">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Studio Profile & Bio Editor */}
        {activeTab === "profile" && (
          <div className="rounded-3xl border border-[#D9D2C2] bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-[#F0ECE1] pb-4 mb-6">
              <h2 className=" text-xl font-bold text-[#1A1A1A]">
                Edit Studio Profile & Details
              </h2>
              <p className="text-xs text-[#767471]">
                Update your public profile, business branding, experience, gear
                list, and awards.
              </p>
            </div>

            {profileSavedSuccess && (
              <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Studio Profile successfully updated and saved!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Business / Atelier Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.business_name}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        business_name: e.target.value,
                      })
                    }
                    required
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Base City
                  </label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, city: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, state: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Starting Session Price (₹)
                  </label>
                  <input
                    type="number"
                    value={profileForm.starting_price}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        starting_price: Number(e.target.value),
                      })
                    }
                    required
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={profileForm.experience_years}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        experience_years: Number(e.target.value),
                      })
                    }
                    required
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Artist Biography / Studio Philosophy
                </label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Specialty Categories (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={profileForm.categories}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        categories: e.target.value,
                      })
                    }
                    placeholder="Wedding, Pre-Wedding, Portrait, Event"
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Spoken Languages (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={profileForm.languages}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        languages: e.target.value,
                      })
                    }
                    placeholder="English, Hindi, Gujarati"
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Camera Gear & Lenses (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={profileForm.gear}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, gear: e.target.value })
                    }
                    placeholder="Sony A7R V, 85mm f/1.2 GM, 24-70mm GM II, Profoto B10X"
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Showcase Cover Image URLs (one per line)
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.hero_images}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        hero_images: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Recognitions & Honors (one per line)
                </label>
                <textarea
                  rows={3}
                  value={profileForm.honors}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, honors: e.target.value })
                  }
                  placeholder="Vogue Wedding Photography Award 2024&#10;Fearless Photographers Collection Top 10"
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#F0ECE1] flex justify-end">
                <button
                  type="submit"
                  id="save-studio-profile-btn"
                  className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#333] transition shadow-xs"
                >
                  <Save className="h-4 w-4 text-[#C59B27]" />
                  <span>Save Studio Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: Collections & Package Management */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className=" text-xl font-bold text-[#1A1A1A]">
                  Pricing & Deliverable Tiers
                </h2>
                <p className="text-xs text-[#767471]">
                  Configure your transparent fixed price packages with clear
                  turnaround times and deliverables.
                </p>
              </div>
              <button
                id="add-new-package-btn"
                onClick={() => setShowNewPackageModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-[#FBF9F5] hover:bg-[#333] transition"
              >
                <Plus className="h-4 w-4 text-[#C59B27]" />
                <span>New Tier</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-3xl border border-[#E8E2D2] bg-white p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className=" text-lg font-bold text-[#1A1A1A]">
                        {pkg.name}
                      </h3>
                      {pkg.is_popular && (
                        <span className="rounded-full bg-[#C59B27]/15 px-2 py-0.5 text-[9px] font-bold text-[#997316]">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#767471] mt-0.5">
                      {pkg.tagline}
                    </p>

                    <div className="mt-4  text-2xl font-bold text-[#1A1A1A]">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </div>
                    <div className="text-xs text-[#52504E] mt-0.5">
                      {pkg.duration_hours} Hours Coverage •{" "}
                      {pkg.turnaround_days}-day delivery
                    </div>

                    <div className="mt-4 space-y-1.5 border-t border-[#F0ECE1] pt-4">
                      {pkg.deliverables.map((d, i) => (
                        <div
                          key={i}
                          className="text-xs text-[#52504E] flex items-center gap-1.5"
                        >
                          <Check className="h-3.5 w-3.5 text-[#2D6A4F]" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F0ECE1] flex justify-end">
                    <button
                      onClick={() => {
                        if (confirm("Delete this package tier?"))
                          deletePackage(pkg.id);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove Tier</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Availability Diary & Calendar Block */}
        {activeTab === "calendar" && (
          <div className="rounded-3xl border border-[#D9D2C2] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className=" text-xl font-bold text-[#1A1A1A]">
                  {studioMonthName} {studioCalYear} Availability Diary
                </h2>
                <p className="text-xs text-[#767471]">
                  Click on any open date to toggle between Available for
                  Bookings and Blocked / Personal Shooting.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2 border border-[#E8E2D2] rounded-xl p-1 bg-[#FBF9F5]">
                  <button
                    type="button"
                    onClick={handleStudioPrevMonth}
                    className="rounded-lg p-1.5 text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-semibold px-2 min-w-28 text-center text-[#1A1A1A]">
                    {studioMonthName} {studioCalYear}
                  </span>
                  <button
                    type="button"
                    onClick={handleStudioNextMonth}
                    className="rounded-lg p-1.5 text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#FBF9F5] border border-[#D9D2C2]" />
                    <span>Open</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-100 border border-red-300" />
                    <span>Blocked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#2D6A4F]" />
                    <span>Shoot</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="py-1 text-[11px] font-bold text-[#767471] uppercase"
                >
                  {d}
                </div>
              ))}

              {/* Offset empty slots */}
              {Array.from({ length: firstDayStudioWeekday }).map((_, i) => (
                <div key={`studio-empty-${i}`} className="h-14" />
              ))}

              {studioDays.map((cal) => (
                <button
                  key={cal.date}
                  type="button"
                  disabled={cal.isPast}
                  onClick={() => toggleDateBlock(cal.date)}
                  className={`flex h-14 flex-col items-center justify-center rounded-xl border text-xs font-semibold transition ${
                    cal.isPast
                      ? "bg-[#F5F2EA]/60 text-[#B0ADA8] border-transparent cursor-not-allowed opacity-60"
                      : cal.hasBooking
                        ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                        : cal.isBlocked
                          ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          : "bg-[#FBF9F5] text-[#1A1A1A] border-[#E8E2D2] hover:border-[#C59B27]"
                  }`}
                  title={
                    cal.isPast
                      ? "Past date"
                      : cal.hasBooking
                        ? "Confirmed client shoot"
                        : cal.isBlocked
                          ? "Blocked off"
                          : "Open for bookings"
                  }
                >
                  <span className="text-sm font-bold">{cal.day}</span>
                  <span className="text-[9px] mt-0.5">
                    {cal.isPast
                      ? "Past"
                      : cal.hasBooking
                        ? "Booked"
                        : cal.isBlocked
                          ? "Blocked"
                          : "Open"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Gallery Vaults */}
        {activeTab === "deliveries" && (
          <div className="space-y-6">
            <div>
              <h2 className=" text-xl font-bold text-[#1A1A1A]">
                Delivered Client Gallery Vaults
              </h2>
              <p className="text-xs text-[#767471]">
                View delivered client archives, generated security PINs, and
                photo download logs.
              </p>
            </div>

            {deliveredBookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#D9D2C2] bg-white p-12 text-center text-xs text-[#767471]">
                No galleries delivered yet. Complete and deliver galleries from
                your Inquiries tab.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliveredBookings.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-2xl border border-[#E8E2D2] bg-white p-5 shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className=" text-base font-bold text-[#1A1A1A]">
                          {d.customer_name}
                        </h4>
                        <p className="text-xs text-[#767471]">
                          {d.package_name}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#C59B27] bg-[#F0ECE1] px-2 py-0.5 rounded">
                        PIN: {d.delivered_gallery_pin || "PB-8890"}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-[#52504E]">
                      Event Date: {d.event_date} •{" "}
                      {d.delivered_photos_count || 320} Master Photos Available
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: New Package Tier */}
      {showNewPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-[#D9D2C2] bg-white p-6 shadow-2xl">
            <h3 className=" text-lg font-bold text-[#1A1A1A] pb-3 border-b border-[#F0ECE1]">
              Create Pricing Collection Tier
            </h3>

            <form
              onSubmit={handleCreatePackage}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-[#1A1A1A] mb-1">
                  Tier Name
                </label>
                <input
                  type="text"
                  value={newPkgName}
                  onChange={(e) => setNewPkgName(e.target.value)}
                  placeholder="e.g. Royal Heritage Wedding Collection"
                  required
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1A1A] mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={newPkgTagline}
                  onChange={(e) => setNewPkgTagline(e.target.value)}
                  placeholder="Full multi-day luxury coverage with heirloom album"
                  required
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">
                    Coverage (Hours)
                  </label>
                  <input
                    type="number"
                    value={newPkgHours}
                    onChange={(e) => setNewPkgHours(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">
                    Turnaround (Days)
                  </label>
                  <input
                    type="number"
                    value={newPkgTurnaround}
                    onChange={(e) =>
                      setNewPkgTurnaround(Number(e.target.value))
                    }
                    required
                    className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A1A1A] mb-1">
                  Deliverables (one per line)
                </label>
                <textarea
                  rows={3}
                  value={newPkgDeliverables}
                  onChange={(e) => setNewPkgDeliverables(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#F0ECE1]">
                <button
                  type="button"
                  onClick={() => setShowNewPackageModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-[#767471] hover:bg-[#F0ECE1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1A1A1A] px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Portfolio Item */}
      {showNewPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#D9D2C2] bg-white p-6 shadow-2xl">
            <h3 className=" text-lg font-bold text-[#1A1A1A] pb-3 border-b border-[#F0ECE1]">
              Add Portfolio Frame
            </h3>

            <form
              onSubmit={handleAddPortfolio}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-[#1A1A1A] mb-1">
                  Frame Title
                </label>
                <input
                  type="text"
                  value={newPortTitle}
                  onChange={(e) => setNewPortTitle(e.target.value)}
                  placeholder="e.g. Royal Palace Jodhpur Vows"
                  required
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1A1A] mb-1">
                  Category
                </label>
                <select
                  value={newPortCategory}
                  onChange={(e) => setNewPortCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Pre-Wedding">Pre-Wedding</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Event">Event</option>
                  <option value="Fashion & Editorial">
                    Fashion & Editorial
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1A1A1A] mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newPortUrl}
                  onChange={(e) => setNewPortUrl(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1A1A] mb-1">
                  Caption / Story Note
                </label>
                <input
                  type="text"
                  value={newPortCaption}
                  onChange={(e) => setNewPortCaption(e.target.value)}
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#F0ECE1]">
                <button
                  type="button"
                  onClick={() => setShowNewPortfolioModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-[#767471] hover:bg-[#F0ECE1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1A1A1A] px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Add to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Deliver Gallery */}
      {deliveryModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#D9D2C2] bg-white p-6 shadow-2xl">
            <h3 className=" text-lg font-bold text-[#1A1A1A] pb-3 border-b border-[#F0ECE1]">
              Deliver Client Gallery
            </h3>
            <p className="mt-2 text-xs text-[#767471]">
              Issue the encrypted private gallery link and access PIN for{" "}
              <strong>{deliveryModalBooking.customer_name}</strong>.
            </p>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A1A1A] mb-1">
                  Delivered Master Photos Count
                </label>
                <input
                  type="number"
                  value={deliveryPhotoCount}
                  onChange={(e) =>
                    setDeliveryPhotoCount(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1A1A] mb-1">
                  Client Security PIN
                </label>
                <input
                  type="text"
                  value={deliveryPin}
                  onChange={(e) => setDeliveryPin(e.target.value)}
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs font-mono font-bold text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-[#F0ECE1] pt-4">
              <button
                type="button"
                onClick={() => setDeliveryModalBooking(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#767471] hover:bg-[#F0ECE1]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelivery}
                className="rounded-xl bg-[#2D6A4F] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#24533e]"
              >
                Deliver Gallery Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
