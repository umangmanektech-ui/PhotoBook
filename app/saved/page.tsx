'use client';

import { SavedView } from '@/components/saved/SavedView';
import { useNavigate } from '@/hooks/useNavigate';

export default function SavedPage() {
  const navigate = useNavigate();
  return <SavedView onNavigate={navigate} />;
}
