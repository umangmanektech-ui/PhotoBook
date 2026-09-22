"use client";

import {
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export interface InteractiveCalendarProps {
  selectedDate?: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  minDate?: string; // YYYY-MM-DD, defaults to today
  maxDate?: string; // YYYY-MM-DD, defaults to 24 months from now
  checkAvailability?: (date: string) => {
    isAvailable: boolean;
    reason?: string;
  };
  blockedDates?: string[];
  bookedDates?: string[];
  mode?: "booking" | "view" | "manage";
  onToggleDateBlock?: (date: string) => void;
  className?: string;
  showShortcuts?: boolean;
}

function formatDateToISO(year: number, month: number, day: number): string {
  const y = year.toString();
  const m = (month + 1).toString().padStart(2, "0");
  const d = day.toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getTodayISO(): string {
  const now = new Date();
  return formatDateToISO(now.getFullYear(), now.getMonth(), now.getDate());
}

export function InteractiveCalendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
  checkAvailability,
  blockedDates = [],
  bookedDates = [],
  mode = "booking",
  onToggleDateBlock,
  className = "",
  showShortcuts = true,
}: InteractiveCalendarProps) {
  const todayISO = useMemo(() => getTodayISO(), []);
  const effectiveMinDate = minDate || todayISO;

  // Determine initial displayed month/year
  const initialDateObj = useMemo(() => {
    if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      const [y, m] = selectedDate.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, [selectedDate]);

  const [currentViewDate, setCurrentViewDate] = useState<Date>(initialDateObj);

  // If selectedDate changes from outside (e.g. passed from another view), sync the month view
  useEffect(() => {
    if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      const [y, m] = selectedDate.split("-").map(Number);
      setCurrentViewDate(new Date(y, m - 1, 1));
    }
  }, [selectedDate]);

  const currentYear = currentViewDate.getFullYear();
  const currentMonth = currentViewDate.getMonth();

  const monthName = currentViewDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleJumpToMonthOffset = (offsetMonths: number) => {
    const now = new Date();
    setCurrentViewDate(
      new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1),
    );
  };

  // Calendar calculations
  const calendarGrid = useMemo(() => {
    // First day of current month (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    // Total days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // Total days in previous month
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: Array<{
      dayNumber: number;
      dateISO: string;
      isCurrentMonth: boolean;
      isPast: boolean;
      isToday: boolean;
      isSelected: boolean;
      isBlocked: boolean;
      isBooked: boolean;
      isAvailable: boolean;
      reason?: string;
    }> = [];

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonth - 1, prevDay);
      const dateISO = formatDateToISO(
        prevDate.getFullYear(),
        prevDate.getMonth(),
        prevDay,
      );
      days.push({
        dayNumber: prevDay,
        dateISO,
        isCurrentMonth: false,
        isPast: dateISO < effectiveMinDate,
        isToday: dateISO === todayISO,
        isSelected: dateISO === selectedDate,
        isBlocked: blockedDates.includes(dateISO),
        isBooked: bookedDates.includes(dateISO),
        isAvailable: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateISO = formatDateToISO(currentYear, currentMonth, d);
      const isPast = dateISO < effectiveMinDate;
      const isToday = dateISO === todayISO;
      const isSelected = dateISO === selectedDate;
      const isBlocked = blockedDates.includes(dateISO);
      const isBooked = bookedDates.includes(dateISO);

      let isAvailable = !isPast && !isBlocked && !isBooked;
      let reason: string | undefined;

      if (checkAvailability && !isPast) {
        const availCheck = checkAvailability(dateISO);
        isAvailable = availCheck.isAvailable;
        reason = availCheck.reason;
      }

      days.push({
        dayNumber: d,
        dateISO,
        isCurrentMonth: true,
        isPast,
        isToday,
        isSelected,
        isBlocked,
        isBooked,
        isAvailable,
        reason,
      });
    }

    // Trailing days to fill the final week grid row
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length;
    for (let d = 1; d <= remainingCells; d++) {
      const nextDate = new Date(currentYear, currentMonth + 1, d);
      const dateISO = formatDateToISO(
        nextDate.getFullYear(),
        nextDate.getMonth(),
        d,
      );
      days.push({
        dayNumber: d,
        dateISO,
        isCurrentMonth: false,
        isPast: dateISO < effectiveMinDate,
        isToday: dateISO === todayISO,
        isSelected: dateISO === selectedDate,
        isBlocked: blockedDates.includes(dateISO),
        isBooked: bookedDates.includes(dateISO),
        isAvailable: false,
      });
    }

    return days;
  }, [
    currentYear,
    currentMonth,
    effectiveMinDate,
    todayISO,
    selectedDate,
    blockedDates,
    bookedDates,
    checkAvailability,
  ]);

  const handleCellClick = (cell: (typeof calendarGrid)[0]) => {
    if (mode === "manage") {
      if (onToggleDateBlock && cell.isCurrentMonth) {
        onToggleDateBlock(cell.dateISO);
      }
      return;
    }

    if (!cell.isCurrentMonth) {
      // If clicking adjacent month, navigate there
      const [y, m] = cell.dateISO.split("-").map(Number);
      setCurrentViewDate(new Date(y, m - 1, 1));
      if (!cell.isPast && cell.isAvailable) {
        onSelectDate(cell.dateISO);
      }
      return;
    }

    if (cell.isPast) return;
    if (!cell.isAvailable && mode === "booking") return;

    onSelectDate(cell.dateISO);
  };

  return (
    <div
      className={`rounded-3xl border border-[#E8E2D2] bg-white p-4 sm:p-6 shadow-xs ${className}`}
    >
      {/* Month Header & Quick Navigation */}
      <div className="flex flex-col gap-3 pb-4 border-b border-[#F0ECE1]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0ECE1] text-[#1A1A1A]">
              <CalendarIcon className="h-4 w-4 text-[#C59B27]" />
            </div>
            <div>
              <h3 className=" text-lg font-bold text-[#1A1A1A] leading-none">
                {monthName}
              </h3>
              <p className="text-[11px] text-[#767471] mt-0.5">
                {mode === "manage"
                  ? "Click dates to toggle availability locks"
                  : "Live verified availability"}
              </p>
            </div>
          </div>

          {/* Prev / Next Month Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E8E2D2] bg-[#FBF9F5] text-[#52504E] transition hover:border-[#C59B27] hover:bg-white hover:text-[#1A1A1A]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E8E2D2] bg-[#FBF9F5] text-[#52504E] transition hover:border-[#C59B27] hover:bg-white hover:text-[#1A1A1A]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Month Jump Shortcuts */}
        {showShortcuts && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#767471] shrink-0 mr-1">
              Jump:
            </span>
            <button
              type="button"
              onClick={() => handleJumpToMonthOffset(0)}
              className="shrink-0 rounded-lg bg-[#F0ECE1]/80 px-2.5 py-1 text-[10px] font-semibold text-[#52504E] hover:bg-[#E8E2D2] hover:text-[#1A1A1A] transition"
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => handleJumpToMonthOffset(1)}
              className="shrink-0 rounded-lg bg-[#FAF3DD] px-2.5 py-1 text-[10px] font-bold text-[#997316] hover:bg-[#F4E8C1] transition"
            >
              Next Month →
            </button>
            <button
              type="button"
              onClick={() => handleJumpToMonthOffset(2)}
              className="shrink-0 rounded-lg bg-[#F0ECE1]/80 px-2.5 py-1 text-[10px] font-semibold text-[#52504E] hover:bg-[#E8E2D2] hover:text-[#1A1A1A] transition"
            >
              In 2 Months
            </button>
            <button
              type="button"
              onClick={() => handleJumpToMonthOffset(3)}
              className="shrink-0 rounded-lg bg-[#F0ECE1]/80 px-2.5 py-1 text-[10px] font-semibold text-[#52504E] hover:bg-[#E8E2D2] hover:text-[#1A1A1A] transition"
            >
              In 3 Months
            </button>
          </div>
        )}
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center pt-3 pb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, idx) => (
          <div
            key={d}
            className={`py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
              idx === 0 || idx === 6 ? "text-[#C59B27]" : "text-[#767471]"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {calendarGrid.map((cell, idx) => {
          if (!cell.isCurrentMonth) {
            return (
              <button
                key={`adj-${idx}`}
                type="button"
                onClick={() => handleCellClick(cell)}
                className="flex h-12 sm:h-14 flex-col items-center justify-center rounded-xl text-[11px] font-medium text-[#C8C4BC] opacity-50 hover:opacity-80 transition"
              >
                <span>{cell.dayNumber}</span>
              </button>
            );
          }

          if (mode === "manage") {
            return (
              <button
                key={cell.dateISO}
                type="button"
                onClick={() => handleCellClick(cell)}
                className={`relative flex h-12 sm:h-14 flex-col items-center justify-center rounded-xl border text-xs font-semibold transition ${
                  cell.isBooked
                    ? "border-[#2D6A4F] bg-[#2D6A4F] text-white shadow-xs"
                    : cell.isBlocked
                      ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      : "border-[#E8E2D2] bg-[#FBF9F5] text-[#1A1A1A] hover:border-[#C59B27] hover:bg-white"
                }`}
              >
                <span className="text-sm font-bold">{cell.dayNumber}</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-medium mt-0.5">
                  {cell.isBooked
                    ? "Booked"
                    : cell.isBlocked
                      ? "Blocked"
                      : "Open"}
                </span>
                {cell.isToday && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#C59B27]" />
                )}
              </button>
            );
          }

          // Booking / View mode
          const isSelectable = !cell.isPast && cell.isAvailable;

          return (
            <button
              key={cell.dateISO}
              type="button"
              disabled={!isSelectable && !cell.isSelected}
              onClick={() => handleCellClick(cell)}
              title={
                cell.reason ||
                (cell.isAvailable ? "Available for booking" : "Unavailable")
              }
              className={`relative flex h-12 sm:h-14 flex-col items-center justify-center rounded-xl border text-xs font-semibold transition ${
                cell.isSelected
                  ? "border-[#C59B27] bg-[#C59B27] text-white shadow-md ring-2 ring-[#C59B27]/40 z-10 scale-[1.02]"
                  : cell.isPast
                    ? "cursor-not-allowed border-transparent bg-transparent text-[#B8B4AA] opacity-40"
                    : !cell.isAvailable
                      ? "cursor-not-allowed border-transparent bg-[#F0ECE1]/70 text-[#8C8880]"
                      : "cursor-pointer border-[#E8E2D2] bg-[#FBF9F5] text-[#1A1A1A] hover:border-[#C59B27] hover:bg-white hover:shadow-xs"
              }`}
            >
              <span
                className={`text-sm ${cell.isSelected ? "font-bold" : "font-semibold"}`}
              >
                {cell.dayNumber}
              </span>

              <span
                className={`text-[8px] sm:text-[9px] font-medium tracking-tight mt-0.5 ${
                  cell.isSelected
                    ? "text-white font-bold"
                    : cell.isPast
                      ? "text-[#A09D96]"
                      : !cell.isAvailable
                        ? "text-[#767471]"
                        : "text-[#2D6A4F] font-semibold"
                }`}
              >
                {cell.isSelected
                  ? "Selected"
                  : cell.isPast
                    ? "Past"
                    : !cell.isAvailable
                      ? "Engaged"
                      : "Free"}
              </span>

              {cell.isToday && !cell.isSelected && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#C59B27]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend & Selected Date Summary */}
      <div className="mt-4 pt-4 border-t border-[#F0ECE1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-[11px] text-[#767471]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-md border border-[#E8E2D2] bg-[#FBF9F5]" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-md bg-[#F0ECE1] border border-transparent" />
            <span>Engaged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-md bg-[#C59B27]" />
            <span className="font-semibold text-[#1A1A1A]">Selected</span>
          </div>
        </div>

        {selectedDate && (
          <div className="flex items-center gap-1.5 rounded-xl bg-[#FAF3DD] px-3 py-1 text-xs font-bold text-[#1A1A1A]">
            <Check className="h-3.5 w-3.5 text-[#997316]" />
            <span>Date: {selectedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
