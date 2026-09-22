"use client";

import { DateRangePicker } from "@/components/common/DateRangePicker";
import { useApp } from "@/lib/store/app-context";
import {
  ArrowRight,
  Award,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import React, { useState } from "react";

interface HomeViewProps {
  onNavigate: (tab: string, param?: string) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const {
    photographers,
    categories,
    isPhotographerSaved,
    toggleSavePhotographer,
    switchUserRole,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>("Wedding");
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const featuredPhotographer =
    photographers.find((p) => p.is_featured) || photographers[0];
  const nearbyPhotographers = photographers
    .filter((p) => p.id !== featuredPhotographer.id)
    .slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate("explore", selectedCategory);
  };

  return (
    <div className="min-h-screen pb-24 text-[#1A1A1A]">
      {/* 1. Hero Section matching Image 2 */}
      <section className="relative overflow-hidden border-b border-[#E8E2D2] bg-gradient-to-b from-[#F0ECE1]/50 to-[#FBF9F5] px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C59B27]/40 bg-[#F0ECE1] px-3.5 py-1 text-[11px] font-semibold tracking-wider text-[#997316] uppercase shadow-xs">
            <Sparkles className="h-3 w-3 text-[#C59B27]" />
            Curated Masters • India
          </div>

          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-5xl sm:leading-[1.15] lg:text-6xl">
            Capture moments that last forever.
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#767471] sm:text-base">
            Find the perfect photographer for your intimate celebrations, luxury
            destination weddings, and milestone portraits.
          </p>

          {/* Search Box Widget */}
          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-[#D9D2C2] bg-white p-4 shadow-xl sm:p-6 text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#767471] mb-3">
              What are you looking for?
            </div>

            {/* Category selection pills */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-[#F0ECE1]">
              {[
                "Wedding",
                "Pre-Wedding",
                "Portrait",
                "Event",
                "Fashion & Editorial",
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    selectedCategory === cat
                      ? "bg-[#1A1A1A] text-[#FBF9F5] shadow-sm"
                      : "bg-[#FBF9F5] text-[#767471] border border-[#E8E2D2] hover:border-[#C59B27]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Inputs & CTA Row */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center"
            >
              <div className="sm:col-span-4 flex items-center gap-2 rounded-xl border border-[#E8E2D2] bg-[#FBF9F5] px-3 py-2.5">
                <MapPin className="h-4 w-4 text-[#C59B27] shrink-0" />
                <div className="flex-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#767471]">
                    Location
                  </div>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="All Cities or Destination"
                    className="w-full bg-transparent text-xs font-semibold text-[#1A1A1A] focus:outline-none placeholder:text-[#999]"
                  />
                </div>
              </div>

              <div className="sm:col-span-5">
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  label="Event Dates"
                  placeholder="Select Event Date Range"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  id="search-photographers-btn"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] py-3 text-xs font-semibold text-[#FBF9F5] shadow-md transition hover:bg-[#333] hover:shadow-lg active:scale-98"
                >
                  <Search className="h-4 w-4 text-[#C59B27]" />
                  <span>Find Photographers</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl font-bold tracking-tight text-[#1A1A1A] sm:text-2xl">
              Popular Categories
            </h2>
            <p className="text-xs text-[#767471]">
              Explore verified talent curated across premier visual genres
            </p>
          </div>
          <button
            onClick={() => onNavigate("explore")}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#C59B27] hover:underline"
          >
            See All <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate("explore", cat.name)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E8E2D2] bg-white transition hover:-translate-y-1 hover:shadow-md hover:border-[#C59B27]/60"
            >
              <div className="relative h-32 w-full overflow-hidden">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <h3 className="font-serif text-sm font-semibold tracking-tight leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-[#F0ECE1]/90">
                    {cat.artist_count}+ Artists
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Artisan of the Month (Featured Artist Arjun K. matching Image) */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#E8E2D2] bg-white shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch p-3.5 sm:p-4 gap-4">
            {/* Left Info Column */}
            <div className="p-4 sm:p-6 lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#FAF3DD] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A37813]">
                    Featured Artist
                  </span>
                  <span className="text-xs text-[#767471]">
                    Artisan of the Month
                  </span>
                </div>

                <div className="mt-3.5 flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                      {featuredPhotographer.business_name}
                    </h3>
                    <p className="flex items-center gap-1.5 mt-1 text-xs text-[#767471]">
                      <MapPin className="h-3.5 w-3.5 text-[#C59B27]" />
                      {featuredPhotographer.city} • Travels Worldwide
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      toggleSavePhotographer(featuredPhotographer.id)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E2D2] text-[#767471] hover:text-red-600 transition shrink-0 ml-2"
                    aria-label="Save photographer"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isPhotographerSaved(featuredPhotographer.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-3.5 flex items-center gap-2.5">
                  <div className="flex items-center gap-1 rounded-lg bg-[#F0ECE1] px-2.5 py-1 text-xs font-semibold text-[#1A1A1A]">
                    <Star className="h-3.5 w-3.5 fill-[#C59B27] text-[#C59B27]" />
                    <span>{featuredPhotographer.rating}</span>
                    <span className="text-[10px] text-[#767471]">
                      ({featuredPhotographer.review_count} reviews)
                    </span>
                  </div>
                  <span className="rounded-md border border-[#E8E2D2] px-2.5 py-1 text-[11px] text-[#52504E]">
                    Candid • Fine Art
                  </span>
                </div>

                <p className="mt-3.5 text-xs leading-relaxed text-[#52504E]">
                  {featuredPhotographer.bio}
                </p>

                <div className="mt-3.5 flex flex-wrap gap-2">
                  {featuredPhotographer.honors.slice(0, 1).map((honor, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-[11px] text-[#767471]"
                    >
                      <Award className="h-3.5 w-3.5 text-[#C59B27]" />
                      <span>{honor}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#F0ECE1] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#767471]">
                    Starting from
                  </div>
                  <div className="font-serif text-lg font-bold text-[#1A1A1A]">
                    ₹
                    {featuredPhotographer.starting_price.toLocaleString(
                      "en-IN",
                    )}{" "}
                    <span className="text-xs font-normal text-[#767471]">
                      / session
                    </span>
                  </div>
                </div>

                <button
                  id="featured-artist-view-profile"
                  onClick={() =>
                    onNavigate("photographer-detail", featuredPhotographer.id)
                  }
                  className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-4.5 py-2.5 text-xs font-semibold text-[#FBF9F5] shadow-xs transition hover:bg-[#333]"
                >
                  <span>View Profile</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#C59B27]" />
                </button>
              </div>
            </div>

            {/* Right Photo Collage matching screenshot */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-2 p-2 bg-[#F0ECE1]/40 min-h-[320px] sm:min-h-[400px]">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={
                    featuredPhotographer?.hero_images?.[0] ||
                    "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop"
                  }
                  alt="Curated frame 1"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>
              <div className="grid grid-rows-2 gap-2">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={
                      featuredPhotographer?.hero_images?.[1] ||
                      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop"
                    }
                    alt="Curated frame 2"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                </div>
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={
                      featuredPhotographer?.hero_images?.[2] ||
                      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop"
                    }
                    alt="Curated frame 3"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Popular Near You (Explore Cards) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl font-bold tracking-tight text-[#1A1A1A] sm:text-2xl">
              Popular Near You
            </h2>
            <p className="text-xs text-[#767471]">
              Leading verified artists available in Gujarat, Rajasthan & Mumbai
            </p>
          </div>
          <button
            onClick={() => onNavigate("explore")}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#C59B27] hover:underline"
          >
            Explore All <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {nearbyPhotographers.map((artist) => (
            <div
              key={artist.id}
              className="group overflow-hidden rounded-2xl border border-[#E8E2D2] bg-white shadow-sm transition hover:shadow-md hover:border-[#C59B27]/40"
            >
              {/* Photo preview strip */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={artist.hero_images[0]}
                  alt={artist.business_name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleSavePhotographer(artist.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-xs text-[#1A1A1A] hover:text-red-600 transition"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isPhotographerSaved(artist.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                  </button>
                </div>
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-medium text-white">
                    Free this weekend
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1A1A1A] group-hover:text-[#997316] transition">
                      {artist.business_name}
                    </h3>
                    <p className="flex items-center gap-1 text-[11px] text-[#767471] mt-0.5">
                      <MapPin className="h-3 w-3 text-[#C59B27]" />
                      {artist.city}, {artist.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#1A1A1A]">
                    <Star className="h-3.5 w-3.5 fill-[#C59B27] text-[#C59B27]" />
                    <span>{artist.rating}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {artist.categories.map((c) => (
                    <span
                      key={c}
                      className="rounded-md bg-[#FBF9F5] border border-[#E8E2D2] px-2 py-0.5 text-[10px] text-[#52504E]"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#767471] block">
                      From
                    </span>
                    <span className="text-xs font-bold text-[#1A1A1A]">
                      ₹{artist.starting_price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate("photographer-detail", artist.id)}
                    className="rounded-lg bg-[#F0ECE1] px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How PhotoBook Works */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#D9D2C2] bg-[#F0ECE1]/50 p-6 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
              The Protocol
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-[#1A1A1A]">
              How PhotoBook Works
            </h2>
            <p className="mt-1.5 text-xs text-[#767471]">
              A seamless, transparent engagement process with zero upfront
              booking fees.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-[#E8E2D2] bg-white p-6 shadow-xs">
              <div className="font-serif text-3xl font-bold text-[#C59B27]/40">
                01
              </div>
              <h3 className="mt-2 font-serif text-base font-bold text-[#1A1A1A]">
                Discover Masters
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#52504E]">
                Explore vetted photographers, their complete gear, awards,
                verified reviews, and real uncompressed portfolios.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8E2D2] bg-white p-6 shadow-xs">
              <div className="font-serif text-3xl font-bold text-[#C59B27]/40">
                02
              </div>
              <h3 className="mt-2 font-serif text-base font-bold text-[#1A1A1A]">
                Transparent Packages
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#52504E]">
                Review all-inclusive pricing tiers with explicit deliverables,
                album inclusions, duration, and turnaround times.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8E2D2] bg-white p-6 shadow-xs">
              <div className="font-serif text-3xl font-bold text-[#C59B27]/40">
                03
              </div>
              <h3 className="mt-2 font-serif text-base font-bold text-[#1A1A1A]">
                Direct Reservation
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#52504E]">
                Submit your event parameters without advance deposits.
                Communicate directly with the artist and receive your private
                gallery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Patron Testimonial Quote Card */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="relative rounded-3xl border border-[#C59B27]/30 bg-white p-8 shadow-lg text-center">
          <div className="font-serif text-4xl text-[#C59B27] leading-none mb-3">
            “
          </div>
          <p className="font-serif text-base italic leading-relaxed text-[#1A1A1A] sm:text-lg">
            Booking our Udaipur wedding photographer through PhotoBook felt like
            curating an exhibition. Arjun blended seamlessly into our rituals
            and delivered frames that made our entire family weep with joy.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Rhea Kapoor"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-[#C59B27]"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-[#1A1A1A]">
                Rhea Kapoor & Kabir
              </div>
              <div className="text-[10px] text-[#767471] flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-[#2D6A4F]" />
                Verified PhotoBook Booking
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Callout: Turn your photography into opportunities */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#1A1A1A] p-8 sm:p-12 text-[#FBF9F5]">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#C59B27]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="rounded-full bg-[#C59B27]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
              Studio Portal Pro
            </span>
            <h2 className="mt-3 font-serif text-2xl font-bold sm:text-4xl text-white">
              Turn your photography into opportunities.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#A6A4A0] leading-relaxed">
              Showcase your portfolio to high-intent patrons, manage your
              commissions, protect dates with live availability, and deliver
              high-res galleries with private PINs.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                id="join-as-photographer-btn"
                onClick={() => {
                  switchUserRole("photographer");
                  onNavigate("studio");
                }}
                className="flex items-center gap-2 rounded-xl bg-[#C59B27] px-5 py-3 text-xs font-semibold text-[#1A1A1A] transition hover:bg-[#D4AF37]"
              >
                <span>Enter Studio Portal Pro</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
