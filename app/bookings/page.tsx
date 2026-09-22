'use client';

import { CustomerBookingsView } from '@/components/bookings/CustomerBookingsView';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useNavigate } from '@/hooks/useNavigate';
import { useModal } from '@/lib/store/modal-context';

export default function BookingsPage() {
  const navigate = useNavigate();
  const { openAuthModal } = useModal();

  return (
    <ProtectedRoute
      allowedRoles={['customer', 'photographer']}
      fallbackTitle="My Bookings & Reservations"
      fallbackDescription="Sign in to view your upcoming shoots, live booking status, session passes, and delivered photo galleries."
      onNavigate={navigate}
      onOpenAuth={(mode, role) => openAuthModal({ mode: mode ?? 'login', role: role ?? 'customer' })}
    >
      <CustomerBookingsView onNavigate={navigate} onOpenChat={() => {}} />
    </ProtectedRoute>
  );
}
