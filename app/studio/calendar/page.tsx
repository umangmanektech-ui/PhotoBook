'use client';

import { PhotographerStudioView } from '@/components/studio/PhotographerStudioView';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useNavigate } from '@/hooks/useNavigate';
import { useModal } from '@/lib/store/modal-context';

export default function StudioCalendarPage() {
  const navigate = useNavigate();
  const { openAuthModal } = useModal();

  return (
    <ProtectedRoute
      allowedRoles={['photographer']}
      fallbackTitle="Availability Calendar"
      fallbackDescription="Sign in as a photographer to manage your availability and blocked dates."
      onNavigate={navigate}
      onOpenAuth={(mode, role) => openAuthModal({ mode: mode ?? 'login', role: role ?? 'photographer' })}
    >
      <PhotographerStudioView initialTab="calendar" onNavigate={navigate} />
    </ProtectedRoute>
  );
}
