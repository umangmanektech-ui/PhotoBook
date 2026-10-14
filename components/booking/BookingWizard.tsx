'use client';

import { SERVICES, STUDIO_ADDONS, STUDIO_PHOTOGRAPHERS, StudioAddon } from '@/lib/data/studio-data';
import { useApp } from '@/lib/store/app-context';
import { useStudio } from '@/lib/store/studio-context';
import type { Service } from '@/lib/types/appointment';
import { TIME_SLOTS } from '@/lib/types/appointment';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  FileText,
  Info,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  TreePine,
  User,
  Users,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MAIN_PHOTOGRAPHER = STUDIO_PHOTOGRAPHERS.find((p) => p.role === 'main')!;
const ASSOCIATE_PHOTOGRAPHERS = STUDIO_PHOTOGRAPHERS.filter((p) => p.role === 'associate');

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function getSlotEndTime(slotId: string): string {
  const map: Record<string, string> = {
    'ts-0900': '10:00 AM',
    'ts-1000': '11:00 AM',
    'ts-1100': '12:00 PM',
    'ts-1200': '1:00 PM',
    'ts-1300': '2:00 PM',
    'ts-1400': '3:00 PM',
    'ts-1500': '4:00 PM',
    'ts-1600': '5:00 PM',
    'ts-1700': '6:00 PM',
    'ts-1800': '7:00 PM',
  };
  return map[slotId] || '';
}

function getSlotInterval(slotId: string): string {
  const slot = TIME_SLOTS.find((s) => s.id === slotId);
  const end = getSlotEndTime(slotId);
  return slot ? `${slot.label} – ${end}` : slotId;
}

// ─── Types for Wizard State ────────────────────────────────────────────────────

interface SlotAssignment {
  slotId: string;
  photographerId: string;
}

interface WizardState {
  step: 1 | 2 | 3 | 4;
  service: Service | null;
  selectedAddons: string[];
  venueType: 'studio' | 'on-location';
  venueAddress: string;
  date: string;
  selectedPhotographerId?: string;
  slotAssignments: SlotAssignment[];
  customerName: string;
  customerPhone: string;
  notes: string;
}

function getContinuousRangeSummary(slotAssignments: SlotAssignment[]) {
  if (slotAssignments.length === 0) return null;

  const sortedSlots = [...slotAssignments].sort((a, b) => {
    return (
      TIME_SLOTS.findIndex((s) => s.id === a.slotId) -
      TIME_SLOTS.findIndex((s) => s.id === b.slotId)
    );
  });

  const indices = sortedSlots.map((a) =>
    TIME_SLOTS.findIndex((s) => s.id === a.slotId),
  );

  let isContinuous = true;
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] !== indices[i - 1] + 1) {
      isContinuous = false;
      break;
    }
  }

  const firstSlot = TIME_SLOTS[indices[0]];
  const lastSlot = TIME_SLOTS[indices[indices.length - 1]];

  return {
    isContinuous,
    startTime: firstSlot ? firstSlot.label : '',
    endTime: lastSlot ? getSlotEndTime(lastSlot.id) : '',
    totalHours: sortedSlots.length,
    sortedSlots,
  };
}

// ─── Step 1: Service Selector & Add-ons (Enrich Upsell Model) ──────────────────

