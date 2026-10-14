'use client';

import { useApp } from '@/lib/store/app-context';
import { useStudio } from '@/lib/store/studio-context';
import {
  CalendarCheck,
  Camera,
  Home,
  Images,
  LayoutDashboard,
  Settings,
  Sparkles,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export function BottomNav({ currentTab, onNavigate }: BottomNavProps) {
  const { currentUser, bookings, savedPhotographerIds, isAuthenticated } = useApp();
  const { appointments: studioAppointments } = useStudio();
  const [savedPhone, setSavedPhone] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const phone = localStorage.getItem('photobook_customer_phone');
        if (phone) setSavedPhone(phone.trim());
      } catch {
        // ignore
      }
    }
  }, []);

  const isCustomer = currentUser.role === 'customer';

  // Active bookings count for client
  const activeCustomerBookings = bookings.filter(
    (b) => b.customer_id === currentUser.id && (b.status === 'pending' || b.status === 'confirmed')
  ).length;

  const activeStudioBookings = studioAppointments.filter((a) => {
    if (!savedPhone) return false;
    const cleanSaved = savedPhone.replace(/\D/g, '').slice(-10);
    const cleanApt = (a.customerPhone || '').replace(/\D/g, '').slice(-10);
    return cleanSaved && cleanApt === cleanSaved && (a.status === 'pending' || a.status === 'confirmed');
  }).length;

  const totalActiveBookings = activeCustomerBookings + activeStudioBookings;

  // Pending inquiries for photographer
  const pendingPhotogBookings = bookings.filter(
    (b) => b.photographer_id === currentUser.id && b.status === 'pending'
  ).length;

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D2]/90 bg-[#FAF8F5]/96 backdrop-blur-xl px-2 pt-1.5 pb-[max(10px,calc(env(safe-area-inset-bottom)+8px))] sm:hidden shadow-[0_-4px_20px_rgba(26,26,26,0.06)]"
    >
      <div className="mx-auto grid grid-cols-5 max-w-md items-end">
        {currentUser.role !== 'photographer' ? (
          /* Public / Customer Navigation (No Login Button) */
          <>
            <button
              id="bottom-nav-home"
              onClick={() => onNavigate('home')}
              className={`group relative flex flex-col items-center justify-center py-1 transition-all rounded-xl ${
                currentTab === 'home'
                  ? 'text-[#C59B27]'
                  : 'text-[#767471] hover:text-[#1A1A1A] active:scale-95'
              }`}
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <Home className={`h-5 w-5 transition-transform group-hover:scale-105 ${currentTab === 'home' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight transition-colors ${currentTab === 'home' ? 'font-bold text-[#C59B27]' : 'font-medium'}`}>
                Home
              </span>
              {currentTab === 'home' ? (
                <span className="h-1 w-1 rounded-full bg-[#C59B27] mt-0.5" />
              ) : (
                <span className="h-1 w-1 mt-0.5" />
              )}
            </button>

            <button
              id="bottom-nav-portfolio"
              onClick={() => onNavigate('portfolio')}
              className={`group relative flex flex-col items-center justify-center py-1 transition-all rounded-xl ${
                currentTab === 'portfolio'
                  ? 'text-[#C59B27]'
                  : 'text-[#767471] hover:text-[#1A1A1A] active:scale-95'
              }`}
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <Images className={`h-5 w-5 transition-transform group-hover:scale-105 ${currentTab === 'portfolio' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight transition-colors ${currentTab === 'portfolio' ? 'font-bold text-[#C59B27]' : 'font-medium'}`}>
                Portfolio
              </span>
              {currentTab === 'portfolio' ? (
                <span className="h-1 w-1 rounded-full bg-[#C59B27] mt-0.5" />
              ) : (
                <span className="h-1 w-1 mt-0.5" />
              )}
            </button>

            {/* Hero Center Floating CTA: Book */}
            <button
              id="bottom-nav-book"
              onClick={() => onNavigate('book')}
              className="group relative flex flex-col items-center justify-center py-1 transition-all active:scale-95"
            >
              <div
                className={`-mt-5 flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-200 shadow-md ${
                  currentTab === 'book'
                    ? 'bg-[#C59B27] text-[#1A1A1A] border-white ring-4 ring-[#C59B27]/30 shadow-[#C59B27]/40 scale-105'
                    : 'bg-[#1A1A1A] text-[#C59B27] border-white/90 ring-2 ring-[#E8E2D2] hover:scale-105 shadow-black/10'
                }`}
              >
                <Camera className={`h-5 w-5 ${currentTab === 'book' ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              </div>
              <span
                className={`text-[11px] mt-1 tracking-tight transition-colors ${
                  currentTab === 'book' ? 'font-bold text-[#C59B27]' : 'font-bold text-[#1A1A1A]'
                }`}
              >
                Book
              </span>
              {currentTab === 'book' ? (
                <span className="h-1 w-1 rounded-full bg-[#C59B27] mt-0.5" />
              ) : (
                <span className="h-1 w-1 mt-0.5" />
              )}
            </button>

            <button
              id="bottom-nav-photographers"
              onClick={() => onNavigate('photographers')}
              className={`group relative flex flex-col items-center justify-center py-1 transition-all rounded-xl ${
                currentTab === 'photographers'
                  ? 'text-[#C59B27]'
                  : 'text-[#767471] hover:text-[#1A1A1A] active:scale-95'
              }`}
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <User className={`h-5 w-5 transition-transform group-hover:scale-105 ${currentTab === 'photographers' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight transition-colors ${currentTab === 'photographers' ? 'font-bold text-[#C59B27]' : 'font-medium'}`}>
                Artists
              </span>
              {currentTab === 'photographers' ? (
                <span className="h-1 w-1 rounded-full bg-[#C59B27] mt-0.5" />
              ) : (
                <span className="h-1 w-1 mt-0.5" />
              )}
            </button>

            <button
              id="bottom-nav-bookings"
              onClick={() => onNavigate('bookings')}
              className={`group relative flex flex-col items-center justify-center py-1 transition-all rounded-xl ${
                currentTab === 'bookings'
                  ? 'text-[#C59B27]'
                  : 'text-[#767471] hover:text-[#1A1A1A] active:scale-95'
              }`}
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <CalendarCheck className={`h-5 w-5 transition-transform group-hover:scale-105 ${currentTab === 'bookings' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
                {totalActiveBookings > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#C59B27] text-[9px] font-bold text-white shadow-xs ring-1 ring-white">
                    {totalActiveBookings}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight transition-colors ${currentTab === 'bookings' ? 'font-bold text-[#C59B27]' : 'font-medium'}`}>
                Bookings
              </span>
              {currentTab === 'bookings' ? (
                <span className="h-1 w-1 rounded-full bg-[#C59B27] mt-0.5" />
              ) : (
                <span className="h-1 w-1 mt-0.5" />
              )}
            </button>
          </>
        ) : (
          /* Authenticated Photographer Navigation */
          <>
            <button
              id="bottom-nav-studio"
              onClick={() => onNavigate('studio')}
              className={`group relative flex flex-col items-center justify-center py-1 transition-all rounded-xl ${
                currentTab === 'studio'
                  ? 'text-[#C59B27]'
                  : 'text-[#767471] hover:text-[#1A1A1A] active:scale-95'
              }`}
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <LayoutDashboard className={`h-5 w-5 transition-transform group-hover:scale-105 ${currentTab === 'studio' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight transition-colors ${currentTab === 'studio' ? 'font-bold text-[#C59B27]' : 'font-medium'}`}>
                Studio
              </span>
              {currentTab === 'studio' ? (
                <span className="h-1 w-1 rounded-full bg-[#C59B27] mt-0.5" />
              ) : (
                <span className="h-1 w-1 mt-0.5" />
              )}
            </button>

            <button
              id="bottom-nav-studio-bookings"
              onClick={() => onNavigate('studio-bookings')}
              className={`group relative flex flex-col items-center justify-center py-1 transition-all rounded-xl ${
                currentTab === 'studio-bookings'
                  ? 'text-[#C59B27]'
                  : 'text-[#767471] hover:text-[#1A1A1A] active:scale-95'
              }`}
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <CalendarCheck className={`h-5 w-5 transition-transform group-hover:scale-105 ${currentTab === 'studio-bookings' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
                {pendingPhotogBookings > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#C59B27] text-[9px] font-bold text-white shadow-xs ring-1 ring-white">
                    {pendingPhotogBookings}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight transition-colors ${currentTab === 'studio-bookings' ? 'font-bold text-[#C59B27]' : 'font-medium'}`}>
                Requests
              </span>
              {currentTab === 'studio-bookings' ? (
                <span className="h-1 w-1 rounded-full bg-[#C59B27] mt-0.5" />
              ) : (
                <span className="h-1 w-1 mt-0.5" />
              )}
            </button>

            <button
              id="bottom-nav-studio-portfolio"
              onClick={() => onNavigate('studio-portfolio')}
              className={`group relative flex flex-col items-center justify-center py-1 transition-all rounded-xl ${
                currentTab === 'studio-portfolio'
                  ? 'text-[#C59B27]'
                  : 'text-[#767471] hover:text-[#1A1A1A] active:scale-95'
              }`}
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <Images className={`h-5 w-5 transition-transform group-hover:scale-105 ${currentTab === 'studio-portfolio' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight transition-colors ${currentTab === 'studio-portfolio' ? 'font-bold text-[#C59B27]' : 'font-medium'}`}>
                Works
              </span>
              {currentTab === 'studio-portfolio' ? (
                <span className="h-1 w-1 rounded-full bg-[#C59B27] mt-0.5" />
              ) : (
                <span className="h-1 w-1 mt-0.5" />
              )}
            </button>

            <button
              id="bottom-nav-studio-packages"
              onClick={() => onNavigate('studio-packages')}
              className={`group relative flex flex-col items-center justify-center py-1 transition-all rounded-xl ${
                currentTab === 'studio-packages'
                  ? 'text-[#C59B27]'
                  : 'text-[#767471] hover:text-[#1A1A1A] active:scale-95'
              }`}
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <Sparkles className={`h-5 w-5 transition-transform group-hover:scale-105 ${currentTab === 'studio-packages' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight transition-colors ${currentTab === 'studio-packages' ? 'font-bold text-[#C59B27]' : 'font-medium'}`}>
                Packages
              </span>
              {currentTab === 'studio-packages' ? (
                <span className="h-1 w-1 rounded-full bg-[#C59B27] mt-0.5" />
              ) : (
                <span className="h-1 w-1 mt-0.5" />
              )}
            </button>

            <button
              id="bottom-nav-studio-profile"
              onClick={() => onNavigate('studio-profile')}
              className={`group relative flex flex-col items-center justify-center py-1 transition-all rounded-xl ${
                currentTab === 'studio-profile'
                  ? 'text-[#C59B27]'
                  : 'text-[#767471] hover:text-[#1A1A1A] active:scale-95'
              }`}
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <Settings className={`h-5 w-5 transition-transform group-hover:scale-105 ${currentTab === 'studio-profile' ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight transition-colors ${currentTab === 'studio-profile' ? 'font-bold text-[#C59B27]' : 'font-medium'}`}>
                Profile
              </span>
              {currentTab === 'studio-profile' ? (
                <span className="h-1 w-1 rounded-full bg-[#C59B27] mt-0.5" />
              ) : (
                <span className="h-1 w-1 mt-0.5" />
              )}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
