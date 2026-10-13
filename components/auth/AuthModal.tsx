'use client';

import React from 'react';
import { X } from 'lucide-react';
import { AuthView } from './AuthView';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (role: 'customer' | 'photographer') => void;
  onNavigateToRegister?: () => void;
  customTitle?: string;
  customDescription?: string;
  initialMode?: 'login' | 'register';
  initialRole?: 'customer' | 'photographer';
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialRole = 'customer',
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg my-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-10 z-10 rounded-full bg-white/80 p-1.5 text-[#767471] hover:bg-[#F0ECE1] hover:text-[#1A1A1A] transition shadow-xs"
        >
          <X className="h-5 w-5" />
        </button>

        <AuthView
          initialRole={initialRole}
          onSuccess={(role) => {
            onSuccess?.(role);
            onClose();
          }}
          onComplete={() => {
            onClose();
          }}
        />
      </div>
    </div>
  );
}
