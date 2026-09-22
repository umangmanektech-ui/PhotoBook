import React from 'react';
import { ClientShell } from '@/components/common/ClientShell';
import { cn } from '@/lib/utils';
import { AppProvider } from '@/lib/store/app-context';
import { ModalProvider } from '@/lib/store/modal-context';
import type { Metadata, Viewport } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';

const figtree = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PhotoBook – Curated Photography Booking & Portfolios',
  description:
    'Discover master visual artists, view high-res portfolios, check transparent pricing and live dates, and book bespoke photography sessions across India.',
  applicationName: 'PhotoBook',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PhotoBook',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'PhotoBook – Curated Photography Booking & Portfolios',
    description:
      'Discover master visual artists, view high-res portfolios, check transparent pricing and live dates, and book bespoke photography sessions across India.',
    type: 'website',
    siteName: 'PhotoBook',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhotoBook – Curated Photography Booking & Portfolios',
    description:
      'Discover master visual artists, view high-res portfolios, check transparent pricing and live dates, and book bespoke photography sessions across India.',
  },
};

export const viewport: Viewport = {
  themeColor: '#FBF9F5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn('h-full antialiased', figtree.className, 'bg-ivory text-dark')}
        suppressHydrationWarning
      >
        <AppProvider>
          <ModalProvider>
            <ClientShell>{children}</ClientShell>
          </ModalProvider>
        </AppProvider>
      </body>
    </html>
  );
}
