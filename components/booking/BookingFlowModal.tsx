"use client";

import { useApp } from "@/lib/store/app-context";
import { Booking } from "@/lib/types";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";

interface BookingFlowModalProps {
  photographerId: string;
  initialPackageId?: string;
  initialDate: string;
  onClose: () => void;
  onComplete: (booking: Booking) => void;
  onOpenChat: (bookingId: string) => void;
}

export function BookingFlowModal({
  photographerId,
  initialPackageId,
  initialDate,
  onClose,
  onComplete,
  onOpenChat,
}: BookingFlowModalProps) {
  const {
    photographers,
    packages,
    requestBooking,
    checkAvailability,
    currentUser,
    isAuthenticated,
    loginUser,
    registerUser,
  } = useApp();

  const photographer =
    photographers.find((p) => p.id === photographerId) || photographers[0];
  const photogPackages = packages.filter(
    (p) => p.photographer_id === photographer.id,
  );

  // Stepper state: 1 (Package), 2 (Date), 3 (Time), 4 (Details), 5 (Review), 6 (Success)
  const [currentStep, setCurrentStep] = useState<number>(
    initialPackageId ? 2 : 1,
  );
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackageId || photogPackages[0]?.id || "",
  );

  const defaultDate = initialDate;
  const [eventDate, setEventDate] = useState<string>(defaultDate);

  // Modal mini calendar state
  const [stepCalYear, setStepCalYear] = useState<number>(() => {
    const parts = initialDate.split("-");
    return parseInt(parts[0]) || 2026;
  });
  const [stepCalMonth, setStepCalMonth] = useState<number>(() => {
    const parts = initialDate.split("-");
    return (parseInt(parts[1]) || 9) - 1; // 0-indexed
  });

  React.useEffect(() => {
    if (initialDate) {
      setEventDate(initialDate);
      const parts = initialDate.split("-");
      if (parts.length === 3) {
        setStepCalYear(parseInt(parts[0]) || 2026);
        setStepCalMonth((parseInt(parts[1]) || 9) - 1);
      }
    }
  }, [initialDate]);
  const [timeWindow, setTimeWindow] = useState<{
    start: string;
    end: string;
    label: string;
  }>({
    start: "14:00",
    end: "19:00",
    label: "Afternoon to Sunset (02:00 PM – 07:00 PM)",
  });
  const [eventType, setEventType] = useState<string>("Wedding & Reception");
  const [guestCount, setGuestCount] = useState<number>(250);
  const [venueName, setVenueName] = useState<string>(
    "Gulmohar Greens Heritage Lawn",
  );
  const [venueAddress, setVenueAddress] = useState<string>(
    "Off SG Highway, Sanand Circle, Ahmedabad, Gujarat",
  );
  const [creativeNotes, setCreativeNotes] = useState<string>(
    "Focus on intimate family candid moments during sunset pheras. No stiff poses please!",
  );
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Patron credentials for guest checkout
  const [guestFullName, setGuestFullName] = useState<string>(
    currentUser.full_name !== "Guest User" ? currentUser.full_name : "",
  );
  const [guestEmail, setGuestEmail] = useState<string>(
    currentUser.email !== "guest@photobook.app" ? currentUser.email : "",
  );
  const [guestPhone, setGuestPhone] = useState<string>(currentUser.phone || "");

  const selectedPackage =
    photogPackages.find((p) => p.id === selectedPackageId) || photogPackages[0];

  const handleNextStep = () => {
    setBookingError(null);
    if (currentStep === 2) {
      // Validate date
      const avail = checkAvailability(photographer.id, eventDate);
      if (!avail.isAvailable) {
        setBookingError(avail.reason || "This date is unavailable.");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleFinalSubmit = () => {
    setBookingError(null);
    if (!agreedToTerms) {
      setBookingError("Please acknowledge the booking protocol terms.");
      return;
    }

    // If customer is not authenticated, register or sign them in with provided patron contact info
    if (!isAuthenticated || currentUser.id === "user-guest") {
      if (!guestEmail.trim() || !guestEmail.includes("@")) {
        setBookingError(
          "Please provide a valid email address to complete your commission request.",
        );
        return;
      }
      if (!guestFullName.trim()) {
        setBookingError(
          "Please provide your full name for the booking session pass.",
        );
        return;
      }

      const regRes = registerUser({
        role: "customer",
        full_name: guestFullName.trim(),
        email: guestEmail.trim(),
        phone: guestPhone.trim() || "+91 98250 12345",
        city: photographer.city,
      });

      if (!regRes.success) {
        // If email already registered, log in
        const logRes = loginUser(guestEmail.trim(), "customer");
        if (!logRes.success) {
          setBookingError(
            regRes.error || "Please sign in to complete your booking.",
          );
          return;
        }
      }
    }

    const res = requestBooking({
      photographerId: photographer.id,
      packageId: selectedPackage.id,
      eventDate,
      eventTimeStart: timeWindow.start,
      eventTimeEnd: timeWindow.end,
      durationHours: selectedPackage.duration_hours,
      eventType,
      venueName,
      venueAddress,
      guestCount,
      creativeNotes,
    });

    if (res.success && res.booking) {
      setCreatedBooking(res.booking);
      setCurrentStep(6); // Show Success Screen matching Image 12
    } else {
      setBookingError(res.error || "Unable to complete reservation request.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-[#D9D2C2] bg-[#FBF9F5] shadow-2xl overflow-hidden my-6">
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between border-b border-[#E8E2D2] bg-white px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className=" text-lg font-bold text-[#1A1A1A]">
              {currentStep === 6
                ? "Reservation Dispatched"
                : "Commission Photographer"}
            </span>
            {currentStep < 6 && (
              <span className="rounded-full bg-[#F0ECE1] px-2.5 py-0.5 text-[10px] font-bold text-[#767471]">
                Step {currentStep} of 5
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#767471] hover:bg-[#F0ECE1] hover:text-[#1A1A1A] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        {currentStep < 6 && (
          <div className="bg-[#F0ECE1]/60 px-6 py-2 border-b border-[#E8E2D2]">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#767471]">
              <span
                className={currentStep >= 1 ? "font-bold text-[#1A1A1A]" : ""}
              >
                1. Package
              </span>
              <span
                className={currentStep >= 2 ? "font-bold text-[#1A1A1A]" : ""}
              >
                2. Date
              </span>
              <span
                className={currentStep >= 3 ? "font-bold text-[#1A1A1A]" : ""}
              >
                3. Time
              </span>
              <span
                className={currentStep >= 4 ? "font-bold text-[#1A1A1A]" : ""}
              >
                4. Details
              </span>
              <span
                className={currentStep >= 5 ? "font-bold text-[#C59B27]" : ""}
              >
                5. Review
              </span>
            </div>
            <div className="mt-1.5 h-1 w-full rounded-full bg-[#E8E2D2]">
              <div
                className="h-1 rounded-full bg-[#C59B27] transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {bookingError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{bookingError}</span>
            </div>
          )}

          {/* STEP 1: Select Package */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className=" text-lg font-bold text-[#1A1A1A]">
                  Select a Commission Tier
                </h3>
                <p className="text-xs text-[#767471]">
                  Choose from {photographer.business_name}&apos;s transparently
                  priced collections.
                </p>
              </div>

              <div className="space-y-3">
                {photogPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      selectedPackageId === pkg.id
                        ? "border-[#C59B27] bg-white shadow-md ring-1 ring-[#C59B27]"
                        : "border-[#E8E2D2] bg-white hover:border-[#C59B27]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className=" text-base font-bold text-[#1A1A1A]">
                            {pkg.name}
                          </h4>
                          {pkg.is_popular && (
                            <span className="rounded-full bg-[#C59B27]/15 px-2 py-0.5 text-[9px] font-bold text-[#997316]">
                              POPULAR
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#767471]">{pkg.tagline}</p>
                      </div>

                      <div className="text-right">
                        <div className=" text-lg font-bold text-[#1A1A1A]">
                          ₹{pkg.price.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-[#767471]">
                          {pkg.duration_hours}h coverage
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-[#F0ECE1]">
                      {pkg.deliverables.slice(0, 3).map((d, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-[#FBF9F5] border border-[#E8E2D2] px-2 py-0.5 text-[10px] text-[#52504E]"
                        >
                          • {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Date */}
          {currentStep === 2 &&
            (() => {
              const now = new Date();
              const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
              const stepMonthName = new Intl.DateTimeFormat("en-US", {
                month: "long",
              }).format(new Date(stepCalYear, stepCalMonth, 1));
              const daysInMonth = new Date(
                stepCalYear,
                stepCalMonth + 1,
                0,
              ).getDate();
              const firstDayWeekday = new Date(
                stepCalYear,
                stepCalMonth,
                1,
              ).getDay();

              const handleStepPrevMonth = () => {
                if (stepCalMonth === 0) {
                  setStepCalMonth(11);
                  setStepCalYear((y) => y - 1);
                } else {
                  setStepCalMonth((m) => m - 1);
                }
              };

              const handleStepNextMonth = () => {
                if (stepCalMonth === 11) {
                  setStepCalMonth(0);
                  setStepCalYear((y) => y + 1);
                } else {
                  setStepCalMonth((m) => m + 1);
                }
              };

              return (
                <div className="space-y-4">
                  <div>
                    <h3 className=" text-lg font-bold text-[#1A1A1A]">
                      Select Your Event Date
                    </h3>
                    <p className="text-xs text-[#767471]">
                      Dates are checked instantly against{" "}
                      {photographer.business_name}&apos;s live availability
                      diary.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E8E2D2] bg-white p-4 shadow-xs">
                    {/* Calendar Month Nav Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F0ECE1]">
                      <div className=" text-sm font-bold text-[#1A1A1A]">
                        {stepMonthName} {stepCalYear}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleStepPrevMonth}
                          className="rounded-lg p-1 text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
                          aria-label="Previous month"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleStepNextMonth}
                          className="rounded-lg p-1 text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
                          aria-label="Next month"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Calendar Days Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (d) => (
                          <div
                            key={d}
                            className="py-1 text-[10px] font-bold text-[#767471] uppercase"
                          >
                            {d}
                          </div>
                        ),
                      )}

                      {/* Offset empty slots */}
                      {Array.from({ length: firstDayWeekday }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-9" />
                      ))}

                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const dayNum = i + 1;
                        const dateStr = `${stepCalYear}-${String(stepCalMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                        const avail = checkAvailability(
                          photographer.id,
                          dateStr,
                        );
                        const isPast = dateStr < todayStr;
                        const isSelected = dateStr === eventDate;
                        const isBooked = !avail.isAvailable && !isPast;

                        return (
                          <button
                            key={dateStr}
                            type="button"
                            disabled={isBooked || isPast}
                            onClick={() => setEventDate(dateStr)}
                            className={`flex h-9 flex-col items-center justify-center rounded-lg text-xs font-semibold transition ${
                              isSelected
                                ? "bg-[#C59B27] text-white font-bold shadow-xs ring-2 ring-[#C59B27]/40"
                                : isPast
                                  ? "bg-[#F5F2EA]/60 text-[#B0ADA8] cursor-not-allowed opacity-60"
                                  : isBooked
                                    ? "bg-[#F0ECE1]/70 text-[#A6A4A0] cursor-not-allowed line-through"
                                    : "bg-[#FBF9F5] border border-[#E8E2D2] text-[#1A1A1A] hover:border-[#C59B27]"
                            }`}
                          >
                            <span>{dayNum}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Date Summary Banner */}
                    <div className="mt-4 rounded-xl bg-[#FBF9F5] border border-[#E8E2D2] p-3 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#C59B27]" />
                        <span>
                          Selected Date:{" "}
                          <strong className="text-[#1A1A1A]">
                            {eventDate}
                          </strong>
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        AVAILABLE
                      </span>
                    </div>

                    <div className="mt-3 rounded-xl bg-[#F0ECE1]/50 p-3 text-xs text-[#52504E] flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#2D6A4F] shrink-0" />
                      <span>
                        No double-booking policy: Once confirmed, this date is
                        locked exclusively for your occasion.
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* STEP 3: Select Time Window */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className=" text-lg font-bold text-[#1A1A1A]">
                  Preferred Shooting Window
                </h3>
                <p className="text-xs text-[#767471]">
                  Coverage includes {selectedPackage.duration_hours} hours.
                  Choose an optimal light window.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    start: "09:00",
                    end: "14:00",
                    label:
                      "Morning & Traditional Rituals (09:00 AM – 02:00 PM)",
                    hint: "Best for Haldi, Mehendi, Pooja and daylight courtyard ceremonies",
                  },
                  {
                    start: "14:00",
                    end: "19:00",
                    label: "Afternoon to Golden Hour (02:00 PM – 07:00 PM)",
                    hint: "Ideal for Baraat arrival, Sunset Pheras & dramatic natural light",
                  },
                  {
                    start: "18:00",
                    end: "23:00",
                    label: "Evening & Reception Gala (06:00 PM – 11:00 PM)",
                    hint: "Sangeet performances, stage lighting, dance floor & banquet",
                  },
                  {
                    start: "10:00",
                    end: "18:00",
                    label: "Full Day Comprehensive (10:00 AM – 06:00 PM)",
                    hint: "Multi-session day with bride/groom prep & full ceremony",
                  },
                ].map((slot) => (
                  <div
                    key={slot.label}
                    onClick={() => setTimeWindow(slot)}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      timeWindow.label === slot.label
                        ? "border-[#C59B27] bg-white shadow-md ring-1 ring-[#C59B27]"
                        : "border-[#E8E2D2] bg-white hover:border-[#C59B27]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-[#1A1A1A]">
                        {slot.label}
                      </div>
                      {timeWindow.label === slot.label && (
                        <Check className="h-4 w-4 text-[#C59B27]" />
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-[#767471]">
                      {slot.hint}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Event Details */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className=" text-lg font-bold text-[#1A1A1A]">
                  Event Parameters & Venue
                </h3>
                <p className="text-xs text-[#767471]">
                  Give the visualist key logistical details to prepare proper
                  optics and lighting equipment.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#767471] mb-1">
                    Occasion / Event Type
                  </label>
                  <input
                    type="text"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    placeholder="e.g. Wedding & Reception, Pre-Wedding, Maternity"
                    className="w-full rounded-xl border border-[#D9D2C2] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#767471] mb-1">
                      Expected Gathering
                    </label>
                    <input
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#D9D2C2] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#767471] mb-1">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="e.g. Gulmohar Greens"
                      className="w-full rounded-xl border border-[#D9D2C2] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#767471] mb-1">
                    Venue Complete Address / City
                  </label>
                  <input
                    type="text"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="Full street address, district, state"
                    className="w-full rounded-xl border border-[#D9D2C2] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#767471] mb-1">
                    Creative Notes & Specific Wishes
                  </label>
                  <textarea
                    rows={3}
                    value={creativeNotes}
                    onChange={(e) => setCreativeNotes(e.target.value)}
                    placeholder="Special rituals, lighting preferences, or specific family portraits..."
                    className="w-full rounded-xl border border-[#D9D2C2] bg-white p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Summary of Request (Exact match of Image 8) */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
                  Final Confirmation
                </span>
                <h3 className=" text-xl font-bold text-[#1A1A1A]">
                  Summary of Request
                </h3>
              </div>

              {/* Artist Header card */}
              <div className="rounded-2xl border border-[#E8E2D2] bg-white p-4 flex items-center gap-3">
                <img
                  src={photographer.hero_images[0]}
                  alt={photographer.business_name}
                  className="h-12 w-12 rounded-xl object-cover ring-1 ring-[#C59B27]"
                />
                <div>
                  <h4 className=" text-sm font-bold text-[#1A1A1A]">
                    {photographer.business_name}
                  </h4>
                  <p className="text-xs text-[#767471]">
                    {photographer.city}, {photographer.state} • Verified Atelier
                  </p>
                </div>
              </div>

              {/* Selected Tier Box */}
              <div className="rounded-2xl border border-[#C59B27]/40 bg-[#FBF9F5] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#767471]">
                      Selected Tier
                    </span>
                    <h4 className=" text-base font-bold text-[#1A1A1A]">
                      {selectedPackage.name}
                    </h4>
                    <p className="text-xs text-[#52504E]">
                      {selectedPackage.tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className=" text-lg font-bold text-[#1A1A1A]">
                      ₹{selectedPackage.price.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] text-[#767471]">
                      All inclusive fee
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-[#52504E] border-t border-[#F0ECE1] pt-3">
                  {selectedPackage.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#2D6A4F]" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar & Venue Parameters */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#E8E2D2] bg-white p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#767471] mb-2 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#C59B27]" />
                    Calendar Reservation
                  </div>
                  <div className="text-xs font-bold text-[#1A1A1A]">
                    {eventDate}
                  </div>
                  <div className="text-xs text-[#52504E] mt-0.5">
                    {timeWindow.label}
                  </div>
                  <div className="text-[11px] text-[#767471] mt-1">
                    {selectedPackage.duration_hours} Hours Coverage
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E8E2D2] bg-white p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#767471] mb-2 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#C59B27]" />
                    Event Parameters
                  </div>
                  <div className="text-xs font-bold text-[#1A1A1A]">
                    {eventType}
                  </div>
                  <div className="text-xs text-[#52504E] mt-0.5">
                    {venueName}
                  </div>
                  <div className="text-[11px] text-[#767471] mt-1">
                    ~{guestCount} Guests Gathering
                  </div>
                </div>
              </div>

              {/* Zero upfront payment required banner matching Image 8 */}
              <div className="rounded-2xl border border-[#C59B27]/40 bg-[#F0ECE1]/80 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#C59B27] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-[#1A1A1A]">
                      Zero upfront payment required
                    </h5>
                    <p className="text-[11px] text-[#52504E] leading-relaxed mt-0.5">
                      No card charges today. Your request is dispatched directly
                      to {photographer.business_name} to confirm their team
                      schedule.
                    </p>
                  </div>
                </div>
              </div>

              {/* Patron Contact & Session Pass Details */}
              {isAuthenticated && currentUser.id !== "user-guest" ? (
                <div className="rounded-2xl border border-[#E8E2D2] bg-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A1A1A] text-[#C59B27]">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#767471]">
                        Patron Account
                      </div>
                      <div className="text-xs font-bold text-[#1A1A1A]">
                        {currentUser.full_name}
                      </div>
                      <div className="text-[11px] text-[#52504E]">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                    Verified
                  </span>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#C59B27] bg-white p-4 space-y-3 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-[#C59B27]" />
                      <h4 className=" text-sm font-bold text-[#1A1A1A]">
                        Patron Account Information
                      </h4>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-900">
                        Required to Book
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#767471]">
                      Enter your details to receive your confirmed session pass
                      and private gallery vault.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-[#52504E] mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={guestFullName}
                        onChange={(e) => setGuestFullName(e.target.value)}
                        placeholder="e.g. Diya Patel"
                        className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#52504E] mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="e.g. diya@example.com"
                          className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#52504E] mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+91 98250 12345"
                          className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms Agreement Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded accent-[#C59B27]"
                />
                <label htmlFor="agree-terms" className="text-xs text-[#52504E]">
                  I agree to the reservation protocol. The photographer has 48
                  hours to confirm availability before this hold expires.
                </label>
              </div>
            </div>
          )}

          {/* STEP 6: Success Screen (Exact match of Image 12) */}
          {currentStep === 6 && createdBooking && (
            <div className="text-center py-4 space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C59B27]/20 border border-[#C59B27]">
                <Clock className="h-8 w-8 text-[#C59B27]" />
              </div>

              <div>
                <span className="rounded-full bg-[#C59B27]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#997316]">
                  Reservation Dispatched
                </span>
                <h3 className="mt-2  text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                  Booking Request Sent!
                </h3>
                <p className="mt-1 text-xs text-[#767471]">
                  Reference Code:{" "}
                  <span className="font-bold text-[#1A1A1A]">
                    {createdBooking.booking_code}
                  </span>
                </p>
              </div>

              {/* Booking Snapshot Card */}
              <div className="rounded-2xl border border-[#E8E2D2] bg-white p-5 text-left shadow-xs">
                <div className="flex justify-between items-center pb-3 border-b border-[#F0ECE1]">
                  <div>
                    <div className=" text-sm font-bold text-[#1A1A1A]">
                      {createdBooking.photographer_name}
                    </div>
                    <div className="text-xs text-[#767471]">
                      {createdBooking.package_name}
                    </div>
                  </div>
                  <div className="text-right  text-base font-bold text-[#1A1A1A]">
                    ₹{createdBooking.total_price.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#52504E]">
                  <div>
                    <span className="text-[10px] text-[#767471] block">
                      DATE
                    </span>
                    <strong>{createdBooking.event_date}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#767471] block">
                      VENUE
                    </span>
                    <strong className="truncate block">
                      {createdBooking.venue_name}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Reservation Protocol Steps */}
              <div className="rounded-2xl border border-[#E8E2D2] bg-[#F0ECE1]/50 p-4 text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#767471] mb-2">
                  What Happens Next?
                </div>
                <div className="space-y-2 text-xs text-[#52504E]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C59B27] text-[10px] font-bold text-white">
                      1
                    </span>
                    <span>
                      <strong>Request Dispatched:</strong> Atelier notification
                      sent to artist&apos;s private portal.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8E2D2] text-[10px] font-bold text-[#767471]">
                      2
                    </span>
                    <span>
                      <strong>Photographer Review:</strong> Artist checks team
                      schedule and approves booking.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8E2D2] text-[10px] font-bold text-[#767471]">
                      3
                    </span>
                    <span>
                      <strong>Session Pass Issued:</strong> Receive your final
                      confirmed booking credentials.
                    </span>
                  </div>
                </div>
              </div>

              {/* Zero payment charged notice */}
              <div className="text-[11px] text-[#767471]">
                Zero payment was charged today. Direct settlement upon shoot
                confirmation.
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  id="message-photographer-after-booking"
                  onClick={() => {
                    onClose();
                    onOpenChat(createdBooking.id);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#1A1A1A] py-3 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Message {photographer.business_name}</span>
                </button>

                <button
                  id="view-my-bookings-after-booking"
                  onClick={() => {
                    onClose();
                    onComplete(createdBooking);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] py-3 text-xs font-semibold text-[#FBF9F5] shadow-md hover:bg-[#333] transition"
                >
                  <span>View in My Bookings</span>
                  <ArrowRight className="h-4 w-4 text-[#C59B27]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1 to 5) */}
        {currentStep < 6 && (
          <div className="flex items-center justify-between border-t border-[#E8E2D2] bg-white px-6 py-4">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="flex items-center gap-1.5 rounded-xl border border-[#D9D2C2] px-4 py-2 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                id="booking-flow-next-btn"
                onClick={handleNextStep}
                className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-2.5 text-xs font-semibold text-[#FBF9F5] shadow-sm hover:bg-[#333] transition"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4 text-[#C59B27]" />
              </button>
            ) : (
              <button
                id="booking-flow-submit-btn"
                onClick={handleFinalSubmit}
                className="flex items-center gap-2 rounded-xl bg-[#C59B27] px-6 py-2.5 text-xs font-bold text-[#1A1A1A] shadow-md hover:bg-[#D4AF37] transition active:scale-98"
              >
                <span>Request Booking</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
