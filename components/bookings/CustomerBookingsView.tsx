'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import {
  Calendar,
  MapPin,
  Clock,
  MessageSquare,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Key,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Eye,
  FileText
} from 'lucide-react';
import { Booking, BookingStatus } from '@/lib/types';

interface CustomerBookingsViewProps {
  onNavigate: (tab: string, param?: string) => void;
  onOpenChat: (bookingId: string) => void;
}

export function CustomerBookingsView({ onNavigate, onOpenChat }: CustomerBookingsViewProps) {
  const { currentUser, bookings, updateBookingStatus } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed' | 'delivered'>('all');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
  const [showSessionPass, setShowSessionPass] = useState<Booking | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState<Booking | null>(null);

  // Customer bookings
  const myBookings = bookings.filter((b) => b.customer_id === currentUser.id);

  const filteredBookings = myBookings.filter((b) => {
    if (activeFilter === 'all') return true;
    return b.status === activeFilter;
  });

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
    <div className="min-h-screen pb-24 text-[#1A1A1A]">
      {/* Header matching Image 10 */}
      <div className="border-b border-[#E8E2D2] bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
                Curated Schedule
              </span>
              <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
                My Bookings ({myBookings.length})
              </h1>
              <p className="mt-1 text-xs text-[#767471]">
                Monitor your reservation statuses, session passes, deliverables, and artist conversations.
              </p>
            </div>

            <button
              onClick={() => onNavigate('explore')}
              className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-[#FBF9F5] shadow-xs hover:bg-[#333] transition"
            >
              <span>Explore New Artists</span>
              <ChevronRight className="h-3.5 w-3.5 text-[#C59B27]" />
            </button>
          </div>

          {/* Filter Tabs matching Image 10 */}
          <div className="mt-6 flex gap-2 border-t border-[#F0ECE1] pt-4 overflow-x-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeFilter === 'all'
                  ? 'bg-[#1A1A1A] text-[#FBF9F5]'
                  : 'bg-[#F0ECE1] text-[#767471] hover:text-[#1A1A1A]'
              }`}
            >
              All Sessions ({myBookings.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeFilter === 'pending'
                  ? 'bg-[#1A1A1A] text-[#FBF9F5]'
                  : 'bg-[#F0ECE1] text-[#767471] hover:text-[#1A1A1A]'
              }`}
            >
              Pending ({myBookings.filter((b) => b.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveFilter('confirmed')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeFilter === 'confirmed'
                  ? 'bg-[#1A1A1A] text-[#FBF9F5]'
                  : 'bg-[#F0ECE1] text-[#767471] hover:text-[#1A1A1A]'
              }`}
            >
              Upcoming ({myBookings.filter((b) => b.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setActiveFilter('delivered')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeFilter === 'delivered'
                  ? 'bg-[#1A1A1A] text-[#FBF9F5]'
                  : 'bg-[#F0ECE1] text-[#767471] hover:text-[#1A1A1A]'
              }`}
            >
              Delivered ({myBookings.filter((b) => b.status === 'delivered').length})
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredBookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D9D2C2] bg-white p-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-[#C59B27]" />
            <h3 className="mt-3 font-serif text-lg font-bold text-[#1A1A1A]">No Bookings Found</h3>
            <p className="mt-1 text-xs text-[#767471]">
              You don&apos;t have any bookings matching this status.
            </p>
            <button
              onClick={() => onNavigate('explore')}
              className="mt-4 rounded-xl bg-[#1A1A1A] px-5 py-2.5 text-xs font-semibold text-white shadow-xs"
            >
              Find a Photographer
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="overflow-hidden rounded-3xl border border-[#E8E2D2] bg-white shadow-sm transition hover:shadow-md hover:border-[#C59B27]/40"
              >
                <div className="grid grid-cols-1 md:grid-cols-12">
                  {/* Left Photographer Thumbnail */}
                  <div className="relative h-48 md:h-auto md:col-span-3 bg-zinc-900">
                    <img
                      src={booking.photographer_image}
                      alt={booking.photographer_name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  {/* Main Details Column */}
                  <div className="p-6 md:col-span-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#767471] mb-1">
                        <span>Ref Code: <strong className="text-[#1A1A1A]">{booking.booking_code}</strong></span>
                        <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                        {booking.photographer_name}
                      </h3>
                      <div className="text-xs font-semibold text-[#997316]">
                        {booking.package_name} • ₹{booking.total_price.toLocaleString('en-IN')}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[#52504E]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-[#C59B27] shrink-0" />
                          <span>{booking.event_date} ({booking.duration_hours}h)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-[#C59B27] shrink-0" />
                          <span>{booking.event_time_start} – {booking.event_time_end}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <MapPin className="h-4 w-4 text-[#C59B27] shrink-0" />
                          <span className="truncate">{booking.venue_name}, {booking.venue_address}</span>
                        </div>
                      </div>

                      {booking.creative_notes && (
                        <p className="mt-3 text-[11px] text-[#767471] italic border-l-2 border-[#D9D2C2] pl-2 line-clamp-1">
                          &ldquo;{booking.creative_notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#F0ECE1] flex items-center gap-3">
                      <button
                        onClick={() => setSelectedBookingDetails(booking)}
                        className="text-xs font-semibold text-[#1A1A1A] hover:text-[#C59B27] flex items-center gap-1"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        View Full Details
                      </button>

                      <button
                        onClick={() => onOpenChat(booking.id)}
                        className="text-xs font-semibold text-[#1A1A1A] hover:text-[#C59B27] flex items-center gap-1"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-[#C59B27]" />
                        Message Artist
                      </button>
                    </div>
                  </div>

                  {/* Right Actions Column matching Image 10 */}
                  <div className="p-6 md:col-span-3 border-t md:border-t-0 md:border-l border-[#F0ECE1] flex flex-col justify-center gap-2.5 bg-[#FBF9F5]">
                    {booking.status === 'pending' && (
                      <>
                        <div className="text-center mb-1">
                          <div className="text-[10px] uppercase font-bold text-[#767471]">Status</div>
                          <div className="text-xs font-semibold text-amber-700">Awaiting Artist Approval</div>
                        </div>

                        <button
                          onClick={() => setSelectedBookingDetails(booking)}
                          className="w-full rounded-xl bg-[#1A1A1A] py-2.5 text-xs font-semibold text-white hover:bg-[#333] transition"
                        >
                          View Details & Notes
                        </button>

                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to cancel this reservation request?')) {
                              updateBookingStatus(booking.id, 'cancelled');
                            }
                          }}
                          className="w-full rounded-xl border border-red-200 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          Cancel Reservation Request
                        </button>
                      </>
                    )}

                    {booking.status === 'confirmed' && (
                      <>
                        <div className="text-center mb-1">
                          <div className="text-[10px] uppercase font-bold text-[#2D6A4F]">Verified Date</div>
                          <div className="text-xs font-bold text-[#1A1A1A]">Ready for Shoot</div>
                        </div>

                        <button
                          onClick={() => setShowSessionPass(booking)}
                          className="w-full rounded-xl bg-[#C59B27] py-2.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#D4AF37] transition shadow-xs"
                        >
                          View Session Pass
                        </button>

                        <button
                          onClick={() => setSelectedBookingDetails(booking)}
                          className="w-full rounded-xl border border-[#D9D2C2] bg-white py-2 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
                        >
                          Booking Details
                        </button>
                      </>
                    )}

                    {booking.status === 'delivered' && (
                      <>
                        <div className="text-center mb-1">
                          <div className="text-[10px] uppercase font-bold text-indigo-700">Photos Ready</div>
                          <div className="text-xs font-bold text-[#1A1A1A]">
                            {booking.delivered_photos_count || 340} Master Photographs
                          </div>
                        </div>

                        <button
                          onClick={() => setShowGalleryModal(booking)}
                          className="w-full rounded-xl bg-[#1A1A1A] py-2.5 text-xs font-bold text-white hover:bg-[#333] transition flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Download className="h-4 w-4 text-[#C59B27]" />
                          <span>Open Full Gallery</span>
                        </button>

                        <div className="text-center text-[10px] text-[#767471] mt-1">
                          PIN: <code className="font-bold text-[#1A1A1A]">{booking.delivered_gallery_pin || 'PB-7892'}</code>
                        </div>
                      </>
                    )}

                    {booking.status === 'cancelled' && (
                      <div className="text-center text-xs text-[#767471] py-4">
                        Reservation request has been cancelled.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Session Pass Modal */}
      {showSessionPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#D9D2C2] bg-[#FBF9F5] p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D2]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D6A4F]">Confirmed Pass</span>
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">PhotoBook Official Session Pass</h3>
              </div>
              <button onClick={() => setShowSessionPass(null)}>
                <X className="h-5 w-5 text-[#767471]" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-[#C59B27]/40 bg-white p-5 shadow-xs">
              <div className="flex justify-between items-start pb-4 border-b border-[#F0ECE1]">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1A1A1A]">
                    {showSessionPass.photographer_name}
                  </h4>
                  <div className="text-xs text-[#767471]">{showSessionPass.package_name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-[#767471]">Pass Code</div>
                  <div className="font-mono text-sm font-bold text-[#C59B27]">{showSessionPass.booking_code}</div>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-[#52504E]">
                <div className="flex justify-between">
                  <span className="text-[#767471]">Patron:</span>
                  <span className="font-bold text-[#1A1A1A]">{showSessionPass.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#767471]">Date:</span>
                  <span className="font-bold text-[#1A1A1A]">{showSessionPass.event_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#767471]">Time Window:</span>
                  <span className="font-bold text-[#1A1A1A]">{showSessionPass.event_time_start} – {showSessionPass.event_time_end}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#767471]">Venue:</span>
                  <span className="font-bold text-[#1A1A1A] text-right truncate max-w-[200px]">{showSessionPass.venue_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#767471]">Total Fee:</span>
                  <span className="font-bold text-[#1A1A1A]">₹{showSessionPass.total_price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-[#F0ECE1]/50 p-3 text-[11px] text-[#52504E] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#2D6A4F] shrink-0" />
                <span>Present this pass to the photography team upon arrival at the venue.</span>
              </div>
            </div>

            <button
              onClick={() => setShowSessionPass(null)}
              className="mt-6 w-full rounded-xl bg-[#1A1A1A] py-2.5 text-xs font-semibold text-white"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      {/* Gallery Delivered Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-[#D9D2C2] bg-[#FBF9F5] p-6 shadow-2xl animate-in zoom-in-95 my-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D2]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">Private Cloud Vault</span>
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                  Client Delivery Gallery • {showGalleryModal.photographer_name}
                </h3>
              </div>
              <button onClick={() => setShowGalleryModal(null)}>
                <X className="h-5 w-5 text-[#767471]" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#1A1A1A] p-4 text-white">
              <div>
                <div className="text-xs text-[#A6A4A0]">340 Color-Graded RAW & High-Res Stills</div>
                <div className="font-serif text-base font-bold text-[#C59B27]">Full Uncompressed Master Archive</div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 text-xs">
                <Key className="h-3.5 w-3.5 text-[#C59B27]" />
                <span>PIN: <strong>{showGalleryModal.delivered_gallery_pin || 'PB-7892'}</strong></span>
              </div>
            </div>

            {/* Simulated Photo Grid */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <img
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80"
                alt="Frame 1"
                className="h-32 w-full rounded-xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"
                alt="Frame 2"
                className="h-32 w-full rounded-xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80"
                alt="Frame 3"
                className="h-32 w-full rounded-xl object-cover"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => alert('Downloading zip bundle: Master_Prints_ColorGraded.zip (1.2 GB)...')}
                className="flex-1 rounded-xl bg-[#C59B27] py-3 text-xs font-bold text-[#1A1A1A] hover:bg-[#D4AF37] transition flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Download All High-Res (ZIP)</span>
              </button>
              <button
                onClick={() => setShowGalleryModal(null)}
                className="rounded-xl border border-[#D9D2C2] bg-white px-5 py-3 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F0ECE1]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-[#D9D2C2] bg-[#FBF9F5] p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D2]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#767471]">
                  Reservation Snapshot
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  {selectedBookingDetails.booking_code}
                </h3>
              </div>
              <button onClick={() => setSelectedBookingDetails(null)}>
                <X className="h-5 w-5 text-[#767471]" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#767471]">Visualist:</span>
                <span className="font-bold text-[#1A1A1A]">{selectedBookingDetails.photographer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#767471]">Collection:</span>
                <span className="font-bold text-[#1A1A1A]">{selectedBookingDetails.package_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#767471]">Date & Hours:</span>
                <span className="font-bold text-[#1A1A1A]">{selectedBookingDetails.event_date} ({selectedBookingDetails.duration_hours}h)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#767471]">Occasion:</span>
                <span className="font-bold text-[#1A1A1A]">{selectedBookingDetails.event_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#767471]">Venue:</span>
                <span className="font-bold text-[#1A1A1A] text-right truncate max-w-[240px]">{selectedBookingDetails.venue_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#767471]">Total Commission:</span>
                <span className="font-bold text-[#1A1A1A]">₹{selectedBookingDetails.total_price.toLocaleString('en-IN')}</span>
              </div>
              {selectedBookingDetails.creative_notes && (
                <div className="pt-2 border-t border-[#F0ECE1]">
                  <span className="text-[#767471] block mb-1">Creative Instructions:</span>
                  <div className="rounded-xl bg-white p-2.5 text-[#52504E] italic border border-[#E8E2D2]">
                    {selectedBookingDetails.creative_notes}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBookingDetails(null)}
              className="mt-6 w-full rounded-xl bg-[#1A1A1A] py-2.5 text-xs font-semibold text-white"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
