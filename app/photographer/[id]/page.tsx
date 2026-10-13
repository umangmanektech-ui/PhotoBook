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
    router.push(`/book?photographer=${encodeURIComponent(id)}${date ? `&date=${encodeURIComponent(date)}` : ''}`);
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
