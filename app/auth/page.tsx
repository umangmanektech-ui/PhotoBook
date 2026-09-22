'use client';

import { AuthView } from '@/components/auth/AuthView';
import { useNavigate } from '@/hooks/useNavigate';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

function AuthContent() {
  const navigate = useNavigate();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') as 'customer' | 'photographer') ?? 'customer';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl">
        <AuthView
          initialMode="login"
          initialRole={role}
          onNavigate={navigate}
          onSuccess={(r) => {
            router.push(r === 'photographer' ? '/studio' : '/');
          }}
        />
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#767471]">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
