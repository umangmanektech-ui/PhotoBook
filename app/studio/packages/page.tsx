'use client';

import { PhotographerStudioView } from '@/components/studio/PhotographerStudioView';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useNavigate } from '@/hooks/useNavigate';
import { useModal } from '@/lib/store/modal-context';

export default function StudioPackagesPage() {
  const navigate = useNavigate();
  const { openAuthModal } = useModal();

  return (
    <ProtectedRoute
      allowedRoles={['photographer']}
      fallbackTitle="Pricing Packages"
      fallbackDescription="Sign in as a photographer to manage your session packages and pricing tiers."
      onNavigate={navigate}
      onOpenAuth={(mode, role) => openAuthModal({ mode: mode ?? 'login', role: role ?? 'photographer' })}
    >
      <PhotographerStudioView initialTab="packages" onNavigate={navigate} />
    </ProtectedRoute>
  );
}
