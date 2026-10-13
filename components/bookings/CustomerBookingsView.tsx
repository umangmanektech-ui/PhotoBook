'use client';

import { useApp } from '@/lib/store/app-context';
import { useStudio } from '@/lib/store/studio-context';
import { STUDIO_PHOTOGRAPHERS, STUDIO_ADDONS } from '@/lib/data/studio-data';
import { TIME_SLOTS } from '@/lib/types/appointment';
import { Booking, BookingStatus } from '@/lib/types';
import {
  AlertCircle,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit2,
  Eye,
  FileText,
  Key,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CustomerBookingsViewProps {
  onNavigate: (tab: string, param?: string) => void;
  onOpenChat: (bookingId: string) => void;
}

// ─── Seeded Client Delivery Galleries (Enrich-style Photo Vault) ───────────────

const CLIENT_PHOTO_ALBUMS = [
  {
    id: 'vault-1',
    title: 'Udaipur Palace Royal Wedding Folio',
    category: 'Wedding',
    date: '12 Sep 2026',
    photographer: 'Arjun Kumar (Lead Artist)',
    photoCount: 120,
    downloadPin: 'PB-7892',
    coverImage:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'vault-2',
    title: 'Sunset Sands Pre-Wedding Series',
    category: 'Pre-Wedding',
    date: '28 Aug 2026',
    photographer: 'Priya Mehta (Associate)',
    photoCount: 45,
    downloadPin: 'PB-4410',
    coverImage:
      'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'vault-3',
    title: 'Editorial Natural Light Portrait Folio',
    category: 'Portrait',
    date: '15 Jul 2026',
    photographer: 'Rohit Shah (Associate)',
    photoCount: 32,
    downloadPin: 'PB-1902',
    coverImage:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

export function CustomerBookingsView({
  onNavigate,
  onOpenChat,
}: CustomerBookingsViewProps) {
  const { currentUser, bookings, isAuthenticated } = useApp();
  const { appointments: studioAppointments, cancelAppointment } = useStudio();

  // Top Section Switcher: Bookings vs Delivered Photo Vault (Enrich Feature #4)
  const [viewMode, setViewMode] = useState<'bookings' | 'vault'>('bookings');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed' | 'delivered'>('all');

  // Phone Number Lookup State
  const [phoneInput, setPhoneInput] = useState('');
  const [activePhone, setActivePhone] = useState<string>('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Modals state
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
  const [showSessionPass, setShowSessionPass] = useState<Booking | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState<Booking | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<(typeof CLIENT_PHOTO_ALBUMS)[0] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Load saved phone from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('photobook_customer_phone');
        if (saved && saved.trim()) {
          const cleaned = saved.trim();
          setActivePhone(cleaned);
          setPhoneInput(cleaned);
        } else if (currentUser?.phone) {
          setActivePhone(currentUser.phone);
          setPhoneInput(currentUser.phone);
        }
      } catch {
        // ignore
      }
    }
  }, [currentUser?.phone]);

  const handleSearchPhone = (overridePhone?: string) => {
    const raw = overridePhone ?? phoneInput;
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 5) {
      setPhoneError('Please enter a valid phone number (at least 5 digits)');
      return;
    }
    setPhoneError(null);
    const cleaned = raw.trim();
    setActivePhone(cleaned);
    setPhoneInput(cleaned);
    setIsEditingPhone(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('photobook_customer_phone', cleaned);
      } catch {
        // ignore
      }
    }
  };

  const handleClearPhone = () => {
    setActivePhone('');
    setPhoneInput('');
    setIsEditingPhone(true);
    setPhoneError(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('photobook_customer_phone');
      } catch {
        // ignore
      }
    }
  };

  const normalizeDigits = (val?: string) => (val || '').replace(/\D/g, '').slice(-10);
  const normalizedActive = normalizeDigits(activePhone);

  // Filter studio appointments strictly by matching normalized phone number
  const myStudioAppointments = studioAppointments.filter((a) => {
    if (!normalizedActive) return false;
    const aptDigits = normalizeDigits(a.customerPhone);
    const matchesPhone =
      aptDigits.length >= 5 &&
      (aptDigits === normalizedActive ||
        aptDigits.endsWith(normalizedActive) ||
        normalizedActive.endsWith(aptDigits));
    if (!matchesPhone) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return a.status === 'pending';
    if (activeFilter === 'confirmed') return a.status === 'confirmed';
    return false;
  });

  // Filter legacy bookings
  const myBookings = bookings.filter((b) => {
    if (!normalizedActive) return false;
    return false;
  });

  const filteredBookings = myBookings.filter((b) => {
    if (activeFilter === 'all') return true;
    return b.status === activeFilter;
  });

  const totalSessionsCount = myBookings.length + myStudioAppointments.length;

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
            <Clock className="h-3 w-3" />
            Pending Confirmation
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
            <CheckCircle2 className="h-3 w-3" />
            Confirmed
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800 uppercase tracking-wider">
            <Download className="h-3 w-3" />
            Gallery Delivered
          </span>
        );
      case 'cancelled':
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold text-red-800 uppercase tracking-wider">
            <AlertCircle className="h-3 w-3" />
            {status.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen pb-24 text-[#1A1A1A] bg-[#FBF9F5]">
      {/* Header Banner */}
      <div className="border-b border-[#E8E2D2] bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
                Enrich Atelier Experience
              </span>
              <h1 className="mt-1 text-2xl font-bold font-serif tracking-tight text-[#1A1A1A] sm:text-3xl">
                Client Portal &amp; Deliverables
              </h1>
              <p className="mt-1 text-xs text-[#767471]">
                Track reservation passes, venue logistics, and your delivered high-resolution photo vaults.
              </p>
            </div>

            <button
              onClick={() => onNavigate('book')}
              className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#333] transition"
            >
              <Camera className="h-3.5 w-3.5 text-[#C59B27]" />
              <span>Book New Session</span>
            </button>
          </div>

          {/* Primary View Switcher: Sessions vs Photo Vault (Enrich Feature #4) — Only shown after mobile number enter */}
          {activePhone && !isEditingPhone && (
            <div className="mt-6 flex border-b border-[#F0ECE1]">
              <button
                type="button"
                onClick={() => setViewMode('bookings')}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 ${
                  viewMode === 'bookings'
                    ? 'border-[#C59B27] text-[#1A1A1A]'
                    : 'border-transparent text-[#767471] hover:text-[#1A1A1A]'
                }`}
              >
                <Calendar className="h-4 w-4 text-[#C59B27]" />
                <span>My Appointments ({totalSessionsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('vault')}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 ${
                  viewMode === 'vault'
                    ? 'border-[#C59B27] text-[#1A1A1A]'
                    : 'border-transparent text-[#767471] hover:text-[#1A1A1A]'
                }`}
              >
                <Download className="h-4 w-4 text-[#C59B27]" />
                <span>Delivered Photo Vault ({CLIENT_PHOTO_ALBUMS.length} Albums)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">


        {!activePhone || isEditingPhone ? (
          /* Phone Entry Portal Card (Shown BEFORE mobile number enter) */
          <div className="mx-auto max-w-xl py-6 sm:py-10">
            <div className="rounded-3xl border border-[#E8E2D2] bg-white p-6 sm:p-10 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C59B27]/15 border border-[#C59B27]/30 text-[#997316] mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
                Patron Access
              </span>
              <h2 className="mt-1 text-2xl font-bold font-serif text-[#1A1A1A]">
                Enter Mobile Number to View Bookings &amp; Photo Vault
              </h2>
              <p className="mt-2 text-xs text-[#767471] leading-relaxed">
                Customer sign-in and passwords are not required. Enter your 10-digit mobile number to access your scheduled photography sessions, artist assignments, and delivered high-resolution photo vaults.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchPhone();
                }}
                className="mt-6 space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#767471]" />
                    <input
                      type="tel"
                      value={phoneInput}
                      autoFocus
                      onChange={(e) => {
                        setPhoneInput(e.target.value);
                        if (phoneError) setPhoneError(null);
                      }}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-3 pl-10 pr-4 text-sm font-semibold text-[#1A1A1A] placeholder:text-[#A6A4A0] focus:border-[#C59B27] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {phoneError && (
                  <div className="text-xs font-medium text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{phoneError}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] py-3 px-5 text-xs font-bold text-white hover:bg-[#333] transition shadow-xs"
                  >
                    <Search className="h-3.5 w-3.5 text-[#C59B27]" />
                    <span>View My Bookings &amp; Vault</span>
                  </button>

                  {activePhone && isEditingPhone && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneInput(activePhone);
                        setIsEditingPhone(false);
                        setPhoneError(null);
                      }}
                      className="rounded-xl border border-[#D9D2C2] bg-white py-3 px-4 text-xs font-semibold text-[#767471] hover:text-[#1A1A1A]"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Demo number quick test */}
              <div className="mt-5 pt-4 border-t border-[#F0ECE1] flex flex-wrap items-center justify-between gap-2 text-xs text-[#767471]">
                <span>Quick demo:</span>
                <button
                  type="button"
                  onClick={() => handleSearchPhone('9876543210')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFBF0] border border-[#C59B27]/40 px-3 py-1 text-[11px] font-bold text-[#997316] hover:bg-[#F4E8C1] transition"
                >
                  <Sparkles className="h-3 w-3 text-[#C59B27]" />
                  <span>Try Demo: 9876543210 (Aarav Patel)</span>
                </button>
              </div>

              {/* Key Features / Security Pillars */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#F0ECE1] text-[11px] text-[#52504E]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#C59B27] shrink-0" />
                  <span>No Password Needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#C59B27] shrink-0" />
                  <span>Track Live Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-[#C59B27] shrink-0" />
                  <span>Delivered Photo Vault</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Portal Views (Shown AFTER mobile number enter) */
          <div>
            {/* Active Phone State Banner */}
            <div className="mb-6 rounded-3xl border border-[#E8E2D2] bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#C59B27]/15 border border-[#C59B27]/30 text-[#997316]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#767471]">
                        Showing Bookings For
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Phone Verified
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-bold font-mono text-[#1A1A1A]">
                      {activePhone}
                    </div>
                    <p className="text-[11px] text-[#767471] mt-0.5">
                      {totalSessionsCount > 0
                        ? `${totalSessionsCount} active studio appointment${totalSessionsCount > 1 ? 's' : ''} found.`
                        : 'No active bookings registered under this number.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0ECE1]">
                  <button
                    type="button"
                    onClick={() => setIsEditingPhone(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] px-3.5 py-2 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F0ECE1] transition shadow-2xs"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-[#C59B27]" />
                    <span>Change Number</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearPhone}
                    className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-[#767471] hover:text-rose-600 transition"
                    title="Clear number"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ─── VIEW 1: MY APPOINTMENTS & SESSIONS ──────────────────────────────── */}
            {viewMode === 'bookings' && (
              <div>
                {/* Filter Sub-Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveFilter('all')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeFilter === 'all'
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white border border-[#E8E2D2] text-[#767471] hover:text-[#1A1A1A]'
                }`}
              >
                All Sessions ({totalSessionsCount})
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeFilter === 'pending'
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white border border-[#E8E2D2] text-[#767471] hover:text-[#1A1A1A]'
                }`}
              >
                Pending (
                {myBookings.filter((b) => b.status === 'pending').length +
                  myStudioAppointments.filter((a) => a.status === 'pending').length}
                )
              </button>
              <button
                onClick={() => setActiveFilter('confirmed')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeFilter === 'confirmed'
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white border border-[#E8E2D2] text-[#767471] hover:text-[#1A1A1A]'
                }`}
              >
                Confirmed (
                {myBookings.filter((b) => b.status === 'confirmed').length +
                  myStudioAppointments.filter((a) => a.status === 'confirmed').length}
                )
              </button>
            </div>

            {/* Studio Appointments Section */}
            {myStudioAppointments.length > 0 && (
              <div className="space-y-4 mb-8">
                <div className="space-y-4">
                  {myStudioAppointments.map((apt) => {
                    const photog = STUDIO_PHOTOGRAPHERS.find((p) => p.id === apt.photographerId);
                    const slotLabels = apt.slots
                      .map((sId) => TIME_SLOTS.find((ts) => ts.id === sId)?.label ?? sId)
                      .join(', ');

                    return (
                      <div
                        key={apt.id}
                        className="overflow-hidden rounded-3xl border-2 border-[#C59B27]/40 bg-white shadow-sm transition hover:shadow-md"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12">
                          {/* Left Thumbnail */}
                          <div className="relative h-48 md:h-auto md:col-span-3 bg-[#1A1A1A]">
                            <img
                              src={
                                photog?.avatar ??
                                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                              }
                              alt={apt.photographerName}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute top-3 left-3">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  apt.status === 'confirmed'
                                    ? 'bg-emerald-500 text-white'
                                    : apt.status === 'cancelled'
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-[#C59B27] text-[#1A1A1A]'
                                }`}
                              >
                                <Clock className="h-3 w-3" />
                                {apt.status === 'confirmed'
                                  ? 'Confirmed'
                                  : apt.status === 'cancelled'
                                  ? 'Cancelled'
                                  : 'Pending Confirmation'}
                              </span>
                            </div>
                          </div>

                          {/* Main Details */}
                          <div className="p-6 md:col-span-6 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between text-xs text-[#767471] mb-1">
                                <span>
                                  Ref: <strong className="text-[#1A1A1A]">{apt.id}</strong>
                                </span>
                                <span>{new Date(apt.createdAt).toLocaleDateString()}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold font-serif text-[#1A1A1A]">
                                  {apt.photographerName}
                                </h3>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                    photog?.role === 'main'
                                      ? 'bg-[#C59B27] text-[#1A1A1A]'
                                      : 'bg-[#F0ECE1] text-[#767471]'
                                  }`}
                                >
                                  {photog?.role === 'main' ? 'Lead Artist' : 'Associate Artist'}
                                </span>
                              </div>

                              <div className="text-xs font-semibold text-[#997316] mt-0.5">
                                {apt.serviceName} • ₹{apt.totalAmount.toLocaleString('en-IN')}+
                              </div>

                              <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs text-[#52504E]">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4 text-[#C59B27] shrink-0" />
                                  <span>{apt.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-4 w-4 text-[#C59B27] shrink-0" />
                                  <span className="font-semibold text-[#1A1A1A]">{slotLabels}</span>
                                </div>

                                {/* Venue Display (In-Studio vs On-Location) */}
                                {apt.venueAddress && (
                                  <div className="flex items-center gap-1.5 col-span-2">
                                    <MapPin className="h-4 w-4 text-[#C59B27] shrink-0" />
                                    <span>
                                      {apt.venueType === 'on-location' ? 'On-Location:' : 'Venue:'}{' '}
                                      <strong className="text-[#1A1A1A]">{apt.venueAddress}</strong>
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center gap-1.5 col-span-2">
                                  <User className="h-4 w-4 text-[#C59B27] shrink-0" />
                                  <span>
                                    Patron: {apt.customerName} ({apt.customerPhone})
                                  </span>
                                </div>

                                {/* Selected Add-ons Display */}
                                {apt.addons && apt.addons.length > 0 && (
                                  <div className="col-span-2 flex flex-wrap gap-1.5 mt-1">
                                    {apt.addons.map((addonId) => {
                                      const addon = STUDIO_ADDONS.find((a) => a.id === addonId);
                                      return (
                                        <span
                                          key={addonId}
                                          className="inline-flex items-center gap-1 rounded-lg bg-[#FFFBF0] border border-[#C59B27]/40 px-2 py-0.5 text-[10px] font-bold text-[#997316]"
                                        >
                                          <span>{addon?.icon || '✨'}</span>
                                          <span>{addon?.name || addonId}</span>
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              {apt.notes && (
                                <p className="mt-3 text-[11px] text-[#767471] italic border-l-2 border-[#D9D2C2] pl-2 line-clamp-1">
                                  &ldquo;{apt.notes}&rdquo;
                                </p>
                              )}
                            </div>

                            {/* Actions & WhatsApp button */}
                            {apt.status !== 'cancelled' && (
                              <div className="mt-4 pt-4 border-t border-[#F0ECE1] flex items-center justify-between gap-3">
                                {/* 1-Click WhatsApp Studio Button */}
                                <a
                                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                                    `Hi Arjun! Inquiry regarding my session reservation #${apt.id} (${apt.serviceName} on ${apt.date})`,
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 px-3 py-1.5 text-xs font-bold text-[#128C7E] hover:bg-[#25D366] hover:text-white transition shadow-2xs"
                                >
                                  <MessageCircle className="h-3.5 w-3.5" />
                                  <span>WhatsApp Studio</span>
                                </a>

                                <button
                                  onClick={() => {
                                    if (
                                      confirm(
                                        'Are you sure you want to cancel this studio appointment?',
                                      )
                                    ) {
                                      cancelAppointment(apt.id);
                                    }
                                  }}
                                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Cancel Session
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Right Summary Column */}
                          <div className="p-6 md:col-span-3 border-t md:border-t-0 md:border-l border-[#F0ECE1] bg-[#FBF9F5]/50 flex flex-col justify-between">
                            <div>
                              <div className="text-[11px] text-[#767471] font-semibold uppercase">
                                Total Estimate
                              </div>
                              <div className="text-2xl font-bold font-serif text-[#1A1A1A] mt-1">
                                ₹{apt.totalAmount.toLocaleString('en-IN')}
                              </div>
                              <div className="text-[10px] text-emerald-700 mt-1">
                                Pay on Shoot Day
                              </div>
                            </div>

                            <button
                              onClick={() => onNavigate('book', apt.serviceId)}
                              className="mt-4 w-full rounded-xl bg-[#1A1A1A] py-2.5 text-center text-xs font-bold text-white hover:bg-[#333] transition shadow-xs"
                            >
                              Book Another
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredBookings.length === 0 && myStudioAppointments.length === 0 && (
              <div className="rounded-3xl border border-dashed border-[#D9D2C2] bg-white p-10 sm:p-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFFBF0] border border-[#C59B27]/40 text-[#C59B27] mb-3">
                  {activePhone ? (
                    <Sparkles className="h-6 w-6" />
                  ) : (
                    <Phone className="h-6 w-6" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">
                  {activePhone
                    ? `No Bookings Found for ${activePhone}`
                    : 'Enter Your Phone Number to View Bookings'}
                </h3>
                <p className="mt-1.5 text-xs text-[#767471] max-w-md mx-auto leading-relaxed">
                  {activePhone
                    ? 'No appointments are registered under this mobile number. Double-check your number or reserve a new photoshoot.'
                    : 'Customer accounts and passwords are not required. Enter your 10-digit mobile number in the search box above to retrieve your passes and appointment details.'}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {activePhone ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingPhone(true)}
                      className="rounded-xl border border-[#D9D2C2] bg-white px-4 py-2.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#F0ECE1] transition shadow-2xs"
                    >
                      Search Another Number
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSearchPhone('9876543210')}
                      className="rounded-xl border border-[#C59B27]/40 bg-[#FFFBF0] px-4 py-2.5 text-xs font-bold text-[#997316] hover:bg-[#F4E8C1] transition shadow-2xs"
                    >
                      Try Demo: 9876543210
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onNavigate('book')}
                    className="rounded-xl bg-[#1A1A1A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#333] transition shadow-xs"
                  >
                    Book a Session
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

            {/* ─── VIEW 2: CLIENT PHOTO VAULT (ENRICH FEATURE #4) ──────────────────── */}
            {viewMode === 'vault' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">
                      Delivered Photo Vaults
                    </h2>
                    <p className="text-xs text-[#767471]">
                      High-resolution deliverables edited and mastered by our studio visualists.
                    </p>
                  </div>
                </div>

                {/* Photo Albums Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CLIENT_PHOTO_ALBUMS.map((album) => (
                    <div
                      key={album.id}
                      className="group rounded-3xl border border-[#E8E2D2] bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative h-56 overflow-hidden bg-black">
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="rounded-full bg-[#1A1A1A]/80 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#C59B27]">
                            {album.category}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="rounded-full bg-emerald-500/90 text-white px-2.5 py-0.5 text-[10px] font-bold">
                            Delivered
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <span className="text-[10px] text-[#767471] font-semibold">{album.date}</span>
                          <h3 className="font-serif text-base font-bold text-[#1A1A1A] line-clamp-1">
                            {album.title}
                          </h3>
                          <p className="text-[11px] text-[#997316] font-medium mt-0.5">
                            {album.photographer}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs py-2 border-y border-[#F0ECE1]">
                          <span className="text-[#767471]">Master Archive</span>
                          <span className="font-bold text-[#1A1A1A]">{album.photoCount} High-Res Stills</span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#767471]">Vault PIN:</span>
                          <code className="rounded bg-[#F0ECE1] px-2 py-0.5 font-mono text-xs font-bold text-[#1A1A1A]">
                            {album.downloadPin}
                          </code>
                        </div>

                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={() => setSelectedAlbum(album)}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#1A1A1A] py-2.5 text-xs font-bold text-white hover:bg-[#333] transition"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#C59B27]" />
                            <span>View Gallery</span>
                          </button>

                          <button
                            onClick={() =>
                              alert(
                                `Downloading ${album.title} Master Prints ZIP (1.4 GB)...`,
                              )
                            }
                            title="Download complete zip"
                            className="flex items-center justify-center rounded-xl border border-[#D9D2C2] bg-white px-3 py-2.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
                          >
                            <Download className="h-4 w-4 text-[#C59B27]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── ALBUM PHOTO GALLERY MODAL ────────────────────────────────────────── */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-4xl rounded-3xl border border-[#D9D2C2] bg-[#FBF9F5] p-6 sm:p-8 shadow-2xl my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D2]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
                  Private Client Gallery
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  {selectedAlbum.title}
                </h3>
                <p className="text-xs text-[#767471] mt-0.5">
                  Captured by {selectedAlbum.photographer} · {selectedAlbum.photoCount} High-Res Deliverables
                </p>
              </div>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="rounded-full p-2 text-[#767471] hover:bg-[#F0ECE1] hover:text-[#1A1A1A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Photos Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedAlbum.photos.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl h-40 sm:h-52 bg-black"
                >
                  <img
                    src={url}
                    alt={`Frame ${idx + 1}`}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#1A1A1A] shadow-md">
                      <Eye className="h-3.5 w-3.5 text-[#C59B27]" /> View Full Res
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8E2D2] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#767471]">
                <Key className="h-4 w-4 text-[#C59B27]" />
                <span>Vault PIN: <code className="font-bold text-[#1A1A1A]">{selectedAlbum.downloadPin}</code></span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() =>
                    alert(`Initiating high-resolution archive download (${selectedAlbum.photoCount} photos, 1.4 GB)...`)
                  }
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-[#C59B27] px-6 py-2.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#D4AF37] transition shadow-xs"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Full Album (ZIP)</span>
                </button>
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="rounded-xl border border-[#D9D2C2] bg-white px-4 py-2.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#F0ECE1]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── FULL-SCREEN LIGHTBOX MODAL ───────────────────────────────────────── */}
      {selectedAlbum && lightboxIndex !== null && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4 animate-in fade-in">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={() =>
              setLightboxIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : selectedAlbum.photos.length - 1,
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() =>
              setLightboxIndex((prev) =>
                prev !== null && prev < selectedAlbum.photos.length - 1 ? prev + 1 : 0,
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={selectedAlbum.photos[lightboxIndex]}
              alt={`Frame ${lightboxIndex + 1}`}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <div className="mt-3 flex items-center gap-4 text-xs text-white/80">
              <span>
                Photo {lightboxIndex + 1} of {selectedAlbum.photos.length}
              </span>
              <span>·</span>
              <button
                onClick={() =>
                  alert('Downloading original RAW master file in uncompressed format...')
                }
                className="text-[#C59B27] hover:underline font-bold flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5" /> Download Still
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
