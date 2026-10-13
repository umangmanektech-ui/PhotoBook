'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Filter,
  X,
  ArrowRight,
  Sparkles,
  Award,
  Heart,
  Calendar,
  Share2,
  ZoomIn,
} from 'lucide-react';
import {
  STUDIO_INFO,
  STUDIO_PHOTOGRAPHERS,
  ALL_PORTFOLIO_ITEMS,
} from '@/lib/data/studio-data';
import type { StudioPortfolioItem } from '@/lib/types/appointment';

export default function PortfolioPage() {
  const router = useRouter();

  const [selectedPhotographerId, setSelectedPhotographerId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<StudioPortfolioItem | null>(null);

  const mainPhotographer = STUDIO_PHOTOGRAPHERS.find((p) => p.role === 'main')!;
  const associatePhotographers = STUDIO_PHOTOGRAPHERS.filter((p) => p.role === 'associate');

  // Categories list
  const categories = ['All', ...Array.from(new Set(ALL_PORTFOLIO_ITEMS.map((i) => i.category)))];

  // Filtered portfolio
  const filteredItems = useMemo(() => {
    return ALL_PORTFOLIO_ITEMS.filter((item) => {
      const matchPhotographer =
        selectedPhotographerId === 'all' || item.photographerId === selectedPhotographerId;
      const matchCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      return matchPhotographer && matchCategory;
    });
  }, [selectedPhotographerId, selectedCategory]);

  const activePhotographer = STUDIO_PHOTOGRAPHERS.find(
    (p) => p.id === selectedPhotographerId,
  );

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1A1A]">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-[#E8E2D2] bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F0ECE1] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#997316] mb-3">
                <Sparkles className="h-3 w-3" />
                {STUDIO_INFO.name} Gallery
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1A1A]">
                Studio Portfolio
              </h1>
              <p className="mt-2 text-sm text-[#767471] max-w-2xl leading-relaxed">
                Explore our signature works. View frames by our Lead Artist Arjun Kumar and handpicked associate photographers Priya Mehta and Rohit Shah.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/book')}
                className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-3 text-sm font-bold text-white hover:bg-[#333] transition shadow-md"
              >
                <Camera className="h-4 w-4 text-[#C59B27]" />
                <span>Book a Session</span>
              </button>
            </div>
          </div>

          {/* ── Photographer Filter Tabs ────────────────────────────────────── */}
          <div className="mt-8 border-t border-[#F0ECE1] pt-6">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-[#767471]">
              <Award className="h-3.5 w-3.5 text-[#C59B27]" />
              <span>Filter by Artist</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setSelectedPhotographerId('all')}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedPhotographerId === 'all'
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'bg-[#F0ECE1] text-[#52504E] hover:bg-[#E8E2D2]'
                }`}
              >
                <span>All Artists</span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                  {ALL_PORTFOLIO_ITEMS.length}
                </span>
              </button>

              {STUDIO_PHOTOGRAPHERS.map((photog) => {
                const count = ALL_PORTFOLIO_ITEMS.filter((i) => i.photographerId === photog.id).length;
                const isSelected = selectedPhotographerId === photog.id;
                return (
                  <button
                    key={photog.id}
                    onClick={() => setSelectedPhotographerId(photog.id)}
                    className={`flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-semibold transition border ${
                      isSelected
                        ? 'border-[#C59B27] bg-[#1A1A1A] text-white shadow-sm'
                        : 'border-[#E8E2D2] bg-white text-[#52504E] hover:border-[#C59B27]'
                    }`}
                  >
                    <img
                      src={photog.avatar}
                      alt={photog.name}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <span>{photog.name}</span>
                    <span className={`text-[10px] ${photog.role === 'main' ? 'text-[#C59B27] font-bold' : 'text-[#767471]'}`}>
                      ({photog.role === 'main' ? 'Lead' : 'Associate'})
                    </span>
                    <span className="rounded-full bg-[#F0ECE1] px-1.5 py-0.2 text-[10px] text-[#1A1A1A]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active photographer bio snippet */}
          {activePhotographer && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#FFFBF0] border border-[#C59B27]/30 p-3.5">
              <div className="flex items-center gap-3">
                <img
                  src={activePhotographer.avatar}
                  alt={activePhotographer.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#C59B27]"
                />
                <div>
                  <div className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    {activePhotographer.name}
                    {activePhotographer.role === 'main' && (
                      <span className="rounded bg-[#C59B27] px-1.5 py-0.5 text-[9px] font-bold text-[#1A1A1A]">
                        Lead Artist
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#767471]">{activePhotographer.shortBio}</div>
                </div>
              </div>
              <button
                onClick={() => router.push(`/book?photographer=${activePhotographer.id}`)}
                className="hidden sm:inline-flex items-center gap-1 rounded-xl bg-[#C59B27] px-3.5 py-1.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#D4AF37] transition"
              >
                Book with {activePhotographer.name.split(' ')[0]}
              </button>
            </div>
          )}

          {/* ── Category Filter Tabs ────────────────────────────────────────── */}
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-[#C59B27] text-[#1A1A1A]'
                    : 'bg-[#F0ECE1] text-[#767471] hover:bg-[#E8E2D2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Gallery Grid ────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="mx-auto h-12 w-12 text-[#D9D2C2] mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">No photos found</h3>
            <p className="text-xs text-[#767471] mt-1">Try selecting a different category or artist filter.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredItems.map((item, idx) => {
              const photographer = STUDIO_PHOTOGRAPHERS.find((p) => p.id === item.photographerId);
              return (
                <div
                  key={item.id}
                  onClick={() => setLightboxItem(item)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-black/5 shadow-xs transition hover:shadow-xl break-inside-avoid"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start">
                      <span className="rounded-full bg-[#C59B27] px-2.5 py-0.5 text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                        {item.category}
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white">
                        <ZoomIn className="h-4 w-4" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-serif text-sm font-bold text-white">{item.title}</h4>
                      {photographer && (
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-[#E8E2D2]">
                          <img
                            src={photographer.avatar}
                            alt={photographer.name}
                            className="h-4 w-4 rounded-full object-cover"
                          />
                          <span>{photographer.name}</span>
                          <span className="text-[#C59B27]">· {photographer.role === 'main' ? 'Lead' : 'Associate'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Lightbox Modal ──────────────────────────────────────────────────── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col rounded-3xl overflow-hidden bg-[#1A1A1A] text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition backdrop-blur-sm"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image display */}
            <div className="relative flex-1 bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Bottom details bar */}
            <div className="p-6 bg-[#1A1A1A] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-[#C59B27]/20 border border-[#C59B27]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#C59B27] mb-1">
                  {lightboxItem.category}
                </span>
                <h3 className="font-serif text-xl font-bold text-white">{lightboxItem.title}</h3>
                {(() => {
                  const p = STUDIO_PHOTOGRAPHERS.find((ph) => ph.id === lightboxItem.photographerId);
                  if (!p) return null;
                  return (
                    <div className="mt-1 flex items-center gap-2 text-xs text-[#B0AAA0]">
                      <img src={p.avatar} alt={p.name} className="h-5 w-5 rounded-full object-cover" />
                      <span>Captured by <strong className="text-white">{p.name}</strong> ({p.role === 'main' ? 'Lead Photographer' : 'Associate Artist'})</span>
                    </div>
                  );
                })()}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setLightboxItem(null);
                    router.push(`/book?photographer=${lightboxItem.photographerId}`);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-[#C59B27] px-6 py-3 text-xs font-bold text-[#1A1A1A] hover:bg-[#D4AF37] transition shadow-lg"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book This Style</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
