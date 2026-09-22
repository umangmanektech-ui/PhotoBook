'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Sparkles, Check } from 'lucide-react';

interface DateRangePickerProps {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  onChange: (startDate?: string, endDate?: string) => void;
  label?: string;
  placeholder?: string;
  compact?: boolean;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  label = 'Dates',
  placeholder = 'Select date range',
  compact = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = current month, 1 = next month

  const today = new Date();
  const activeMonth = new Date(today.getFullYear(), today.getMonth() + currentMonthIndex, 1);
  const monthName = activeMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Compute days in month
  const daysInMonth = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1).getDay();

  const handleDateClick = (dateStr: string) => {
    if (!startDate || (startDate && endDate)) {
      // First click: select start date
      onChange(dateStr, undefined);
    } else if (startDate && !endDate) {
      if (dateStr < startDate) {
        // If clicked date is earlier, make it start date
        onChange(dateStr, startDate);
      } else {
        onChange(startDate, dateStr);
        setIsOpen(false);
      }
    }
  };

  const handlePreset = (preset: 'anytime' | 'weekend' | 'week' | 'month') => {
    const now = new Date();
    if (preset === 'anytime') {
      onChange(undefined, undefined);
      setIsOpen(false);
      return;
    }

    if (preset === 'weekend') {
      // upcoming Saturday to Sunday
      const day = now.getDay();
      const diffToSat = (6 - day + 7) % 7 || 7;
      const sat = new Date(now);
      sat.setDate(now.getDate() + diffToSat);
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);

      const start = sat.toISOString().split('T')[0];
      const end = sun.toISOString().split('T')[0];
      onChange(start, end);
      setIsOpen(false);
      return;
    }

    if (preset === 'week') {
      const start = now.toISOString().split('T')[0];
      const endObj = new Date(now);
      endObj.setDate(now.getDate() + 7);
      const end = endObj.toISOString().split('T')[0];
      onChange(start, end);
      setIsOpen(false);
      return;
    }

    if (preset === 'month') {
      const start = now.toISOString().split('T')[0];
      const endObj = new Date(now);
      endObj.setDate(now.getDate() + 30);
      const end = endObj.toISOString().split('T')[0];
      onChange(start, end);
      setIsOpen(false);
      return;
    }
  };

  const formattedDisplay = () => {
    if (!startDate && !endDate) return placeholder;
    if (startDate && !endDate) {
      const s = new Date(startDate);
      return `${s.toLocaleDateString('default', { month: 'short', day: 'numeric' })} → Select End Date`;
    }
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      return `${s.toLocaleDateString('default', { month: 'short', day: 'numeric' })} — ${e.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return placeholder;
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center gap-2.5 rounded-xl border border-[#E8E2D2] bg-[#FBF9F5] text-left transition hover:border-[#C59B27] ${
          compact ? 'py-1.5 px-3' : 'py-2.5 px-3.5'
        }`}
      >
        <CalendarIcon className="h-4 w-4 text-[#C59B27] shrink-0" />
        <div className="flex-1 min-w-0">
          {label && (
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#767471]">
              {label}
            </div>
          )}
          <div className="truncate text-xs font-semibold text-[#1A1A1A]">
            {formattedDisplay()}
          </div>
        </div>
        {(startDate || endDate) && (
          <div
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(undefined, undefined);
            }}
            className="rounded-full p-1 text-[#767471] hover:bg-[#E8E2D2] hover:text-[#1A1A1A]"
          >
            <X className="h-3 w-3" />
          </div>
        )}
      </button>

      {/* Popover Calendar Modal */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-[#D9D2C2] bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95">
          {/* Presets Row */}
          <div className="mb-3 flex flex-wrap gap-1.5 border-b border-[#F0ECE1] pb-3">
            <button
              type="button"
              onClick={() => handlePreset('anytime')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                !startDate && !endDate
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#F0ECE1] text-[#52504E] hover:bg-[#E8E2D2]'
              }`}
            >
              Anytime
            </button>
            <button
              type="button"
              onClick={() => handlePreset('weekend')}
              className="rounded-lg bg-[#F0ECE1] px-2.5 py-1 text-[11px] font-semibold text-[#52504E] hover:bg-[#E8E2D2] transition"
            >
              This Weekend
            </button>
            <button
              type="button"
              onClick={() => handlePreset('week')}
              className="rounded-lg bg-[#F0ECE1] px-2.5 py-1 text-[11px] font-semibold text-[#52504E] hover:bg-[#E8E2D2] transition"
            >
              Next 7 Days
            </button>
            <button
              type="button"
              onClick={() => handlePreset('month')}
              className="rounded-lg bg-[#F0ECE1] px-2.5 py-1 text-[11px] font-semibold text-[#52504E] hover:bg-[#E8E2D2] transition"
            >
              Next 30 Days
            </button>
          </div>

          {/* Month Header */}
          <div className="flex items-center justify-between px-1 mb-3">
            <button
              type="button"
              onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentMonthIndex === 0}
              className="rounded-lg p-1 text-[#767471] hover:bg-[#F0ECE1] disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="font-serif text-xs font-bold text-[#1A1A1A]">
              {monthName}
            </div>
            <button
              type="button"
              onClick={() => setCurrentMonthIndex((prev) => prev + 1)}
              className="rounded-lg p-1 text-[#767471] hover:bg-[#F0ECE1]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-[#767471] mb-1">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), dayNum);
              const dateStr = dateObj.toISOString().split('T')[0];
              const isStart = startDate === dateStr;
              const isEnd = endDate === dateStr;
              const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
              const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleDateClick(dateStr)}
                  className={`relative flex h-8 items-center justify-center rounded-lg text-xs font-medium transition ${
                    isPast
                      ? 'text-[#C7C3B8] cursor-not-allowed'
                      : isStart || isEnd
                      ? 'bg-[#1A1A1A] font-bold text-white shadow-xs'
                      : isInRange
                      ? 'bg-[#C59B27]/20 text-[#1A1A1A] font-semibold'
                      : 'text-[#1A1A1A] hover:bg-[#F0ECE1]'
                  }`}
                >
                  <span>{dayNum}</span>
                  {(isStart || isEnd) && (
                    <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#C59B27]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Manual Date Inputs */}
          <div className="mt-4 pt-3 border-t border-[#F0ECE1] grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#767471] mb-1">From Date</label>
              <input
                type="date"
                value={startDate || ''}
                onChange={(e) => onChange(e.target.value || undefined, endDate)}
                className="w-full rounded-lg border border-[#D9D2C2] bg-[#FBF9F5] p-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#767471] mb-1">To Date</label>
              <input
                type="date"
                value={endDate || ''}
                onChange={(e) => onChange(startDate, e.target.value || undefined)}
                className="w-full rounded-lg border border-[#D9D2C2] bg-[#FBF9F5] p-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27]"
              />
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-3 flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                onChange(undefined, undefined);
                setIsOpen(false);
              }}
              className="text-xs font-semibold text-[#767471] hover:text-[#1A1A1A]"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-[#1A1A1A] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#333] transition"
            >
              Apply Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
