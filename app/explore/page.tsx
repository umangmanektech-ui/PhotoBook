'use client';

import { ExploreView } from '@/components/explore/ExploreView';
import { useNavigate } from '@/hooks/useNavigate';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ExploreContent() {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'All';
  return <ExploreView initialCategory={category} onNavigate={navigate} />;
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#767471] text-sm">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
