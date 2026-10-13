'use client';

import { useApp } from '@/lib/store/app-context';
import {
  ArrowRight,
  Camera,
  Check,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import React, { useState } from 'react';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
  initialRole?: 'customer' | 'photographer';
  onComplete?: (role: 'customer' | 'photographer') => void;
  onSuccess?: (role: 'customer' | 'photographer') => void;
  onNavigate?: (tab: string) => void;
}

export function AuthView({
  onComplete,
  onSuccess,
  onNavigate,
}: AuthViewProps) {
  const { loginUser, logoutUser, currentUser, isAuthenticated } = useApp();

  // Photographer Form state
  const [photogEmail, setPhotogEmail] = useState('arjun@photobook.app');
  const [photogPassword, setPhotogPassword] = useState('••••••••');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFinish = (role: 'photographer') => {
    onSuccess?.(role);
    onComplete?.(role);
  };

  // If already authenticated
  if (isAuthenticated && currentUser.role === 'photographer') {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-[#D9D2C2] bg-white p-8 sm:p-10 shadow-lg text-center my-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A1A1A] text-[#C59B27] shadow-sm mb-6">
          <Camera className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#C59B27] mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          Studio Admin Active
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
          Signed In as {currentUser.full_name}
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-[#767471] leading-relaxed max-w-md mx-auto">
          You have administrative access to studio bookings, availability calendar, and portfolio settings.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              if (onNavigate) onNavigate('studio');
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-5 py-3 text-xs font-bold text-white hover:bg-[#333] transition shadow-xs"
          >
            <span>Open Studio Dashboard</span>
            <ArrowRight className="h-4 w-4 text-[#C59B27]" />
          </button>

          <button
            onClick={() => {
              logoutUser();
              setErrorMsg(null);
              setSuccessMsg('Signed out successfully.');
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  // Handle Photographer Login
  const handlePhotographerLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = loginUser(photogEmail.trim(), 'photographer');
    if (res.success) {
      setSuccessMsg(`Welcome back, ${res.user?.full_name}! Opening studio management...`);
      setTimeout(() => {
        handleFinish('photographer');
        if (onNavigate) onNavigate('studio');
      }, 500);
    } else {
      setErrorMsg(res.error || 'Invalid photographer credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center py-6 sm:py-8">
      <div className="w-full max-w-lg rounded-3xl border border-[#D9D2C2] bg-white p-6 sm:p-10 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#C59B27] mb-3">
            <Camera className="h-3 w-3" />
            Lead Photographer Portal
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">
            Studio Pro Administration
          </h2>
          <p className="mt-2 text-xs text-[#767471] max-w-sm mx-auto">
            Dedicated workspace for Lead Photographer <strong>Arjun Kumar</strong> to manage
            session slots, appointment requests, and portfolio.
          </p>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1-Click Fast Login for Arjun Kumar */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => handlePhotographerLogin()}
            className="w-full flex items-center justify-between gap-3 rounded-2xl bg-[#1A1A1A] p-3.5 text-white hover:bg-[#333] transition shadow-md group"
          >
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Arjun Kumar"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#C59B27]"
              />
              <div className="text-left min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Sign in as Arjun Kumar</span>
                  <span className="rounded bg-[#C59B27] px-1.5 py-0.2 text-[9px] font-bold text-[#1A1A1A]">
                    Lead Artist
                  </span>
                </div>
                <div className="text-[10px] text-[#A0A0A0] truncate">
                  arjun@photobook.app · Studio Administrator
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[#C59B27] group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Photographer Credentials Form */}
        <form onSubmit={handlePhotographerLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
              Photographer Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#767471]" />
              <input
                type="email"
                required
                value={photogEmail}
                onChange={(e) => setPhotogEmail(e.target.value)}
                placeholder="arjun@photobook.app"
                className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-9 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
              Studio Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#767471]" />
              <input
                type="password"
                required
                value={photogPassword}
                onChange={(e) => setPhotogPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2.5 pl-9 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C59B27] focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#C59B27] py-3 text-xs font-bold text-[#1A1A1A] hover:bg-[#D4AF37] transition shadow-md"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Enter Studio Portal</span>
          </button>
        </form>
      </div>
    </div>
  );
}
