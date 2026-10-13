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
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E8E2D2] bg-[#FBF9F5]/95 backdrop-blur-xl px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:hidden shadow-lg"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {currentUser.role !== 'photographer' ? (
          /* Public / Customer Navigation (No Login Button) */
          <>
            <button
              id="bottom-nav-home"
              onClick={() => onNavigate('home')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'home' ? 'text-[#C59B27] font-bold' : 'text-[#767471] hover:text-[#1A1A1A]'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              id="bottom-nav-portfolio"
              onClick={() => onNavigate('portfolio')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'portfolio' ? 'text-[#C59B27] font-bold' : 'text-[#767471] hover:text-[#1A1A1A]'
              }`}
            >
              <Images className="h-5 w-5" />
              <span className="text-[10px]">Portfolio</span>
            </button>

            <button
              id="bottom-nav-book"
              onClick={() => onNavigate('book')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'book' ? 'text-[#C59B27] font-bold' : 'text-[#C59B27]'
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A1A1A] text-[#C59B27] shadow-sm">
                <Camera className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-[#1A1A1A]">Book</span>
            </button>

            <button
              id="bottom-nav-photographers"
              onClick={() => onNavigate('photographers')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'photographers' ? 'text-[#C59B27] font-bold' : 'text-[#767471] hover:text-[#1A1A1A]'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-[10px]">Artists</span>
            </button>

            <button
              id="bottom-nav-bookings"
              onClick={() => onNavigate('bookings')}
              className={`relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'bookings' ? 'text-[#C59B27] font-bold' : 'text-[#767471] hover:text-[#1A1A1A]'
              }`}
            >
              <div className="relative">
                <CalendarCheck className="h-5 w-5" />
                {totalActiveBookings > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#C59B27] text-[9px] font-bold text-white">
                    {totalActiveBookings}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Bookings</span>
            </button>
          </>
        ) : (
          /* Authenticated Photographer Navigation */
          <>
            <button
              id="bottom-nav-studio"
              onClick={() => onNavigate('studio')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'studio' ? 'text-[#C59B27] font-bold' : 'text-[#767471]'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-[10px]">Studio</span>
            </button>

            <button
              id="bottom-nav-studio-bookings"
              onClick={() => onNavigate('studio-bookings')}
              className={`relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'studio-bookings' ? 'text-[#C59B27] font-bold' : 'text-[#767471]'
              }`}
            >
              <div className="relative">
                <CalendarCheck className="h-5 w-5" />
                {pendingPhotogBookings > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#C59B27] text-[9px] font-bold text-white">
                    {pendingPhotogBookings}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Requests</span>
            </button>

            <button
              id="bottom-nav-studio-portfolio"
              onClick={() => onNavigate('studio-portfolio')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'studio-portfolio' ? 'text-[#C59B27] font-bold' : 'text-[#767471]'
              }`}
            >
              <Images className="h-5 w-5" />
              <span className="text-[10px]">Works</span>
            </button>

            <button
              id="bottom-nav-studio-packages"
              onClick={() => onNavigate('studio-packages')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'studio-packages' ? 'text-[#C59B27] font-bold' : 'text-[#767471]'
              }`}
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-[10px]">Packages</span>
            </button>

            <button
              id="bottom-nav-studio-profile"
              onClick={() => onNavigate('studio-profile')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'studio-profile' ? 'text-[#C59B27] font-bold' : 'text-[#767471]'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="text-[10px]">Profile</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