function ServiceStep({
  selected,
  selectedAddons,
  onSelectService,
  onToggleAddon,
}: {
  selected: Service | null;
  selectedAddons: string[];
  onSelectService: (s: Service) => void;
  onToggleAddon: (addonId: string) => void;
}) {
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = STUDIO_ADDONS.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  const basePrice = selected?.startingPrice || 0;
  const currentTotal = basePrice + addonsTotal;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Choose a Service</h2>
        <p className="text-xs sm:text-sm text-[#767471] mt-1">
          Select your bespoke session to review photographer availability and add-ons
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICES.map((svc) => (
          <button
            key={svc.id}
            onClick={() => onSelectService(svc)}
            className={`relative flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
              selected?.id === svc.id
                ? 'border-[#C59B27] bg-[#1A1A1A] text-white shadow-lg'
                : 'border-[#E8E2D2] bg-white text-[#1A1A1A] hover:border-[#C59B27]/60 hover:shadow-sm'
            }`}
          >
            {svc.popular && (
              <span className="absolute -top-2.5 left-4 rounded-full bg-[#C59B27] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A] shadow-xs">
                Popular
              </span>
            )}
            <span className="text-2xl mt-0.5">{svc.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">{svc.name}</div>
              <div
                className={`text-[11px] mt-0.5 leading-relaxed ${
                  selected?.id === svc.id ? 'text-[#E8E2D2]' : 'text-[#767471]'
                }`}
              >
                {svc.description}
              </div>
              <div
                className={`mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold ${
                  selected?.id === svc.id ? 'text-[#C59B27]' : 'text-[#997316]'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {svc.durationLabel}
                </span>
                <span>₹{svc.startingPrice.toLocaleString('en-IN')}+</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    selected?.id === svc.id
                      ? 'bg-white/10 text-[#E8E2D2]'
                      : 'bg-[#F0ECE1] text-[#767471]'
                  }`}
                >
                  +₹{Math.round(svc.startingPrice / svc.slotsRequired).toLocaleString('en-IN')}/extra hr
                </span>
              </div>
            </div>

            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                selected?.id === svc.id
                  ? 'border-[#C59B27] bg-[#C59B27] text-[#1A1A1A]'
                  : 'border-[#D9D2C2] bg-white text-transparent'
              }`}
            >
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>
          </button>
        ))}
      </div>

      {/* Enrich-style Service Add-ons & Upsell Checklist */}
      <div className="rounded-2xl border border-[#E8E2D2] bg-[#FBF9F5] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#C59B27]" />
            <h3 className="font-serif text-sm font-bold text-[#1A1A1A]">
              Enhance Your Session (Optional Add-ons)
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#767471]">
            Enrich Atelier Care
          </span>
        </div>
        <p className="text-[11px] text-[#767471] mb-3">
          Customise your package with premier aerial cinematography, physical keepsakes, and fast deliverables.
        </p>

        <div className="space-y-2">
          {STUDIO_ADDONS.map((addon) => {
            const isChecked = selectedAddons.includes(addon.id);
            return (
              <div
                key={addon.id}
                onClick={() => onToggleAddon(addon.id)}
                className={`cursor-pointer flex items-center justify-between rounded-xl border p-3 transition ${
                  isChecked
                    ? 'border-[#C59B27] bg-[#FFFBF0] shadow-xs'
                    : 'border-[#E8E2D2] bg-white hover:border-[#D9D2C2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{addon.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-[#1A1A1A] flex items-center gap-2">
                      <span>{addon.name}</span>
                      <span className="text-[11px] font-bold text-[#997316]">
                        +₹{addon.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#767471]">{addon.description}</div>
                  </div>
                </div>

                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
                    isChecked
                      ? 'border-[#C59B27] bg-[#C59B27] text-white'
                      : 'border-[#D9D2C2] bg-white'
                  }`}
                >
                  {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Cart Estimate */}
        {selected && (
          <div className="mt-4 pt-3 border-t border-[#E8E2D2] flex items-center justify-between text-xs">
            <span className="text-[#767471]">
              Estimated Base + {selectedAddons.length} Add-on{selectedAddons.length !== 1 ? 's' : ''}:
            </span>
            <span className="font-serif font-bold text-sm text-[#1A1A1A]">
              ₹{currentTotal.toLocaleString('en-IN')}+
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 2: Date Picker ──────────────────────────────────────────────────────

function DateStep({
  selectedDate,
  onSelect,
}: {
  selectedDate: string;
  onSelect: (d: string) => void;
}) {
  const { isDateFullyBooked } = useStudio();
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    new Date(calYear, calMonth, 1),
  );
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(calYear, calMonth, 1).getDay();
  const today = todayStr();

  const now = new Date();
  const isCurrentMonth = calYear === now.getFullYear() && calMonth === now.getMonth();

  const prevMonth = () => {
    if (isCurrentMonth) return;
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Select Your Event Date</h2>
        <p className="text-xs sm:text-sm text-[#767471] mt-1">
          Checked instantly against {MAIN_PHOTOGRAPHER.name} &amp; associate studio availability
        </p>
      </div>

      <div className="w-full rounded-2xl border border-[#E8E2D2] bg-white p-3 sm:p-6 shadow-xs">
        {/* Calendar Month Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[#F0ECE1]">
          <div className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">
            {monthName} {calYear}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevMonth}
              disabled={isCurrentMonth}
              className="rounded-xl p-2 text-[#1A1A1A] hover:bg-[#F0ECE1] disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-xl p-2 text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div
              key={d}
              className="py-1 text-[11px] font-bold text-[#767471] uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          {/* Offset empty slots */}
          {Array.from({ length: firstDayWeekday }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 sm:h-12" />
          ))}

          {/* Day numbers (Sundays fully enabled!) */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const dayNum = i + 1;
            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(
              dayNum,
            ).padStart(2, '0')}`;
            const isPast = dateStr < today;
            const isToday = dateStr === today;
            const isSelected = selectedDate === dateStr;

            const allPhotogsBooked =
              !isPast &&
              STUDIO_PHOTOGRAPHERS.every((p) => isDateFullyBooked(p.id, dateStr));

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isPast || allPhotogsBooked}
                onClick={() => onSelect(dateStr)}
                className={`relative flex h-10 sm:h-12 flex-col items-center justify-center text-xs sm:text-sm font-semibold transition rounded-xl ${
                  isSelected
                    ? 'bg-[#C59B27] text-white font-bold shadow-md ring-2 ring-[#C59B27]/40 scale-[1.02] z-10'
                    : isPast
                    ? 'bg-[#F5F2EA]/60 text-[#B0ADA8] cursor-not-allowed opacity-60'
                    : allPhotogsBooked
                    ? 'bg-[#F0ECE1]/70 text-[#A6A4A0] cursor-not-allowed line-through'
                    : 'bg-[#FBF9F5] border border-[#E8E2D2] text-[#1A1A1A] hover:border-[#C59B27] hover:bg-[#F5F0E5] hover:shadow-xs'
                } ${
                  isToday && !isSelected
                    ? 'ring-2 ring-[#C59B27] ring-offset-1 font-bold text-[#C59B27]'
                    : ''
                }`}
              >
                <span>{dayNum}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Date Summary Banner */}
        {selectedDate && (
          <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#FFFDF7] to-[#FBF9F5] border-2 border-[#C59B27]/40 p-3.5 sm:p-4 shadow-xs">
            {/* Top row: Label + Status Badge */}
            <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-[#F0ECE1]">
              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#C59B27]/15 text-[#997316]">
                  <Calendar className="h-3 w-3" />
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase font-bold text-[#767471] tracking-wider">
                  Selected Event Date
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-800 shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available Today
              </span>
            </div>

            {/* Main Date row: Generous, crisp, zero wrapping */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-[#1A1A1A] text-[#C59B27] shadow-xs">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#C59B27] leading-none">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-base font-bold font-serif text-white leading-none mt-0.5">
                  {new Date(selectedDate + 'T00:00:00').getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A] leading-snug">
                  {formatDate(selectedDate)}
                </div>
                <div className="text-[11px] text-[#767471] mt-0.5 font-medium">
                  Continuous multi-hour slots ready for selection
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Guarantee Note */}
        <div className="mt-3 rounded-xl bg-[#F0ECE1]/40 p-2.5 sm:p-3 text-[11px] sm:text-xs text-[#52504E] flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#2D6A4F] shrink-0" />
          <span>
            No double-booking policy: Once confirmed, this date &amp; time is reserved exclusively
            for your occasion.
          </span>
        </div>

        {/* Calendar Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] text-[#767471] border-t border-[#F0ECE1] pt-2.5">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-[#FBF9F5] border border-[#E8E2D2] inline-block" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-[#C59B27] inline-block" />
            Selected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-[#F0ECE1]/70 border border-[#E8E2D2] inline-flex items-center justify-center text-[8px] text-[#A6A4A0] font-bold">
              ✕
            </span>
            Unavailable
          </span>
        </div>
      </div>
    </div>
  );
}

function PhotographerAvatar({
  name,
  src,
  size = 48,
  className = '',
}: {
  name: string;
  src: string;
  size?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (error || !src) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`shrink-0 rounded-2xl bg-gradient-to-tr from-[#1A1A1A] to-[#383531] text-[#C59B27] flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-xs ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      style={{ width: size, height: size }}
      onError={() => setError(true)}
      className={`shrink-0 rounded-2xl object-cover ring-2 ring-white shadow-xs bg-[#F0ECE1] ${className}`}
    />
  );
}

// ─── Step 3: Slot Picker (Separate Lead & Associate Photographer Views) ──────

function SlotStep({
  date,
  service,
  slotAssignments,
  selectedPhotographerId,
  onSelectPhotographer,
  onSlotClick,
  onSelectDuration,
  onClearSlots,
}: {
  date: string;
  service: Service | null;
  slotAssignments: SlotAssignment[];
  selectedPhotographerId: string;
  onSelectPhotographer: (photographerId: string) => void;
  onSlotClick: (slotId: string, photographerId: string) => void;
  onSelectDuration: (hours: number, photographerId: string) => void;
  onClearSlots: () => void;
}) {
  const { getBookedSlots } = useStudio();

  const isLeadSelected = selectedPhotographerId === MAIN_PHOTOGRAPHER.id;
  const activePhotographer =
    STUDIO_PHOTOGRAPHERS.find((p) => p.id === selectedPhotographerId) || MAIN_PHOTOGRAPHER;

  // Booked slots calculations for today
  const leadBooked = getBookedSlots(MAIN_PHOTOGRAPHER.id, date);
  const leadFreeSlotsCount = TIME_SLOTS.filter((s) => !leadBooked.includes(s.id)).length;

  const associateFreeSlotsMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const assoc of ASSOCIATE_PHOTOGRAPHERS) {
      const booked = getBookedSlots(assoc.id, date);
      map[assoc.id] = TIME_SLOTS.filter((s) => !booked.includes(s.id)).length;
    }
    return map;
  }, [date, getBookedSlots]);

  const totalAssocFreeSlots = Object.values(associateFreeSlotsMap).reduce((a, b) => a + b, 0);

  // Active photographer booked slots
  const activeBooked = getBookedSlots(activePhotographer.id, date);

  const rangeSummary = getContinuousRangeSummary(slotAssignments);

  const sortedSelectedIndices = useMemo(() => {
    return slotAssignments
      .map((a) => TIME_SLOTS.findIndex((s) => s.id === a.slotId))
      .filter((i) => i !== -1)
      .sort((a, b) => a - b);
  }, [slotAssignments]);

  const minSelectedIdx = sortedSelectedIndices[0] ?? -1;
  const maxSelectedIdx = sortedSelectedIndices[sortedSelectedIndices.length - 1] ?? -1;

  const baseSlots = service?.slotsRequired || 1;
  const basePrice = service?.startingPrice || 0;
  const hourlyRate = Math.round(basePrice / baseSlots);
  const currentHours = slotAssignments.length;
  const extraHours = Math.max(0, currentHours - baseSlots);
  const extraHoursTotal = extraHours * hourlyRate;
  const sessionTotal = basePrice + extraHoursTotal;

  const handleSelectLead = () => {
    onSelectPhotographer(MAIN_PHOTOGRAPHER.id);
  };

  const handleSelectAssociate = (assocId?: string) => {
    if (assocId) {
      onSelectPhotographer(assocId);
      return;
    }
    if (ASSOCIATE_PHOTOGRAPHERS.some((p) => p.id === selectedPhotographerId)) {
      return;
    }
    const sorted = [...ASSOCIATE_PHOTOGRAPHERS].sort(
      (a, b) => (associateFreeSlotsMap[b.id] || 0) - (associateFreeSlotsMap[a.id] || 0),
    );
    onSelectPhotographer(sorted[0]?.id || ASSOCIATE_PHOTOGRAPHERS[0].id);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-1">
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Select Time Slots</h2>
        <p className="text-xs sm:text-sm text-[#767471] mt-1">
          {formatDate(date)} — choose your artist category and reserve continuous hours.
        </p>
      </div>

      {/* ─── 1. Separate Photographer Category Selector: Lead vs Associates ─── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#C59B27]" />
            Photographer Category
          </label>
          <span className="text-[11px] text-[#767471]">
            Tap to switch category &amp; inspect individual real-time availability
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Card 1: Lead Artist — Arjun Kumar */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleSelectLead}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectLead();
              }
            }}
            className={`group relative rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              isLeadSelected
                ? 'border-[#C59B27] bg-[#FFFDF7] shadow-sm ring-1 ring-[#C59B27]/30'
                : 'border-[#E8E2D2] bg-white hover:border-[#C59B27]/60 hover:bg-[#FBF9F5]'
            }`}
          >
            <div>
              {/* Header: Category Badge + Selection Status */}
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#F0ECE1]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-2.5 py-1 text-[10px] font-bold text-[#C59B27] uppercase tracking-wider shadow-xs">
                  <Crown className="h-3 w-3 text-[#C59B27]" />
                  Lead Master Artist
                </span>

                <div className="flex items-center gap-1.5">
                  {isLeadSelected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#C59B27]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#997316] border border-[#C59B27]/40">
                      <Check className="h-3 w-3 stroke-[3]" />
                      Selected
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-[#767471] group-hover:text-[#1A1A1A] transition-colors flex items-center gap-1">
                      Select <ArrowRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex items-start gap-3.5">
                <div className="relative shrink-0">
                  <PhotographerAvatar
                    name={MAIN_PHOTOGRAPHER.name}
                    src={MAIN_PHOTOGRAPHER.avatar}
                    size={52}
                    className="ring-2 ring-[#C59B27]/40 shadow-xs"
                  />
                  <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C59B27] text-[#1A1A1A] shadow-xs">
                    <Crown className="h-2.5 w-2.5 stroke-[2.5]" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1A1A] leading-snug">
                    {MAIN_PHOTOGRAPHER.name}
                  </h3>
                  <p className="text-xs text-[#767471] font-medium mt-0.5">
                    Founder &amp; Creative Director
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#767471]">
                    <span className="flex items-center gap-1 font-semibold text-[#1A1A1A]">
                      <Star className="h-3.5 w-3.5 fill-[#C59B27] text-[#C59B27]" />
                      {MAIN_PHOTOGRAPHER.rating} ({MAIN_PHOTOGRAPHER.reviewCount})
                    </span>
                    <span>•</span>
                    <span>8+ yrs exp</span>
                    <span>•</span>
                    <span className="text-[#997316] font-semibold">Vogue Featured</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Availability Status */}
            <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
              {leadFreeSlotsCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {leadFreeSlotsCount} slots open today
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Fully booked today
                </span>
              )}
              <span className="text-[11px] font-medium text-[#767471]">Signature Direction</span>
            </div>
          </div>

          {/* Card 2: Associate Photographers — Priya & Rohit */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleSelectAssociate()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectAssociate();
              }
            }}
            className={`group relative rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              !isLeadSelected
                ? 'border-[#C59B27] bg-[#FFFDF7] shadow-sm ring-1 ring-[#C59B27]/30'
                : 'border-[#E8E2D2] bg-white hover:border-[#C59B27]/60 hover:bg-[#FBF9F5]'
            }`}
          >
            <div>
              {/* Header: Category Badge + Selection Status */}
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#F0ECE1]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFECE5] px-2.5 py-1 text-[10px] font-bold text-[#52504E] uppercase tracking-wider">
                  <Users className="h-3 w-3 text-[#52504E]" />
                  Associate Artists
                </span>

                <div className="flex items-center gap-1.5">
                  {!isLeadSelected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#C59B27]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#997316] border border-[#C59B27]/40">
                      <Check className="h-3 w-3 stroke-[3]" />
                      Selected
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-[#767471] group-hover:text-[#1A1A1A] transition-colors flex items-center gap-1">
                      Select <ArrowRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex items-start gap-3.5">
                <div className="flex -space-x-3 shrink-0">
                  {ASSOCIATE_PHOTOGRAPHERS.map((assoc, idx) => (
                    <PhotographerAvatar
                      key={assoc.id}
                      name={assoc.name}
                      src={assoc.avatar}
                      size={52}
                      className={`ring-2 ring-white shadow-xs ${idx === 0 ? 'z-10' : 'z-0'}`}
                    />
                  ))}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1A1A] leading-snug">
                    Associate Artists
                  </h3>
                  <p className="text-xs text-[#767471] font-medium mt-0.5">
                    Priya Mehta &amp; Rohit Shah
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#767471]">
                    <span className="flex items-center gap-1 font-semibold text-[#1A1A1A]">
                      <Star className="h-3.5 w-3.5 fill-[#C59B27] text-[#C59B27]" />
                      4.8 Avg Rating
                    </span>
                    <span>•</span>
                    <span>4–5 yrs exp</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">Trained by Arjun</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Availability Status */}
            <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
              {totalAssocFreeSlots > 0 ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {totalAssocFreeSlots} slots across team
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Fully booked today
                </span>
              )}
              <span className="text-[11px] font-medium text-[#767471]">Studio Certified</span>
            </div>
          </div>
        </div>

        {/* ─── Sub-Selector: When Associate Artists is active ─── */}
        {!isLeadSelected && (
          <div className="rounded-2xl bg-gradient-to-b from-[#FBF9F5] to-[#F7F3EA] border border-[#E8E2D2] p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
                <Users className="h-3.5 w-3.5 text-[#C59B27]" />
                <span>Select Individual Associate Artist:</span>
              </div>
              <span className="text-[#767471] text-[11px]">
                Switch between artists to inspect individual schedule &amp; reserve hours
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ASSOCIATE_PHOTOGRAPHERS.map((assoc) => {
                const isThisAssoc = selectedPhotographerId === assoc.id;
                const freeCount = associateFreeSlotsMap[assoc.id] || 0;
                return (
                  <button
                    key={assoc.id}
                    type="button"
                    onClick={() => handleSelectAssociate(assoc.id)}
                    className={`flex items-center justify-between gap-3 rounded-xl p-3 text-left border transition-all ${
                      isThisAssoc
                        ? 'border-[#C59B27] bg-white shadow-xs ring-1 ring-[#C59B27]/40'
                        : 'border-[#E8E2D2] bg-white/70 hover:border-[#C59B27]/50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PhotographerAvatar
                        name={assoc.name}
                        src={assoc.avatar}
                        size={40}
                        className="ring-2 ring-white shadow-xs"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-[#1A1A1A] truncate">
                            {assoc.name}
                          </span>
                          {isThisAssoc && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#C59B27]" />
                          )}
                        </div>
                        <div className="text-[11px] text-[#767471] truncate mt-0.5">
                          {assoc.specialties.slice(0, 2).join(', ')} · {assoc.rating} ★
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          freeCount > 0
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {freeCount > 0 ? `${freeCount} Open` : 'Booked'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── 2. Active Artist Bio Ribbon (Redesigned Elegant Banner) ─── */}
      <div className="rounded-2xl border border-[#C59B27]/30 bg-gradient-to-r from-[#FFFDF7] via-[#FAF7F0] to-[#FFFDF7] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <PhotographerAvatar
              name={activePhotographer.name}
              src={activePhotographer.avatar}
              size={44}
              className="ring-2 ring-[#C59B27]/40 shadow-xs"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#767471]">
                  Viewing Slots For
                </span>
                <span className="text-[#C59B27] font-bold">•</span>
                <span className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A]">
                  {activePhotographer.name}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#1A1A1A] px-2 py-0.5 text-[9px] font-bold text-[#C59B27] uppercase tracking-wider">
                  {activePhotographer.role === 'main' ? 'Lead Master' : 'Associate Artist'}
                </span>
                <span className="text-xs text-[#767471]">
                  ({activePhotographer.experience}+ yrs exp)
                </span>
              </div>
              <p className="text-xs text-[#52504E] italic mt-1 leading-relaxed">
                &ldquo;{activePhotographer.shortBio}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E2D2]/60 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-[#C59B27]/30 text-[#997316] text-[11px] font-semibold shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#C59B27]" />
              <span>
                {activePhotographer.role === 'main' ? 'Direct Master Direction' : 'Studio Certified'}
              </span>
            </div>
            <span className="text-[10px] text-[#767471] font-medium sm:text-right">
              Continuous {baseSlots}-hr base block
            </span>
          </div>
        </div>
      </div>

      {/* ─── 3. Dynamic Service Base Duration & Hourly Pricing Header Card ─── */}
      <div className="rounded-2xl border border-[#C59B27]/40 bg-[#FFFDF7] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{service?.emoji || '📸'}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">
                  {service?.name || 'Selected Service'}
                </span>
                <span className="rounded-full bg-[#1A1A1A] text-[#C59B27] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {baseSlots}-Hour Base Package
                </span>
              </div>
              <p className="text-xs text-[#767471] mt-0.5">
                Standard package includes <strong>{baseSlots} continuous hours</strong> (₹{basePrice.toLocaleString('en-IN')}).
                Extra hours are charged at <strong>₹{hourlyRate.toLocaleString('en-IN')}/hour</strong>.
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E8E2D2]">
            <div className="text-[11px] text-[#767471]">Extra Hourly Rate</div>
            <div className="font-serif font-bold text-base text-[#997316]">
              +₹{hourlyRate.toLocaleString('en-IN')}<span className="text-xs font-sans font-normal text-[#767471]">/hr</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. Continuity Session Status Bar with Live Pricing ─── */}
      {slotAssignments.length > 0 && rangeSummary ? (
        <div
          className={`rounded-2xl p-4 border transition-all ${
            rangeSummary.isContinuous
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  rangeSummary.isContinuous
                    ? 'bg-[#C59B27] text-[#1A1A1A]'
                    : 'bg-amber-500 text-white'
                }`}
              >
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      rangeSummary.isContinuous
                        ? 'bg-[#C59B27]/20 text-[#C59B27]'
                        : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {rangeSummary.isContinuous ? 'Continuous Session' : 'Gap Detected'}
                  </span>
                  <span className="text-xs font-semibold text-[#E8E2D2]">
                    {rangeSummary.totalHours}{' '}
                    {rangeSummary.totalHours === 1 ? 'Hour' : 'Consecutive Hours'}
                  </span>
                </div>
                <div className="mt-0.5">
                  <div className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                    {rangeSummary.startTime} – {rangeSummary.endTime}
                  </div>
                  <div className="text-xs font-sans font-medium text-[#C59B27] mt-0.5">
                    with {activePhotographer.name}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={onClearSlots}
                className="text-xs font-semibold text-[#E8E2D2] hover:text-white bg-white/10 hover:bg-white/20 transition px-3 py-1.5 rounded-lg border border-white/10"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Pricing Breakdown Banner */}
          {rangeSummary.isContinuous && (
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#B0AAA0]">Session Rate:</span>
                <span className="font-semibold text-white">
                  ₹{basePrice.toLocaleString('en-IN')} (Base {baseSlots} hrs)
                </span>
                {extraHours > 0 && (
                  <span className="rounded-full bg-[#C59B27]/25 border border-[#C59B27]/40 px-2 py-0.5 text-[11px] font-bold text-[#C59B27]">
                    +{extraHours} extra hr{extraHours > 1 ? 's' : ''} (+₹{extraHoursTotal.toLocaleString('en-IN')})
                  </span>
                )}
              </div>
              <div className="font-serif font-bold text-base text-[#C59B27]">
                ₹{sessionTotal.toLocaleString('en-IN')}
                <span className="text-[10px] text-[#B0AAA0] font-sans font-normal ml-1">
                  session subtotal
                </span>
              </div>
            </div>
          )}

          {!rangeSummary.isContinuous && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-800 bg-amber-100/70 p-2.5 rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>
                Photography sessions must be consecutive hours. Please select contiguous slots
                without gaps.
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Empty Prompt */
        <div className="rounded-2xl bg-[#FBF9F5] border border-[#E8E2D2] p-4 text-center">
          <p className="text-xs font-medium text-[#767471]">
            Tap any starting hour below to reserve your <strong>{baseSlots}-hour continuous session</strong> with{' '}
            <strong className="text-[#1A1A1A]">{activePhotographer.name}</strong>:
          </p>
        </div>
      )}

      {/* ─── 5. Time Slots List for Active Photographer ─── */}
      {activeBooked.length >= TIME_SLOTS.length ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-amber-600 mx-auto" />
          <div>
            <h4 className="font-serif font-bold text-base text-amber-950">
              {activePhotographer.name} is fully booked on {formatDate(date)}
            </h4>
            <p className="text-xs text-amber-800 mt-1 max-w-md mx-auto">
              {isLeadSelected && totalAssocFreeSlots > 0
                ? 'Good news! Our certified Associate Photographers (Priya Mehta & Rohit Shah) have open slots on this date.'
                : 'Please select another date in the calendar or choose a different photographer above.'}
            </p>
          </div>
          {isLeadSelected && totalAssocFreeSlots > 0 && (
            <button
              type="button"
              onClick={() => handleSelectAssociate()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C59B27] px-4 py-2.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#b0881f] transition shadow-xs"
            >
              <span>View Associate Photographers Availability</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {TIME_SLOTS.map((slot, index) => {
            const isSelected = slotAssignments.some((a) => a.slotId === slot.id);
            const isBooked = activeBooked.includes(slot.id);

            const isFirstInBlock = isSelected && index === minSelectedIdx;
            const isLastInBlock = isSelected && index === maxSelectedIdx;
            const isAdjacentToBlock =
              !isSelected &&
              !isBooked &&
              (index === minSelectedIdx - 1 || index === maxSelectedIdx + 1);

            const hourIndexInBlock = sortedSelectedIndices.indexOf(index) + 1;
            const isExtraHour = isSelected && hourIndexInBlock > baseSlots;

            return (
              <div
                key={slot.id}
                onClick={() => {
                  if (!isBooked) {
                    onSlotClick(slot.id, activePhotographer.id);
                  }
                }}
                className={`group relative rounded-2xl border-2 transition-all duration-150 ${
                  isBooked
                    ? 'border-[#EBE7DE] bg-[#F8F6F1] opacity-60 cursor-not-allowed'
                    : 'cursor-pointer active:scale-[0.99]'
                } ${
                  isSelected
                    ? 'border-[#C59B27] bg-[#FFFDF7] shadow-sm ring-2 ring-[#C59B27]/25'
                    : isAdjacentToBlock
                    ? 'border-[#C59B27]/40 bg-white hover:border-[#C59B27] hover:bg-[#FFFDF7]/60 shadow-xs'
                    : 'border-[#E8E2D2] bg-white hover:border-[#C59B27]/50 hover:bg-[#FBF9F5]'
                }`}
              >
                <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                  {/* Time Section: Prominent, legible & elegant serif display */}
                  <div className="shrink-0 min-w-[90px] sm:min-w-[110px]">
                    <div
                      className={`font-serif text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                        isSelected
                          ? 'text-[#C59B27]'
                          : isBooked
                          ? 'text-[#A8A49C]'
                          : 'text-[#1A1A1A]'
                      }`}
                    >
                      {slot.label}
                    </div>
                    <div className="text-xs text-[#767471] font-medium mt-0.5">
                      {getSlotInterval(slot.id)}
                    </div>
                  </div>

                  {/* Status / Badge Section: Beautifully responsive with zero clumsy wrapping */}
                  <div className="flex-1 min-w-0 flex items-center justify-center px-1">
                    {isSelected ? (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-xs font-bold shadow-xs truncate max-w-full ${
                          isExtraHour
                            ? 'bg-[#C59B27]/20 text-[#997316] border border-[#C59B27]/40'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300/80'
                        }`}
                      >
                        <Sparkles className="h-3 w-3 text-[#C59B27] shrink-0" />
                        <span className="truncate">
                          {isExtraHour
                            ? `Hour ${hourIndexInBlock} · Extra (+₹${hourlyRate.toLocaleString('en-IN')})`
                            : `Hour ${hourIndexInBlock} of ${baseSlots} · Included`}
                        </span>
                      </span>
                    ) : isBooked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFECE5] px-2.5 py-1 text-xs font-medium text-[#8C887E]">
                        <X className="h-3 w-3 shrink-0 text-[#A8A49C]" />
                        <span>Booked</span>
                        <span className="hidden sm:inline text-[#A8A49C]">
                          · {activePhotographer.name}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 sm:px-3 py-1 text-xs font-semibold text-emerald-800 shadow-xs">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                        <span>Available</span>
                        <span className="hidden sm:inline font-normal text-emerald-700/90">
                          · {activePhotographer.name}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Action Button: Generous mobile tap target */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isBooked ? (
                      <button
                        type="button"
                        aria-label={isSelected ? `Deselect ${slot.label}` : `Select ${slot.label}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSlotClick(slot.id, activePhotographer.id);
                        }}
                        className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-[#C59B27] bg-[#C59B27] text-[#1A1A1A] shadow-xs'
                            : isAdjacentToBlock
                            ? 'border-[#C59B27] bg-[#FFFDF7] text-[#C59B27] hover:bg-[#C59B27] hover:text-[#1A1A1A]'
                            : 'border-[#D9D2C2] bg-white text-[#767471] group-hover:border-[#C59B27] group-hover:text-[#1A1A1A]'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" />
                        ) : (
                          <span className="text-base sm:text-lg font-bold leading-none">+</span>
                        )}
                      </button>
                    ) : (
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#EFECE5]/60 text-[#A8A49C]">
                        <span className="text-xs font-medium">—</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Step 4: Confirm (Venue Logistics, Add-on Review & Contact Details) ─────────

function ConfirmStep({
  state,
  onChangeVenueType,
  onChangeVenueAddress,
  onChangeName,
  onChangePhone,
  onChangeNotes,
}: {
  state: WizardState;
  onChangeVenueType: (type: 'studio' | 'on-location') => void;
  onChangeVenueAddress: (addr: string) => void;
  onChangeName: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangeNotes: (v: string) => void;
}) {
  const baseSlots = state.service?.slotsRequired || 1;
  const basePrice = state.service?.startingPrice ?? 0;
  const hourlyRate = Math.round(basePrice / baseSlots);
  const currentHours = state.slotAssignments.length;
  const extraHours = Math.max(0, currentHours - baseSlots);
  const extraHoursTotal = extraHours * hourlyRate;
  const rangeSummary = getContinuousRangeSummary(state.slotAssignments);

  const addonsTotal = state.selectedAddons.reduce((sum, id) => {
    const addon = STUDIO_ADDONS.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  const finalTotal = basePrice + extraHoursTotal + addonsTotal;

  const grouped = state.slotAssignments.reduce<Record<string, string[]>>((acc, a) => {
    if (!acc[a.photographerId]) acc[a.photographerId] = [];
    acc[a.photographerId].push(a.slotId);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Confirm Your Session</h2>
        <p className="text-xs sm:text-sm text-[#767471] mt-1">
          Review your appointment parameters, venue logistics, and patron contact details.
        </p>
      </div>

      {/* Summary Box */}
      <div className="rounded-2xl border border-[#E8E2D2] bg-[#FBF9F5] p-5 space-y-3.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#767471] font-medium">Service</span>
          <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <span>{state.service?.emoji}</span> {state.service?.name}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#767471] font-medium">Event Date</span>
          <span className="font-bold text-[#1A1A1A]">{formatDate(state.date)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#767471] font-medium">Continuous Window</span>
          <span className="font-bold text-[#1A1A1A] font-serif">
            {rangeSummary
              ? `${rangeSummary.startTime} – ${rangeSummary.endTime} (${rangeSummary.totalHours} hrs)`
              : '—'}
          </span>
        </div>

        {/* Extra Hours Breakdown */}
        {extraHours > 0 && (
          <div className="flex items-center justify-between text-sm pt-2 border-t border-[#E8E2D2]">
            <span className="text-[#767471] font-medium">Additional Duration</span>
            <span className="text-xs font-bold text-[#1A1A1A]">
              +{extraHours} hr{extraHours > 1 ? 's' : ''} (@ ₹{hourlyRate.toLocaleString('en-IN')}/hr) · +₹{extraHoursTotal.toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Selected Add-ons Review */}
        {state.selectedAddons.length > 0 && (
          <div className="flex items-start justify-between text-sm pt-2 border-t border-[#E8E2D2]">
            <span className="text-[#767471] font-medium">Session Add-ons</span>
            <div className="text-right space-y-1">
              {state.selectedAddons.map((id) => {
                const addon = STUDIO_ADDONS.find((a) => a.id === id);
                return (
                  <div key={id} className="text-xs font-semibold text-[#1A1A1A]">
                    {addon?.icon} {addon?.name} (+₹{addon?.price.toLocaleString('en-IN')})
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Assigned Artists */}
        <div className="flex items-start justify-between text-sm pt-2 border-t border-[#E8E2D2]">
          <span className="text-[#767471] font-medium">Assigned Artists</span>
          <div className="text-right space-y-1">
            {Object.entries(grouped).map(([photogId, slotIds]) => {
              const photog = STUDIO_PHOTOGRAPHERS.find((p) => p.id === photogId);
              return (
                <div key={photogId} className="text-right">
                  <span className="font-semibold text-[#1A1A1A] text-xs">
                    {photog?.name} {photog?.role === 'main' && '(Lead)'}
                  </span>
                  <span className="text-[11px] text-[#767471] block">
                    {slotIds.map((id) => TIME_SLOTS.find((s) => s.id === id)?.label).join(', ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="flex items-center justify-between text-sm pt-3 border-t border-[#E8E2D2]">
          <div>
            <span className="text-[#767471] font-medium block">Starting Estimate</span>
            <span className="text-[11px] text-emerald-700 font-semibold">Zero upfront payment</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg text-[#1A1A1A] font-serif">
              ₹{finalTotal.toLocaleString('en-IN')}+
            </span>
            {extraHours > 0 && (
              <span className="block text-[10px] text-[#767471]">
                Base ₹{basePrice.toLocaleString('en-IN')} + ₹{extraHoursTotal.toLocaleString('en-IN')} extra time
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Enrich-style Venue Toggle: In-Studio vs On-Location */}
      <div className="rounded-2xl border border-[#E8E2D2] bg-white p-4 sm:p-5">
        <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase tracking-wider">
          Session Location Logistics (In-Studio vs. Venue)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          <button
            type="button"
            onClick={() => onChangeVenueType('studio')}
            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
              state.venueType === 'studio'
                ? 'border-[#C59B27] bg-[#FFFBF0] ring-1 ring-[#C59B27]'
                : 'border-[#E8E2D2] hover:border-[#D9D2C2]'
            }`}
          >
            <Building2 className="h-5 w-5 text-[#C59B27] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#1A1A1A]">In-Studio Session</div>
              <div className="text-[10px] text-[#767471]">
                Arjun Kumar Photography Atelier, Ahmedabad
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChangeVenueType('on-location')}
            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
              state.venueType === 'on-location'
                ? 'border-[#C59B27] bg-[#FFFBF0] ring-1 ring-[#C59B27]'
                : 'border-[#E8E2D2] hover:border-[#D9D2C2]'
            }`}
          >
            <TreePine className="h-5 w-5 text-[#C59B27] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#1A1A1A]">On-Location / Outdoor</div>
              <div className="text-[10px] text-[#767471]">
                Banquet lawn, heritage palace, riverfront, or home
              </div>
            </div>
          </button>
        </div>

        {state.venueType === 'on-location' && (
          <div>
            <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">
              Venue Name &amp; Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-[#767471]" />
              <input
                type="text"
                required
                value={state.venueAddress}
                onChange={(e) => onChangeVenueAddress(e.target.value)}
                placeholder="e.g. Gulmohar Greens Lawn, Off SG Highway, Ahmedabad"
                className="w-full rounded-xl border border-[#D9D2C2] bg-white py-2 pl-9 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Guest Details */}
      <div className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-[#767471]" />
            <input
              type="text"
              required
              value={state.customerName}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="e.g. Sneha Patel"
              className="w-full rounded-xl border border-[#D9D2C2] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3 h-4 w-4 text-[#767471]" />
            <input
              type="tel"
              required
              value={state.customerPhone}
              onChange={(e) => onChangePhone(e.target.value)}
              placeholder="+91 98250 12345"
              className="w-full rounded-xl border border-[#D9D2C2] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
            />
          </div>
          <p className="mt-1 text-[11px] text-[#767471]">
            We use this phone number to display your reservation pass in &quot;My Bookings&quot; without requiring a password.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Special Requests &amp; Notes
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3 h-4 w-4 text-[#767471]" />
            <textarea
              rows={3}
              value={state.notes}
              onChange={(e) => onChangeNotes(e.target.value)}
              placeholder="Family members attending, lighting preferences, or accessibility needs…"
              className="w-full rounded-xl border border-[#D9D2C2] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Booking Wizard Component ────────────────────────────────────────────

interface BookingWizardProps {
  initialServiceId?: string;
  initialPhotographerId?: string;
  onRegisterBack?: (backFn: () => void) => void;
}

export function BookingWizard({
  initialServiceId,
  initialPhotographerId,
  onRegisterBack,
}: BookingWizardProps = {}) {
  const { createAppointment, getBookedSlots } = useStudio();
  const { currentUser, isAuthenticated } = useApp();
  const router = useRouter();

  const initialService = useMemo(() => {
    if (!initialServiceId) return null;
    return SERVICES.find((s) => s.id === initialServiceId) ?? null;
  }, [initialServiceId]);

  const [state, setState] = useState<WizardState>(() => ({
    step: 1,
    service: initialService,
    selectedAddons: [],
    venueType: 'studio',
    venueAddress: '',
    date: '',
    selectedPhotographerId: initialPhotographerId || MAIN_PHOTOGRAPHER.id,
    slotAssignments: [],
    customerName: isAuthenticated ? currentUser.full_name : '',
    customerPhone: isAuthenticated ? currentUser.phone ?? '' : '',
    notes: '',
  }));

  // Prefill patron phone & name from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined' && !state.customerPhone) {
      try {
        const savedPhone = localStorage.getItem('photobook_customer_phone');
        const savedName = localStorage.getItem('photobook_customer_name');
        if (savedPhone || savedName) {
          setState((prev) => ({
            ...prev,
            customerPhone: prev.customerPhone || savedPhone || '',
            customerName: prev.customerName || savedName || '',
          }));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Sync initialService when initialServiceId prop arrives or changes
  useEffect(() => {
    if (initialServiceId) {
      const match = SERVICES.find((s) => s.id === initialServiceId);
      if (match) {
        setState((prev) => ({
          ...prev,
          service: match,
        }));
      }
    }
  }, [initialServiceId]);

  // Sync initialPhotographerId when prop arrives or changes
  useEffect(() => {
    if (initialPhotographerId) {
      setState((prev) => ({
        ...prev,
        selectedPhotographerId: initialPhotographerId,
      }));
    }
  }, [initialPhotographerId]);

  // Track current step in a ref so the back handler callback never re-registers unnecessarily
  const stepRef = useRef(state.step);
  stepRef.current = state.step;

  // Connect wizard step back navigation with parent top bar Back button
  useEffect(() => {
    if (onRegisterBack) {
      onRegisterBack(() => {
        if (stepRef.current > 1) {
          setState((prev) => ({ ...prev, step: (prev.step - 1) as any }));
        } else {
          router.push('/');
        }
      });
    }
  }, [onRegisterBack, router]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const rangeSummary = useMemo(() => {
    return getContinuousRangeSummary(state.slotAssignments);
  }, [state.slotAssignments]);

  const baseSlots = state.service?.slotsRequired || 1;
  const basePrice = state.service?.startingPrice || 0;
  const hourlyRate = Math.round(basePrice / baseSlots);
  const currentHours = state.slotAssignments.length;
  const extraHours = Math.max(0, currentHours - baseSlots);
  const extraHoursTotal = extraHours * hourlyRate;

  const addonsTotal = state.selectedAddons.reduce((sum, id) => {
    const addon = STUDIO_ADDONS.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  const totalEstimate = basePrice + extraHoursTotal + addonsTotal;

  const canProceed = useMemo(() => {
    if (state.step === 1) return !!state.service;
    if (state.step === 2) return !!state.date;
    if (state.step === 3) {
      return state.slotAssignments.length > 0 && !!rangeSummary?.isContinuous;
    }
    if (state.step === 4) {
      const hasContact = !!state.customerName.trim() && !!state.customerPhone.trim();
      const hasVenue =
        state.venueType === 'studio' || !!state.venueAddress.trim();
      return hasContact && hasVenue;
    }
    return false;
  }, [state, rangeSummary]);

  // ─── Continuous Slot Selection Algorithm ───────────────────────────────────

  const handleSelectPhotographer = (photographerId: string) => {
    setState((prev) => {
      const prevPhotogId = prev.selectedPhotographerId || MAIN_PHOTOGRAPHER.id;
      if (prevPhotogId === photographerId) return prev;

      // Check if current slot assignments can be moved to the new photographer
      if (prev.slotAssignments.length > 0) {
        const slotIds = prev.slotAssignments.map((a) => a.slotId);
        const booked = getBookedSlots(photographerId, prev.date);
        const allFree = slotIds.every((sId) => !booked.includes(sId));

        if (allFree) {
          // Keep exact same slots, just reassign photographer
          return {
            ...prev,
            selectedPhotographerId: photographerId,
            slotAssignments: slotIds.map((sId) => ({ slotId: sId, photographerId })),
          };
        } else {
          // Try to find first continuous block of same duration for new photographer
          const neededHours = prev.slotAssignments.length;
          let newSlots: SlotAssignment[] = [];
          for (let i = 0; i <= TIME_SLOTS.length - neededHours; i++) {
            const slice = TIME_SLOTS.slice(i, i + neededHours).map((s) => s.id);
            if (slice.every((sId) => !booked.includes(sId))) {
              newSlots = slice.map((sId) => ({ slotId: sId, photographerId }));
              break;
            }
          }
          return {
            ...prev,
            selectedPhotographerId: photographerId,
            slotAssignments: newSlots,
          };
        }
      }

      return {
        ...prev,
        selectedPhotographerId: photographerId,
      };
    });
  };

  const handleSlotClick = (slotId: string, photographerId?: string) => {
    const activePhotogId = photographerId || state.selectedPhotographerId || MAIN_PHOTOGRAPHER.id;
    const targetIdx = TIME_SLOTS.findIndex((s) => s.id === slotId);
    if (targetIdx === -1) return;

    const booked = getBookedSlots(activePhotogId, state.date);
    if (booked.includes(slotId)) return;

    const currentAssignments = [...state.slotAssignments];
    const currentSlotIds = currentAssignments.map((a) => a.slotId);
    const baseHours = state.service?.slotsRequired || 4;

    // CASE 1: Nothing selected yet.
    // Tap a slot -> selects baseHours continuous slots starting at targetIdx
    if (currentAssignments.length === 0) {
      let start = targetIdx;
      if (start + baseHours > TIME_SLOTS.length) {
        start = Math.max(0, TIME_SLOTS.length - baseHours);
      }
      const targetSlotIds = TIME_SLOTS.slice(start, start + baseHours).map((s) => s.id);
      const isFullSliceFree = targetSlotIds.every((sId) => !booked.includes(sId));
      if (isFullSliceFree) {
        const newSlots: SlotAssignment[] = targetSlotIds.map((sId) => ({
          slotId: sId,
          photographerId: activePhotogId,
        }));
        setState((prev) => ({ ...prev, selectedPhotographerId: activePhotogId, slotAssignments: newSlots }));
        return;
      } else {
        // Consecutive free slots from targetIdx up to baseHours
        const freeRun: string[] = [];
        for (let i = targetIdx; i < Math.min(TIME_SLOTS.length, targetIdx + baseHours); i++) {
          if (booked.includes(TIME_SLOTS[i].id)) break;
          freeRun.push(TIME_SLOTS[i].id);
        }
        if (freeRun.length > 0) {
          const newSlots: SlotAssignment[] = freeRun.map((sId) => ({
            slotId: sId,
            photographerId: activePhotogId,
          }));
          setState((prev) => ({ ...prev, selectedPhotographerId: activePhotogId, slotAssignments: newSlots }));
          return;
        }
      }
    }

    const sortedCurrent = [...currentAssignments].sort((a, b) => {
      return (
        TIME_SLOTS.findIndex((s) => s.id === a.slotId) -
        TIME_SLOTS.findIndex((s) => s.id === b.slotId)
      );
    });
    const currentIndices = sortedCurrent.map((a) =>
      TIME_SLOTS.findIndex((s) => s.id === a.slotId),
    );
    const minIdx = currentIndices[0];
    const maxIdx = currentIndices[currentIndices.length - 1];

    // CASE 2: Clicking an already selected slot.
    if (currentSlotIds.includes(slotId)) {
      if (currentAssignments.length === 1) {
        setState((prev) => ({ ...prev, slotAssignments: [] }));
        return;
      }
      if (targetIdx === maxIdx) {
        setState((prev) => ({
          ...prev,
          slotAssignments: sortedCurrent.slice(0, -1),
        }));
        return;
      }
      if (targetIdx === minIdx) {
        setState((prev) => ({
          ...prev,
          slotAssignments: sortedCurrent.slice(1),
        }));
        return;
      }
      const trimmed = sortedCurrent.filter(
        (a) => TIME_SLOTS.findIndex((s) => s.id === a.slotId) <= targetIdx,
      );
      setState((prev) => ({ ...prev, slotAssignments: trimmed }));
      return;
    }

    // CASE 3: Expanding by 1 hour (adjacent to the end)
    if (targetIdx === maxIdx + 1) {
      if (booked.includes(slotId)) return;
      setState((prev) => ({
        ...prev,
        slotAssignments: [
          ...sortedCurrent,
          { slotId, photographerId: activePhotogId },
        ],
      }));
      return;
    }

    // CASE 4: Prepending by 1 hour (adjacent to the start)
    if (targetIdx === minIdx - 1) {
      if (booked.includes(slotId)) return;
      setState((prev) => ({
        ...prev,
        slotAssignments: [
          { slotId, photographerId: activePhotogId },
          ...sortedCurrent,
        ],
      }));
      return;
    }

    // CASE 5: Shift current session duration to start at targetIdx
    const targetHours = currentAssignments.length > 0 ? currentAssignments.length : baseHours;
    let start = targetIdx;
    if (start + targetHours > TIME_SLOTS.length) {
      start = Math.max(0, TIME_SLOTS.length - targetHours);
    }
    const targetSlotIds = TIME_SLOTS.slice(start, start + targetHours).map((s) => s.id);
    const isSliceFree = targetSlotIds.every((sId) => !booked.includes(sId));
    if (isSliceFree) {
      const newSlots: SlotAssignment[] = targetSlotIds.map((sId) => ({
        slotId: sId,
        photographerId: activePhotogId,
      }));
      setState((prev) => ({ ...prev, selectedPhotographerId: activePhotogId, slotAssignments: newSlots }));
    } else {
      const freeRun: string[] = [];
      for (let i = targetIdx; i < Math.min(TIME_SLOTS.length, targetIdx + targetHours); i++) {
        if (booked.includes(TIME_SLOTS[i].id)) break;
        freeRun.push(TIME_SLOTS[i].id);
      }
      if (freeRun.length > 0) {
        const newSlots: SlotAssignment[] = freeRun.map((sId) => ({
          slotId: sId,
          photographerId: activePhotogId,
        }));
        setState((prev) => ({ ...prev, selectedPhotographerId: activePhotogId, slotAssignments: newSlots }));
      }
    }
  };

  const handleToggleAddon = (addonId: string) => {
    setState((prev) => {
      const exists = prev.selectedAddons.includes(addonId);
      return {
        ...prev,
        selectedAddons: exists
          ? prev.selectedAddons.filter((id) => id !== addonId)
          : [...prev.selectedAddons, addonId],
      };
    });
  };

  const handleSelectDuration = (hours: number, photographerId?: string) => {
    const activePhotogId = photographerId || state.selectedPhotographerId || MAIN_PHOTOGRAPHER.id;
    const booked = getBookedSlots(activePhotogId, state.date);

    let startIdx = 0;
    if (state.slotAssignments.length > 0) {
      const sorted = [...state.slotAssignments].sort((a, b) => {
        return (
          TIME_SLOTS.findIndex((s) => s.id === a.slotId) -
          TIME_SLOTS.findIndex((s) => s.id === b.slotId)
        );
      });
      startIdx = TIME_SLOTS.findIndex((s) => s.id === sorted[0].slotId);
      if (startIdx + hours > TIME_SLOTS.length) {
        startIdx = Math.max(0, TIME_SLOTS.length - hours);
      }
    } else {
      // Find first startIdx where hours continuous slots are free for activePhotogId
      for (let i = 0; i <= TIME_SLOTS.length - hours; i++) {
        const slotSlice = TIME_SLOTS.slice(i, i + hours).map((s) => s.id);
        if (slotSlice.every((sId) => !booked.includes(sId))) {
          startIdx = i;
          break;
        }
      }
    }

    const targetSlotIds = TIME_SLOTS.slice(startIdx, startIdx + hours).map((s) => s.id);
    const newSlots: SlotAssignment[] = targetSlotIds.map((sId) => ({
      slotId: sId,
      photographerId: activePhotogId,
    }));

    setState((prev) => ({ ...prev, selectedPhotographerId: activePhotogId, slotAssignments: newSlots }));
  };

  const handleClearSlots = () => {
    setState((prev) => ({ ...prev, slotAssignments: [] }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const grouped = state.slotAssignments.reduce<Record<string, string[]>>((acc, a) => {
      if (!acc[a.photographerId]) acc[a.photographerId] = [];
      acc[a.photographerId].push(a.slotId);
      return acc;
    }, {});

    let lastError: string | null = null;
    for (const [photographerId, slots] of Object.entries(grouped)) {
      const photog = STUDIO_PHOTOGRAPHERS.find((p) => p.id === photographerId)!;
      const result = createAppointment({
        customerId: isAuthenticated ? currentUser.id : 'guest',
        customerName: state.customerName,
        customerPhone: state.customerPhone,
        customerEmail: isAuthenticated ? currentUser.email : '',
        photographerId,
        photographerName: photog.name,
        date: state.date,
        slots,
        serviceId: state.service!.id,
        serviceName: state.service!.name,
        venueType: state.venueType,
        venueAddress: state.venueType === 'on-location' ? state.venueAddress : 'In-Studio Atelier',
        addons: state.selectedAddons,
        notes: state.notes,
        totalAmount: totalEstimate,
      });
      if (!result.success) lastError = result.error ?? 'Booking failed';
    }

    setSubmitting(false);
    if (lastError) {
      setError(lastError);
      return;
    }

    // Save patron contact details to localStorage so /bookings immediately displays their sessions
    if (typeof window !== 'undefined' && state.customerPhone) {
      try {
        localStorage.setItem('photobook_customer_phone', state.customerPhone.trim());
        if (state.customerName) {
          localStorage.setItem('photobook_customer_name', state.customerName.trim());
        }
      } catch {
        // ignore
      }
    }

    setSuccess(true);
  };

  // ─── 1-Click WhatsApp Booking Dispatch URL ─────────────────────────────────
  const whatsappMessage = useMemo(() => {
    const addonsList = state.selectedAddons
      .map((id) => STUDIO_ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const venueDesc =
      state.venueType === 'studio'
        ? 'Indoor Studio Atelier (Ahmedabad)'
        : `On-Location: ${state.venueAddress || 'Outdoor Venue'}`;

    const extraHoursInfo =
      extraHours > 0
        ? `⏱️ *Extra Time:* +${extraHours} hr${extraHours > 1 ? 's' : ''} (@ ₹${hourlyRate.toLocaleString('en-IN')}/hr = +₹${extraHoursTotal.toLocaleString('en-IN')})%0A`
        : '';

    const text =
      `*PhotoBook Atelier — Booking Reservation*%0A%0A` +
      `👤 *Client:* ${encodeURIComponent(state.customerName)}%0A` +
      `📱 *Phone:* ${encodeURIComponent(state.customerPhone)}%0A` +
      `📸 *Service:* ${encodeURIComponent(state.service?.name || '')}%0A` +
      `📅 *Date:* ${encodeURIComponent(formatDate(state.date))}%0A` +
      `⏰ *Window:* ${encodeURIComponent(
        rangeSummary
          ? `${rangeSummary.startTime} – ${rangeSummary.endTime} (${rangeSummary.totalHours} hrs)`
          : '',
      )}%0A` +
      extraHoursInfo +
      `📍 *Venue:* ${encodeURIComponent(venueDesc)}%0A` +
      (addonsList ? `✨ *Add-ons:* ${encodeURIComponent(addonsList)}%0A` : '') +
      `💰 *Estimated Starting Total:* ₹${totalEstimate.toLocaleString('en-IN')}%0A%0A` +
      `Looking forward to confirming our appointment logistics!`;

    return `https://wa.me/919876543210?text=${text}`;
  }, [state, rangeSummary, totalEstimate, extraHours, extraHoursTotal, hourlyRate]);

  if (success) {
    return (
      <div className="bg-white rounded-3xl border border-[#E8E2D2] p-8 sm:p-12 text-center space-y-5 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
          Session Requested!
        </h2>
        <p className="text-xs sm:text-sm text-[#767471] max-w-md mx-auto leading-relaxed">
          Your photography booking on <strong>{formatDate(state.date)}</strong> for{' '}
          <strong>{state.customerName}</strong> has been registered. Our atelier will call you to
          confirm location logistics.
        </p>

        {/* 1-Click WhatsApp Booking Confirmation Button */}
        <div className="pt-2 max-w-sm mx-auto">
          <a
            href={whatsappMessage}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-[#20ba59] transition shadow-md"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Send Details on WhatsApp</span>
          </a>
          <span className="text-[10px] text-[#767471] block mt-1.5">
            Instant 1-click confirmation sent to Studio WhatsApp
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
          <button
            onClick={() => router.push('/bookings')}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-3 text-sm font-bold text-white hover:bg-[#333] transition"
          >
            View My Bookings <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#D9D2C2] bg-white px-6 py-3 text-sm font-bold text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const steps = ['Service & Add-ons', 'Date', 'Time Slots', 'Confirm'];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step Progress Header */}
      <div className="mb-4 sm:mb-8 px-1">
        <div className="flex items-center justify-between relative">
          {/* Background track: inset 16px (left-4 right-4) so it stops exactly at centers of step 1 & 4 */}
          <div className="absolute left-4 right-4 top-4 h-0.5 bg-[#E8E2D2] z-0" />
          {/* Active progress track: starts at left-4 and spans exactly to active step */}
          <div
            className="absolute left-4 top-4 h-0.5 bg-[#C59B27] z-0 transition-all duration-500"
            style={{ width: `calc(${((state.step - 1) / (steps.length - 1))} * (100% - 32px))` }}
          />
          {steps.map((label, i) => {
            const stepNum = (i + 1) as 1 | 2 | 3 | 4;
            const isDone = stepNum < state.step;
            const isCurrent = stepNum === state.step;
            const canClick = stepNum < state.step;
            return (
              <button
                key={label}
                type="button"
                disabled={!canClick}
                onClick={() => {
                  if (canClick) {
                    setState((p) => ({ ...p, step: stepNum }));
                  }
                }}
                className={`flex flex-col items-center gap-1.5 z-10 ${
                  canClick ? 'cursor-pointer hover:opacity-85' : 'cursor-default'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold text-xs transition-all ${
                    isDone
                      ? 'border-[#C59B27] bg-[#C59B27] text-[#1A1A1A] shadow-xs'
                      : isCurrent
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-xs ring-2 ring-[#C59B27]/30'
                      : 'border-[#D9D2C2] bg-white text-[#767471]'
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4 stroke-[3]" /> : stepNum}
                </div>
                <span
                  className={`hidden sm:block text-[10px] font-semibold uppercase tracking-wider ${
                    isCurrent ? 'text-[#1A1A1A]' : 'text-[#767471]'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile-only Step Badge */}
        <div className="text-center sm:hidden mt-2.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#997316] bg-[#C59B27]/12 border border-[#C59B27]/30 px-3 py-0.5 rounded-full shadow-2xs">
            Step {state.step} of 4: {steps[state.step - 1]}
          </span>
        </div>
      </div>

      {/* Main Wizard Content Card: Mobile-first padding */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E2D2] p-3.5 sm:p-8 shadow-xs sm:shadow-sm">
        {state.step === 1 && (
          <ServiceStep
            selected={state.service}
            selectedAddons={state.selectedAddons}
            onSelectService={(s) => setState((p) => ({ ...p, service: s, slotAssignments: [] }))}
            onToggleAddon={handleToggleAddon}
          />
        )}

        {state.step === 2 && (
          <DateStep
            selectedDate={state.date}
            onSelect={(d) => setState((p) => ({ ...p, date: d, slotAssignments: [] }))}
          />
        )}

        {state.step === 3 && (
          <SlotStep
            date={state.date}
            service={state.service}
            slotAssignments={state.slotAssignments}
            selectedPhotographerId={state.selectedPhotographerId || MAIN_PHOTOGRAPHER.id}
            onSelectPhotographer={handleSelectPhotographer}
            onSlotClick={handleSlotClick}
            onSelectDuration={handleSelectDuration}
            onClearSlots={handleClearSlots}
          />
        )}

        {state.step === 4 && (
          <ConfirmStep
            state={state}
            onChangeVenueType={(vt) => setState((p) => ({ ...p, venueType: vt }))}
            onChangeVenueAddress={(va) => setState((p) => ({ ...p, venueAddress: va }))}
            onChangeName={(v) => setState((p) => ({ ...p, customerName: v }))}
            onChangePhone={(v) => setState((p) => ({ ...p, customerPhone: v }))}
            onChangeNotes={(v) => setState((p) => ({ ...p, notes: v }))}
          />
        )}

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Step Navigation Bar */}
        <div className="mt-6 sm:mt-8 flex items-center justify-between gap-3 border-t border-[#F0ECE1] pt-4 sm:pt-5">
          {state.step > 1 ? (
            <button
              type="button"
              onClick={() => setState((p) => ({ ...p, step: (p.step - 1) as any }))}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-[#D9D2C2] bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#1A1A1A] hover:bg-[#F0ECE1] active:scale-95 transition shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-[#D9D2C2] bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#1A1A1A] hover:bg-[#F0ECE1] active:scale-95 transition shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </button>
          )}

          {state.step < 4 ? (
            <button
              type="button"
              disabled={!canProceed}
              onClick={() => setState((p) => ({ ...p, step: (p.step + 1) as any }))}
              className={`flex items-center gap-2 rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition shadow-xs active:scale-95 ${
                canProceed
                  ? 'bg-[#1A1A1A] text-white hover:bg-[#333]'
                  : 'bg-[#E8E2D2] text-[#767471] cursor-not-allowed'
              }`}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!canProceed || submitting}
              onClick={handleSubmit}
              className={`flex items-center gap-2 rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition shadow-xs active:scale-95 ${
                canProceed && !submitting
                  ? 'bg-[#C59B27] text-[#1A1A1A] hover:bg-[#D4AF37]'
                  : 'bg-[#E8E2D2] text-[#767471] cursor-not-allowed'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {submitting ? 'Reserving…' : 'Confirm Reservation'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
