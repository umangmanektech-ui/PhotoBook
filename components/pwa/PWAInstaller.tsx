'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { Download, X, Share, PlusSquare, WifiOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function subscribeToOnline(onStoreChange: () => void) {
  window.addEventListener('online', onStoreChange);
  window.addEventListener('offline', onStoreChange);
  return () => {
    window.removeEventListener('online', onStoreChange);
    window.removeEventListener('offline', onStoreChange);
  };
}

function getOnlineSnapshot() {
  return !navigator.onLine;
}

function getServerOnlineSnapshot() {
  return false;
}

function subscribeNoop() {
  return () => {};
}

function getIOSSnapshot() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
  const isInStandaloneMode =
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone);
  return Boolean(isIosDevice && !isInStandaloneMode);
}

function getServerIOSSnapshot() {
  return false;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const isOffline = useSyncExternalStore(subscribeToOnline, getOnlineSnapshot, getServerOnlineSnapshot);
  const isIOS = useSyncExternalStore(subscribeNoop, getIOSSnapshot, getServerIOSSnapshot);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.error('SW registration error:', err));
    }

    // BeforeInstallPrompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSPrompt(true);
    }
  };

  return (
    <>
      {/* Offline Alert Ribbon */}
      {isOffline && (
        <div className="fixed top-16 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-[#767471] px-4 py-1.5 text-xs text-white">
          <WifiOff className="h-3.5 w-3.5" />
          <span>You are browsing PhotoBook in offline mode. Cached portfolios are accessible.</span>
        </div>
      )}

      {/* Floating PWA Install Prompt Banner */}
      {(isInstallable || isIOS) && !isDismissed && (
        <div className="fixed bottom-20 right-4 z-40 max-w-sm rounded-2xl border border-[#C59B27]/40 bg-[#1A1A1A] p-4 text-[#FBF9F5] shadow-2xl animate-in slide-in-from-bottom-4 sm:bottom-6 sm:right-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C59B27]/20 border border-[#C59B27]/50">
                <Download className="h-5 w-5 text-[#C59B27]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C59B27]">Install PhotoBook App</h4>
                <p className="text-[11px] text-[#A6A4A0] leading-snug mt-0.5">
                  Instant booking alerts, offline gallery viewing & fluid mobile experience.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-[#A6A4A0] hover:text-white"
              aria-label="Dismiss install banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 rounded-lg bg-[#C59B27] py-1.5 px-3 text-center text-xs font-semibold text-[#1A1A1A] transition hover:bg-[#D4AF37]"
            >
              Install Application
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="rounded-lg border border-[#333] px-3 py-1.5 text-xs text-[#A6A4A0] hover:text-white"
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* iOS Instructions Modal */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-[#D9D2C2] bg-[#FBF9F5] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Install on iOS</h3>
              <button onClick={() => setShowIOSPrompt(false)}>
                <X className="h-5 w-5 text-[#767471]" />
              </button>
            </div>
            <p className="mt-2 text-xs text-[#52504E] leading-relaxed">
              Install PhotoBook directly to your iPhone / iPad Home Screen for quick access:
            </p>
            <ol className="mt-4 space-y-3 text-xs text-[#1A1A1A]">
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8E2D2] font-semibold text-[10px]">1</span>
                Tap the <Share className="mx-1 h-4 w-4 text-[#C59B27] inline" /> <strong>Share</strong> button in Safari toolbar.
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8E2D2] font-semibold text-[10px]">2</span>
                Scroll down and tap <PlusSquare className="mx-1 h-4 w-4 text-[#C59B27] inline" /> <strong>Add to Home Screen</strong>.
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8E2D2] font-semibold text-[10px]">3</span>
                Tap <strong>Add</strong> in the top-right corner.
              </li>
            </ol>
            <button
              onClick={() => setShowIOSPrompt(false)}
              className="mt-6 w-full rounded-xl bg-[#1A1A1A] py-2.5 text-xs font-semibold text-[#FBF9F5]"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
}
