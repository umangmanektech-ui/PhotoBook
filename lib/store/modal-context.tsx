'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingBooking {
  photographerId: string;
  packageId?: string;
  initialDate?: string;
}

interface AuthModalOptions {
  mode?: 'login' | 'register';
  role?: 'customer' | 'photographer';
  title?: string;
  desc?: string;
}

interface ModalContextType {
  // ── Auth modal ──────────────────────────────────────────────────────────────
  authModalOpen: boolean;
  authInitialMode: 'login' | 'register';
  authInitialRole: 'customer' | 'photographer';
  authCustomTitle?: string;
  authCustomDesc?: string;
  openAuthModal: (opts?: AuthModalOptions) => void;
  closeAuthModal: () => void;

  // ── Booking modal ───────────────────────────────────────────────────────────
  bookingModalOpen: boolean;
  bookingPhotographerId: string;
  bookingPackageId?: string;
  bookingInitialDate?: string;
  openBookingModal: (photographerId: string, packageId?: string, date?: string) => void;
  closeBookingModal: () => void;

  // ── Pending booking (book-after-login flow) ─────────────────────────────────
  pendingBooking: PendingBooking | null;
  setPendingBooking: (b: PendingBooking | null) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authInitialRole, setAuthInitialRole] = useState<'customer' | 'photographer'>('customer');
  const [authCustomTitle, setAuthCustomTitle] = useState<string | undefined>(undefined);
  const [authCustomDesc, setAuthCustomDesc] = useState<string | undefined>(undefined);

  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingPhotographerId, setBookingPhotographerId] = useState('');
  const [bookingPackageId, setBookingPackageId] = useState<string | undefined>(undefined);
  const [bookingInitialDate, setBookingInitialDate] = useState<string | undefined>(undefined);

  // Pending booking (book-after-login)
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);

  const openAuthModal = useCallback((opts?: AuthModalOptions) => {
    setAuthInitialMode(opts?.mode ?? 'login');
    setAuthInitialRole(opts?.role ?? 'customer');
    setAuthCustomTitle(opts?.title);
    setAuthCustomDesc(opts?.desc);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  const openBookingModal = useCallback(
    (photographerId: string, packageId?: string, date?: string) => {
      setBookingPhotographerId(photographerId);
      setBookingPackageId(packageId);
      setBookingInitialDate(date);
      setBookingModalOpen(true);
    },
    [],
  );

  const closeBookingModal = useCallback(() => setBookingModalOpen(false), []);

  return (
    <ModalContext.Provider
      value={{
        authModalOpen,
        authInitialMode,
        authInitialRole,
        authCustomTitle,
        authCustomDesc,
        openAuthModal,
        closeAuthModal,
        bookingModalOpen,
        bookingPhotographerId,
        bookingPackageId,
        bookingInitialDate,
        openBookingModal,
        closeBookingModal,
        pendingBooking,
        setPendingBooking,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
