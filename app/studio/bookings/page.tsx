'use client';

import { PhotographerStudioView } from '@/components/studio/PhotographerStudioView';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useNavigate } from '@/hooks/useNavigate';
import { useModal } from '@/lib/store/modal-context';

export default function StudioBookingsPage() {
  const navigate = useNavigate();
  const { openAuthModal } = useModal();

  return (
    <ProtectedRoute
      allowedRoles={['photographer']}
      fallbackTitle="Booking Requests"
      fallbackDescription="Sign in as a photographer to manage booking requests."
      onNavigate={navigate}
      onOpenAuth={(mode, role) => openAuthModal({ mode: mode ?? 'login', role: role ?? 'photographer' })}
    >
      <PhotographerStudioView initialTab="requests" onNavigate={navigate} />
    </ProtectedRoute>
  );
}
