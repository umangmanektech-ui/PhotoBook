'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { STUDIO_INFO } from '@/lib/data/studio-data';

function BookPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceId = searchParams.get('service') || undefined;
  const photographerId = searchParams.get('photographer') || undefined;
  const backHandlerRef = React.useRef<(() => void) | null>(null);

  const handleBack = () => {
    if (backHandlerRef.current) {
      backHandlerRef.current();
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8E2D2]">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl border border-[#D9D2C2] bg-white px-3.5 py-2 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F0ECE1] transition shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <div className="text-center hidden sm:block">
            <span className="font-serif text-sm font-bold text-[#1A1A1A]">{STUDIO_INFO.name}</span>
            <span className="text-[11px] text-[#767471] block">Reserve Your Session</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Zero Advance Fee</span>
          </div>
        </div>

        {/* Booking Wizard */}
        <BookingWizard
          initialServiceId={serviceId}
          initialPhotographerId={photographerId}
          onRegisterBack={(fn) => {
            backHandlerRef.current = fn;
          }}
        />
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-[#767471] text-sm">
        Loading booking studio...
      </div>
    }>
      <BookPageContent />
    </Suspense>
  );
}
