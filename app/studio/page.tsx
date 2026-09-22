'use client';

import { PhotographerStudioView } from '@/components/studio/PhotographerStudioView';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useNavigate } from '@/hooks/useNavigate';
import { useModal } from '@/lib/store/modal-context';

export default function StudioPage() {
  const navigate = useNavigate();
  const { openAuthModal } = useModal();

  return (
    <ProtectedRoute
      allowedRoles={['photographer']}
      fallbackTitle="Photographer Atelier Portal"
      fallbackDescription="The Studio workspace, commission calendar, pricing tier manager, and client gallery vaults are accessible to registered photographers."
      onNavigate={navigate}
      onOpenAuth={(mode, role) => openAuthModal({ mode: mode ?? 'login', role: role ?? 'photographer' })}
    >
      <PhotographerStudioView initialTab="requests" onNavigate={navigate} />
    </ProtectedRoute>
  );
}
