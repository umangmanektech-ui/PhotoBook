'use client';

import { AuthView } from '@/components/auth/AuthView';
import { useNavigate } from '@/hooks/useNavigate';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl">
        <AuthView
          onNavigate={navigate}
          onSuccess={() => {
            router.push('/studio');
          }}
        />
      </div>
    </div>
  );
}
