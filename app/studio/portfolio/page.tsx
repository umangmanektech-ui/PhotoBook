'use client';

import { PhotographerStudioView } from '@/components/studio/PhotographerStudioView';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useNavigate } from '@/hooks/useNavigate';
import { useModal } from '@/lib/store/modal-context';

export default function StudioPortfolioPage() {
  const navigate = useNavigate();
  const { openAuthModal } = useModal();

  return (
    <ProtectedRoute
      allowedRoles={['photographer']}
      fallbackTitle="Portfolio Works"
      fallbackDescription="Sign in as a photographer to manage your portfolio."
      onNavigate={navigate}
      onOpenAuth={(mode, role) => openAuthModal({ mode: mode ?? 'login', role: role ?? 'photographer' })}
    >
      <PhotographerStudioView initialTab="portfolio" onNavigate={navigate} />
    </ProtectedRoute>
  );
}
