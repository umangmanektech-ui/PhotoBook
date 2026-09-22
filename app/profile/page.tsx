'use client';

import { CustomerProfileView } from '@/components/profile/CustomerProfileView';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useNavigate } from '@/hooks/useNavigate';
import { useModal } from '@/lib/store/modal-context';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { openAuthModal } = useModal();

  return (
    <ProtectedRoute
      allowedRoles={['customer', 'photographer']}
      fallbackTitle="Patron Profile Settings"
      fallbackDescription="Sign in to manage your contact details, event preferences, and personal booking history."
      onNavigate={navigate}
      onOpenAuth={(mode, role) => openAuthModal({ mode: mode ?? 'login', role: role ?? 'customer' })}
    >
      <CustomerProfileView onNavigate={navigate} />
    </ProtectedRoute>
  );
}
