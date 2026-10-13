'use client';

import { CustomerBookingsView } from '@/components/bookings/CustomerBookingsView';
import { useNavigate } from '@/hooks/useNavigate';

export default function BookingsPage() {
  const navigate = useNavigate();

  return <CustomerBookingsView onNavigate={navigate} onOpenChat={() => {}} />;
}

