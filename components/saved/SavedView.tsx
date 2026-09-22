'use client';

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import { Heart, Star, MapPin, ArrowRight, Sparkles } from 'lucide-react';

interface SavedViewProps {
  onNavigate: (tab: string, param?: string) => void;
}

export function SavedView({ onNavigate }: SavedViewProps) {
  const { savedPhotographerIds, photographers, toggleSavePhotographer } = useApp();

  const savedArtists = photographers.filter((p) => savedPhotographerIds.includes(p.id));

  return (
    <div className="min-h-screen pb-24 text-[#1A1A1A]">
      <div className="border-b border-[#E8E2D2] bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
            Shortlisted Curations
          </span>
          <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
            Saved Visual Artists ({savedArtists.length})
          </h1>
          <p className="mt-1 text-xs text-[#767471]">
            Your private shortlist of photographers for upcoming weddings, milestones, and personal portraits.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {savedArtists.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D9D2C2] bg-white p-12 text-center">
            <Heart className="mx-auto h-8 w-8 text-[#C59B27]" />
            <h3 className="mt-3 font-serif text-lg font-bold text-[#1A1A1A]">No Shortlisted Artists</h3>
            <p className="mt-1 text-xs text-[#767471]">
              Tap the heart icon on any photographer&apos;s card or profile to save them here for quick booking.
            </p>
            <button
              onClick={() => onNavigate('explore')}
              className="mt-4 rounded-xl bg-[#1A1A1A] px-5 py-2.5 text-xs font-semibold text-white shadow-xs"
            >
              Browse Curated Directory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedArtists.map((artist) => (
              <div
                key={artist.id}
                className="overflow-hidden rounded-2xl border border-[#E8E2D2] bg-white shadow-sm transition hover:shadow-md hover:border-[#C59B27]/40 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                    {artist.hero_images?.[0] ? (
                      <img
                        src={artist.hero_images[0]}
                        alt={artist.business_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#1A1A1A] font-serif text-2xl font-bold text-[#C59B27]">
                        {artist.business_name?.charAt(0) || 'P'}
                      </div>
                    )}
                    <button
                      onClick={() => toggleSavePhotographer(artist.id)}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-xs text-red-500 shadow-sm"
                      aria-label="Remove from saved"
                    >
                      <Heart className="h-4 w-4 fill-red-500" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                          {artist.business_name}
                        </h3>
                        <p className="flex items-center gap-1 text-[11px] text-[#767471] mt-0.5">
                          <MapPin className="h-3 w-3 text-[#C59B27]" />
                          {artist.city}, {artist.state}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#1A1A1A]">
                        <Star className="h-3.5 w-3.5 fill-[#C59B27] text-[#C59B27]" />
                        <span>{artist.rating}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {artist.categories.map((c) => (
                        <span
                          key={c}
                          className="rounded-md bg-[#FBF9F5] border border-[#E8E2D2] px-2 py-0.5 text-[10px] text-[#52504E]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="border-t border-[#F0ECE1] pt-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase text-[#767471]">Starting from</div>
                      <div className="font-serif text-sm font-bold text-[#1A1A1A]">
                        ₹{artist.starting_price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('photographer-detail', artist.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#333]"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="h-3 w-3 text-[#C59B27]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
