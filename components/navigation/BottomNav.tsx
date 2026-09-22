'use client';

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import {
  Compass,
  CalendarCheck,
  User,
  LayoutDashboard,
  Sparkles,
  Images,
  Heart,
  Home,
  Settings,
  LogIn
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export function BottomNav({ currentTab, onNavigate }: BottomNavProps) {
  const { currentUser, bookings, savedPhotographerIds, isAuthenticated } = useApp();

  const isCustomer = currentUser.role === 'customer';

  // Active bookings count for client
  const activeCustomerBookings = bookings.filter(
    (b) => b.customer_id === currentUser.id && (b.status === 'pending' || b.status === 'confirmed')
  ).length;

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
        {!isAuthenticated ? (
          /* Signed Out / Guest Navigation: No Profile or Bookings */
          <>
            <button
              id="bottom-nav-home"
              onClick={() => onNavigate('home')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-3 transition rounded-xl ${
                currentTab === 'home' ? 'text-[#C59B27] font-bold' : 'text-[#767471] hover:text-[#1A1A1A]'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              id="bottom-nav-explore"
              onClick={() => onNavigate('explore')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-3 transition rounded-xl ${
                currentTab === 'explore' ? 'text-[#C59B27] font-bold' : 'text-[#767471] hover:text-[#1A1A1A]'
              }`}
            >
              <Compass className="h-5 w-5" />
              <span className="text-[10px]">Explore</span>
            </button>

            <button
              id="bottom-nav-saved"
              onClick={() => onNavigate('saved')}
              className={`relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-3 transition rounded-xl ${
                currentTab === 'saved' ? 'text-[#C59B27] font-bold' : 'text-[#767471] hover:text-[#1A1A1A]'
              }`}
            >
              <div className="relative">
                <Heart className="h-5 w-5" />
                {savedPhotographerIds.length > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {savedPhotographerIds.length}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Saved</span>
            </button>

            <button
              id="bottom-nav-auth"
              onClick={() => onNavigate('auth')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-3 transition rounded-xl ${
                currentTab === 'auth' ? 'text-[#C59B27] font-bold' : 'text-[#1A1A1A] font-semibold'
              }`}
            >
              <LogIn className="h-5 w-5 text-[#C59B27]" />
              <span className="text-[10px]">Sign In</span>
            </button>
          </>
        ) : isCustomer ? (
          /* Authenticated Customer Navigation */
          <>
            <button
              id="bottom-nav-home"
              onClick={() => onNavigate('home')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'home' ? 'text-[#C59B27] font-bold' : 'text-[#767471]'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              id="bottom-nav-explore"
              onClick={() => onNavigate('explore')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'explore' ? 'text-[#C59B27] font-bold' : 'text-[#767471]'
              }`}
            >
              <Compass className="h-5 w-5" />
              <span className="text-[10px]">Explore</span>
            </button>

            <button
              id="bottom-nav-bookings"
              onClick={() => onNavigate('bookings')}
              className={`relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'bookings' ? 'text-[#C59B27] font-bold' : 'text-[#767471]'
              }`}
            >
              <div className="relative">
                <CalendarCheck className="h-5 w-5" />
                {activeCustomerBookings > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#C59B27] text-[9px] font-bold text-white">
                    {activeCustomerBookings}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Bookings</span>
            </button>

            <button
              id="bottom-nav-saved"
              onClick={() => onNavigate('saved')}
              className={`relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'saved' ? 'text-[#C59B27] font-bold' : 'text-[#767471]'
              }`}
            >
              <div className="relative">
                <Heart className="h-5 w-5" />
                {savedPhotographerIds.length > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {savedPhotographerIds.length}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Saved</span>
            </button>

            <button
              id="bottom-nav-profile"
              onClick={() => onNavigate('profile')}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 py-1 px-2.5 transition rounded-xl ${
                currentTab === 'profile' ? 'text-[#C59B27] font-bold' : 'text-[#767471]'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-[10px]">Profile</span>
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
