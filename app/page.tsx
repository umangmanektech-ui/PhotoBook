'use client';

import { HomeView } from '@/components/home/HomeView';
import { useNavigate } from '@/hooks/useNavigate';

export default function HomePage() {
  const navigate = useNavigate();
  return <HomeView onNavigate={navigate} />;
}
