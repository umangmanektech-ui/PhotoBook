"use client";

import { useApp } from "@/lib/store/app-context";
import {
  ArrowLeft,
  Award,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  MapPin,
  Maximize2,
  MessageSquare,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface PhotographerDetailViewProps {
  photographerId: string;
  onBack: () => void;
  onSelectPackageToBook: (packageId: string, date?: string) => void;
  onOpenChat: (bookingId?: string) => void;
}

export function PhotographerDetailView({
  photographerId,
  onBack,
  onSelectPackageToBook,
  onOpenChat,
}: PhotographerDetailViewProps) {
  const {
    photographers,
    packages,
    portfolioItems,
    reviews,
    isPhotographerSaved,
    toggleSavePhotographer,
    checkAvailability,
  } = useApp();

  const photographer =
    photographers.find((p) => p.id === photographerId) || photographers[0];
  const photogPackages = packages.filter(
    (p) => p.photographer_id === photographer?.id,
  );
  const photogPortfolio = portfolioItems.filter(
    (p) =>
      p.photographer_id === photographer?.id ||
      p.photographer_id === "user-photographer-arjun",
  );
  const photogReviews = reviews.filter(
    (r) =>
      r.photographer_id === photographer?.id ||
      r.photographer_id === "user-photographer-arjun",
  );

  const [activeWorksTab, setActiveWorksTab] = useState<string>("All Frames");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Dynamic Calendar Navigation State (Default to September 2026 or current date)
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Default to 2026, Sept (month 8, 0-indexed)
  const [calYear, setCalYear] = useState<number>(2026);
  const [calMonth, setCalMonth] = useState<number>(8);

  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>();

  // Dynamic portfolio categories
  const portfolioCategories = useMemo(() => {
    const cats = new Set<string>();
    photogPortfolio.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return ["All Frames", ...Array.from(cats)];
  }, [photogPortfolio]);

  // Filtered portfolio works
  const filteredWorks = photogPortfolio.filter((item) => {
    if (activeWorksTab === "All Frames") return true;
    return item.category.toLowerCase().includes(activeWorksTab.toLowerCase());
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${photographer?.business_name} on PhotoBook`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Generate dynamic days for selected month
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(calYear, calMonth, 1),
  );
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(calYear, calMonth, 1).getDay(); // 0 = Sun

  const calendarDays = useMemo(() => {
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const avail = checkAvailability(photographer?.id || "", dateStr);
      const isPast = dateStr < todayStr;
      days.push({
        day,
        date: dateStr,
        isAvailable: avail.isAvailable && !isPast,
        isPast,
        reason: isPast ? "Past date" : avail.reason,
      });
    }
    return days;
  }, [
    calYear,
    calMonth,
    daysInMonth,
    checkAvailability,
    photographer?.id,
    todayStr,
  ]);

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  if (!photographer) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center">
        <h2 className=" text-xl font-bold">Photographer Profile Unavailable</h2>
        <button
          onClick={onBack}
          className="mt-4 rounded-xl bg-[#1A1A1A] px-4 py-2 text-xs text-white"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40 sm:pb-32 text-[#1A1A1A]">
      {/* Top Nav Bar */}
      <div className="sticky top-16 z-30 flex items-center justify-between border-b border-[#E8E2D2] bg-[#FBF9F5]/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#767471]">
            <span>/</span>
            <span>{photographer.city}</span>
            <span>/</span>
            <span className="font-semibold text-[#1A1A1A]">
              {photographer.business_name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#D9D2C2] bg-white text-[#767471] hover:text-[#1A1A1A] transition"
            aria-label="Share profile"
          >
            <Share2 className="h-3.5 w-3.5" />
            {copiedShare && (
              <span className="absolute -bottom-7 right-0 rounded-md bg-[#1A1A1A] px-2 py-0.5 text-[9px] text-white">
                Copied!
              </span>
            )}
          </button>
          <button
            onClick={() => toggleSavePhotographer(photographer.id)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D9D2C2] bg-white text-[#767471] hover:text-red-500 transition"
            aria-label="Favorite artist"
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                isPhotographerSaved(photographer.id)
                  ? "fill-red-500 text-red-500"
                  : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Hero Section matching Image 6 */}
        <div className="overflow-hidden rounded-3xl border border-[#D9D2C2] bg-white shadow-xl">
          {/* Main Hero Photo Spread */}
          <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-zinc-900">
            <img
              src={photographer.hero_images[0]}
              alt={photographer.business_name}
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute top-4 right-4 flex gap-2">
              <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white">
                Live Diary • {photographer.city} Base
              </span>
            </div>

            {/* Floating details banner */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={
                      photographer.hero_images[1] || photographer.hero_images[0]
                    }
                    alt={photographer.business_name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-2 ring-[#C59B27] shadow-xl"
                  />
                  <span className="absolute -bottom-2 -right-1 rounded-full bg-[#1A1A1A] border border-[#C59B27] px-2 py-0.5 text-[9px] font-bold text-[#C59B27]">
                    PRO
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className=" text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {photographer.business_name}
                    </h1>
                    {photographer.is_verified && (
                      <span title="Verified Atelier">
                        <ShieldCheck className="h-5 w-5 text-[#C59B27]" />
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#F0ECE1]">
                    <MapPin className="h-3.5 w-3.5 text-[#C59B27]" />
                    {photographer.city}, {photographer.state} •{" "}
                    {photographer.experience_years} years experience •{" "}
                    {photographer.shoots_completed}+ shoots completed
                  </p>
                </div>
              </div>

              {/* Action Buttons: Book Session & Message */}
              <div className="flex items-center gap-2.5">
                <button
                  id="profile-direct-message-btn"
                  onClick={() => onOpenChat()}
                  className="flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/20 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/30 transition"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Message</span>
                </button>
                <button
                  id="profile-direct-book-btn"
                  onClick={() => {
                    const firstPkg = photogPackages[0];
                    if (firstPkg)
                      onSelectPackageToBook(firstPkg.id, selectedCalendarDate);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-[#C59B27] px-5 py-2.5 text-xs font-semibold text-[#1A1A1A] shadow-md hover:bg-[#D4AF37] transition active:scale-98"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Session</span>
                </button>
              </div>
            </div>
          </div>

          {/* Artist Bio & Technical Specifications */}
          <div className="p-6 sm:p-8">
            <blockquote className="border-l-2 border-[#C59B27] pl-4  text-sm sm:text-base italic leading-relaxed text-[#1A1A1A]">
              &ldquo;{photographer.bio}&rdquo;
            </blockquote>

            {/* Spec Pills Row matching Image 6 */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-[#F0ECE1] pt-6">
              <div className="rounded-xl border border-[#E8E2D2] bg-[#FBF9F5] p-3.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#767471] mb-1.5 flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-[#C59B27]" />
                  Master Gear
                </div>
                <div className="space-y-0.5 text-xs font-medium text-[#1A1A1A]">
                  {photographer.gear.slice(0, 3).map((g, i) => (
                    <div key={i}>• {g}</div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#E8E2D2] bg-[#FBF9F5] p-3.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#767471] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#C59B27]" />
                  Spoken Languages
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {photographer.languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-md bg-white border border-[#E8E2D2] px-2 py-0.5 text-[11px] text-[#52504E]"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#E8E2D2] bg-[#FBF9F5] p-3.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#767471] mb-1.5 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-[#C59B27]" />
                  Recognitions & Honors
                </div>
                <div className="space-y-0.5 text-xs font-medium text-[#1A1A1A]">
                  {photographer.honors.map((h, i) => (
                    <div key={i}>• {h}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CURATED CATALOG: Selected Works (Tabs & Masonry Grid) */}
        <section className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
                Curated Catalog
              </div>
              <h2 className=" text-2xl font-bold text-[#1A1A1A]">
                Selected Works ({photogPortfolio.length} Frames)
              </h2>
            </div>

            {/* Dynamic Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {portfolioCategories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveWorksTab(tab)}
                  className={`rounded-full px-3.5 py-1 text-xs font-medium transition whitespace-nowrap ${
                    activeWorksTab === tab
                      ? "bg-[#1A1A1A] text-white shadow-xs"
                      : "bg-white border border-[#E8E2D2] text-[#767471] hover:border-[#C59B27]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Masonry Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorks.map((work) => (
              <div
                key={work.id}
                onClick={() => setLightboxImage(work.image_url)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E8E2D2] bg-white shadow-xs transition hover:shadow-md hover:border-[#C59B27]"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <img
                    src={work.image_url}
                    alt={work.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition" />

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="rounded-full bg-[#C59B27]/20 border border-[#C59B27]/40 px-2 py-0.5 text-[9px] font-semibold text-[#F4E8C1] uppercase tracking-wider">
                      {work.category}
                    </span>
                    <h3 className="mt-1  text-sm font-bold leading-tight">
                      {work.title}
                    </h3>
                    {work.caption && (
                      <p className="mt-0.5 text-[11px] text-[#F0ECE1]/80 line-clamp-1">
                        {work.caption}
                      </p>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LIVE DIARY: Interactive Availability Calendar (Moved above Price Tiers) */}
        <section className="mt-16 rounded-3xl border border-[#D9D2C2] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
                Live Diary
              </div>
              <h2 className=" text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                {monthName} {calYear} Availability
              </h2>
              <p className="text-xs text-[#767471]">
                Select a date to check availability and book directly
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 border border-[#E8E2D2] rounded-xl p-1 bg-[#FBF9F5]">
                <button
                  onClick={handlePrevMonth}
                  className="rounded-lg p-1.5 text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-semibold px-2 min-w-28 text-center text-[#1A1A1A]">
                  {monthName} {calYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="rounded-lg p-1.5 text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full border border-[#D9D2C2] bg-[#FBF9F5]" />
                  <span className="text-[#52504E]">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#E8E2D2]" />
                  <span className="text-[#767471]">Booked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#C59B27]" />
                  <span className="text-[#1A1A1A] font-semibold">Selected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (weekday) => (
                <div
                  key={weekday}
                  className="py-1 text-[11px] font-bold uppercase tracking-wider text-[#767471]"
                >
                  {weekday}
                </div>
              ),
            )}

            {/* Empty slots before first day */}
            {Array.from({ length: firstDayWeekday }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12" />
            ))}

            {calendarDays.map((cal) => {
              const isSelected = selectedCalendarDate === cal.date;
              const isBooked = !cal.isAvailable && !cal.isPast;
              const isPast = cal.isPast;

              return (
                <button
                  key={cal.date}
                  type="button"
                  disabled={isBooked || isPast}
                  onClick={() => setSelectedCalendarDate(cal.date)}
                  className={`flex h-12 flex-col items-center justify-center rounded-xl border text-xs font-semibold transition ${
                    isSelected
                      ? "border-[#C59B27] bg-[#C59B27] text-white shadow-sm ring-2 ring-[#C59B27]/40"
                      : isPast
                        ? "cursor-not-allowed border-transparent bg-[#F5F2EA]/60 text-[#B0ADA8] opacity-60"
                        : isBooked
                          ? "cursor-not-allowed border-transparent bg-[#F0ECE1]/70 text-[#A6A4A0] line-through"
                          : "border-[#E8E2D2] bg-[#FBF9F5] text-[#1A1A1A] hover:border-[#C59B27]"
                  }`}
                  title={
                    isPast
                      ? "Past date"
                      : isBooked
                        ? cal.reason || "Not available"
                        : "Available for booking"
                  }
                >
                  <span>{cal.day}</span>
                  <span className="text-[8px] font-normal opacity-80">
                    {isPast
                      ? "Past"
                      : isBooked
                        ? "Booked"
                        : isSelected
                          ? "Choice"
                          : "Free"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-[#F0ECE1]/50 p-3.5 text-xs text-[#52504E]">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-[#C59B27] shrink-0" />
              <span>
                Selected date:{" "}
                <strong className="text-[#1A1A1A]">
                  {selectedCalendarDate}
                </strong>{" "}
                is open for reservation.
              </span>
            </div>
            <button
              onClick={() => {
                const firstPkg = photogPackages[0];
                if (firstPkg)
                  onSelectPackageToBook(firstPkg.id, selectedCalendarDate);
              }}
              className="rounded-lg bg-[#1A1A1A] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#333] transition self-end sm:self-auto"
            >
              Book for {selectedCalendarDate}
            </button>
          </div>
        </section>

        {/* TRANSPARENT PRICING: Curated Collections matching Image 6 */}
        <section className="mt-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
              Transparent Pricing
            </span>
            <h2 className="mt-1  text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Curated Collections
            </h2>
            <p className="mt-1.5 text-xs text-[#767471]">
              Zero hidden taxes or arbitrary travel surcharges. Direct
              reservation with verified deliverable timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {photogPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-3xl border p-6 transition sm:p-8 ${
                  pkg.is_popular
                    ? "border-[#C59B27] bg-[#FBF9F5] shadow-xl ring-1 ring-[#C59B27]"
                    : "border-[#E8E2D2] bg-white shadow-sm hover:border-[#C59B27]/60"
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#C59B27] px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] shadow-sm">
                    Most Requested
                  </div>
                )}

                <div>
                  <div className="text-[11px] font-semibold text-[#767471] uppercase tracking-wider">
                    {pkg.tagline}
                  </div>
                  <h3 className="mt-1  text-2xl font-bold text-[#1A1A1A]">
                    {pkg.name}
                  </h3>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className=" text-3xl font-bold text-[#1A1A1A]">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-[#767471]">all incl.</span>
                  </div>

                  <div className="mt-2 text-xs text-[#52504E] flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#C59B27]" />
                    <span>{pkg.duration_hours} Hours Continuous Coverage</span>
                  </div>

                  {/* Deliverables checklist */}
                  <div className="mt-6 space-y-2.5 border-t border-[#F0ECE1] pt-6">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                      Deliverables & Perks
                    </div>
                    {pkg.deliverables.map((deliv, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-[#52504E]"
                      >
                        <Check className="h-4 w-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#F0ECE1]">
                  <button
                    id={`select-package-${pkg.id}`}
                    onClick={() =>
                      onSelectPackageToBook(pkg.id, selectedCalendarDate)
                    }
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition shadow-xs ${
                      pkg.is_popular
                        ? "bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AF37]"
                        : "bg-[#1A1A1A] text-white hover:bg-[#333]"
                    }`}
                  >
                    <span>Choose {pkg.name}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <p className="mt-2 text-center text-[10px] text-[#767471]">
                    {pkg.turnaround_days}-day delivery guarantee • Zero upfront
                    charge
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PATRON REVIEWS: Voices of Trust matching Image 6 */}
        <section className="mt-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
              Patron Reviews
            </span>
            <h2 className="mt-1  text-2xl font-bold text-[#1A1A1A]">
              Voices of Trust ({photographer.review_count})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Rating Scores Column */}
            <div className="lg:col-span-4 rounded-3xl border border-[#D9D2C2] bg-white p-6 shadow-sm">
              <div className="text-center pb-6 border-b border-[#F0ECE1]">
                <div className=" text-4xl font-bold text-[#1A1A1A]">
                  {photographer.rating}
                </div>
                <div className="flex justify-center gap-1 mt-1 text-[#C59B27]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div className="mt-1 text-xs text-[#767471]">
                  Based on {photographer.review_count} verified bookings
                </div>
              </div>

              <div className="mt-6 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#52504E]">
                      Artistic Direction & Creativity
                    </span>
                    <span className="font-bold text-[#1A1A1A]">5.0</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#F0ECE1]">
                    <div className="h-1.5 rounded-full bg-[#C59B27] w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#52504E]">
                      Delivery & Promptness
                    </span>
                    <span className="font-bold text-[#1A1A1A]">4.9</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#F0ECE1]">
                    <div className="h-1.5 rounded-full bg-[#C59B27] w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#52504E]">
                      Professional Demeanor
                    </span>
                    <span className="font-bold text-[#1A1A1A]">5.0</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#F0ECE1]">
                    <div className="h-1.5 rounded-full bg-[#C59B27] w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-8 space-y-4">
              {photogReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-2xl border border-[#E8E2D2] bg-white p-5 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          rev.customer_avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                        }
                        alt={rev.customer_name}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-[#D9D2C2]"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1A1A]">
                          {rev.customer_name}
                        </h4>
                        <div className="text-[11px] text-[#767471]">
                          {rev.event_title}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded bg-[#F0ECE1] px-2 py-0.5 text-xs font-bold text-[#1A1A1A]">
                      <Star className="h-3 w-3 fill-[#C59B27] text-[#C59B27]" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-[#52504E] italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Mobile Bottom Bar — sits above the global BottomNav (bottom-16) */}
      <div className="fixed bottom-16 left-0 right-0 z-40 flex items-center justify-between border-t border-[#E8E2D2] bg-white/95 px-6 py-3.5 backdrop-blur-md sm:hidden">
        <div>
          <span className="text-[10px] text-[#767471] uppercase block">
            Starting from
          </span>
          <span className=" text-base font-bold text-[#1A1A1A]">
            ₹{photographer.starting_price.toLocaleString("en-IN")}
          </span>
        </div>

        <button
          onClick={() => {
            const firstPkg = photogPackages[0];
            if (firstPkg)
              onSelectPackageToBook(firstPkg.id, selectedCalendarDate);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-5 py-2.5 text-xs font-semibold text-white shadow-sm active:scale-98"
        >
          <Calendar className="h-4 w-4 text-[#C59B27]" />
          <span>Book Session</span>
        </button>
      </div>

      {/* Lightbox for high-res photo inspection */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-white hover:text-[#C59B27]"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Full resolution master frame"
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
