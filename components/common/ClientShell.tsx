'use client';

import { AuthModal } from '@/components/auth/AuthModal';
import { BookingFlowModal } from '@/components/booking/BookingFlowModal';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Header } from '@/components/navigation/Header';
import { useModal } from '@/lib/store/modal-context';
import { useNavigate } from '@/hooks/useNavigate';
import { usePathname, useRouter } from 'next/navigation';

/** Converts current pathname to the tab-name string Header/BottomNav expect */
function pathToTab(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/photographer/')) return 'photographer-detail';
  if (pathname === '/studio/bookings') return 'studio-bookings';
  if (pathname === '/studio/portfolio') return 'studio-portfolio';
  if (pathname === '/studio/packages') return 'studio-packages';
  if (pathname === '/studio/settings') return 'studio-profile';
  if (pathname === '/studio/calendar') return 'studio-calendar';
  if (pathname.startsWith('/studio')) return 'studio';
  if (pathname.startsWith('/auth')) return 'auth';
  const segment = pathname.split('/')[1];
  return segment || 'home';
}

/**
 * Client shell rendered inside the root layout.
 * Provides: Header, BottomNav, AuthModal, BookingFlowModal.
 */
export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const navigate = useNavigate();

  const {
    authModalOpen,
    authInitialMode,
    authInitialRole,
    authCustomTitle,
    authCustomDesc,
    openAuthModal,
    closeAuthModal,
    pendingBooking,
    setPendingBooking,
    bookingModalOpen,
    bookingPhotographerId,
    bookingPackageId,
    bookingInitialDate,
    openBookingModal,
    closeBookingModal,
  } = useModal();

  const currentTab = pathToTab(pathname);

  // Auth page — render WITHOUT Header/BottomNav overlays
  const isAuthPage = pathname.startsWith('/auth');

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1A1A] flex flex-col">
      <Header
        currentTab={currentTab}
        onNavigate={navigate}
        onOpenAuth={() => openAuthModal({ mode: 'login' })}
      />

      {/* Main content — padding-bottom on mobile so BottomNav never covers content */}
      <main className="flex-1 pb-16 sm:pb-0">
        {children}
      </main>

      <BottomNav currentTab={currentTab} onNavigate={navigate} />

      {/* ── Auth Modal ───────────────────────────────────────────────────── */}
      <AuthModal
        key={`auth-${authModalOpen}-${authInitialMode}-${authInitialRole}-${authCustomTitle ?? ''}`}
        isOpen={authModalOpen}
        onClose={() => {
          closeAuthModal();
          setPendingBooking(null);
        }}
        customTitle={authCustomTitle}
        customDescription={authCustomDesc}
        initialMode={authInitialMode}
        initialRole={authInitialRole}
        onNavigateToRegister={() => {
          closeAuthModal();
          router.push('/auth/register');
        }}
        onSuccess={(role) => {
          closeAuthModal();
          if (pendingBooking && role === 'customer') {
            openBookingModal(
              pendingBooking.photographerId,
              pendingBooking.packageId,
              pendingBooking.initialDate,
            );
            setPendingBooking(null);
          } else if (role === 'photographer') {
            setPendingBooking(null);
            router.push('/studio');
          } else {
            setPendingBooking(null);
            router.push('/');
          }
        }}
      />

      {/* ── Booking Flow Modal ───────────────────────────────────────────── */}
      {bookingModalOpen && (
        <BookingFlowModal
          photographerId={bookingPhotographerId}
          initialPackageId={bookingPackageId}
          initialDate={bookingInitialDate ?? ''}
          onClose={closeBookingModal}
          onComplete={() => {
            closeBookingModal();
            router.push('/bookings');
          }}
          onOpenChat={() => {}}
        />
      )}
    </div>
  );
}
