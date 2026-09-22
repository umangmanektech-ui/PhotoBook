'use client';

import { PhotographerDetailView } from '@/components/photographer/PhotographerDetailView';
import { useApp } from '@/lib/store/app-context';
import { useModal } from '@/lib/store/modal-context';
import { useNavigate } from '@/hooks/useNavigate';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PhotographerDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const navigate = useNavigate();
  const router = useRouter();
  const { isAuthenticated } = useApp();
  const { openAuthModal, openBookingModal, setPendingBooking } = useModal();

  const handleSelectPackageToBook = (packageId: string, date?: string) => {
    if (!isAuthenticated) {
      setPendingBooking({ photographerId: id, packageId, initialDate: date });
      openAuthModal({
        mode: 'login',
        role: 'customer',
        title: 'Sign In to Book a Session',
        desc: 'A patron account is required to reserve dates, receive booking confirmation, and access your private gallery.',
      });
      return;
    }
    openBookingModal(id, packageId, date);
  };

  return (
    <PhotographerDetailView
      photographerId={id}
      onBack={() => router.back()}
      onSelectPackageToBook={handleSelectPackageToBook}
      onOpenChat={() => {}}
    />
  );
}
