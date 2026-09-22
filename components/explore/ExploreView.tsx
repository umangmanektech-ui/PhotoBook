'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store/app-context';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  ShieldCheck,
  Heart,
  ArrowRight,
  X,
  ChevronDown,
  Sparkles,
  Calendar
} from 'lucide-react';

interface ExploreViewProps {
  initialCategory?: string;
  onNavigate: (tab: string, param?: string) => void;
}

export function ExploreView({ initialCategory, onNavigate }: ExploreViewProps) {
  const { photographers, isPhotographerSaved, toggleSavePhotographer, bookings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number>(40000);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [availableThisWeek, setAvailableThisWeek] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price_asc' | 'price_desc'>('recommended');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedCity !== 'All') count++;
    if (startDate || endDate) count++;
    if (maxPrice < 40000) count++;
    if (minRating > 4.0) count++;
    if (availableThisWeek) count++;
    return count;
  }, [selectedCategory, selectedCity, startDate, endDate, maxPrice, minRating, availableThisWeek]);

  // Filtered & Sorted Photographers
  const filteredPhotographers = useMemo(() => {
    return photographers
      .filter((artist) => {
        // Category filter
        if (selectedCategory !== 'All' && !artist.categories.includes(selectedCategory)) {
          return false;
        }
        // City filter
        if (selectedCity !== 'All' && !artist.city.toLowerCase().includes(selectedCity.toLowerCase())) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = artist.business_name.toLowerCase().includes(q);
          const matchCity = artist.city.toLowerCase().includes(q);
          const matchTags = artist.categories.some((c) => c.toLowerCase().includes(q));
          if (!matchName && !matchCity && !matchTags) return false;
        }
        // Date range filter
        if (startDate) {
          // Check if artist has blackout dates or confirmed bookings on the selected range
          const isBlackedOut = artist.blackout_dates?.some((d) => {
            if (endDate) {
              return d >= startDate && d <= endDate;
            }
            return d === startDate;
          });
          if (isBlackedOut) return false;

          const hasConflict = bookings.some((b) => {
            if (b.photographer_id === artist.id && (b.status === 'confirmed' || b.status === 'pending')) {
              if (endDate) {
                return b.event_date >= startDate && b.event_date <= endDate;
              }
              return b.event_date === startDate;
            }
            return false;
          });
          if (hasConflict) return false;
        }

        // Price filter
        if (artist.starting_price > maxPrice) {
          return false;
        }
        // Rating filter
        if (artist.rating < minRating) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price_asc') return a.starting_price - b.starting_price;
        if (sortBy === 'price_desc') return b.starting_price - a.starting_price;
        // Recommended
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return b.review_count - a.review_count;
      });
  }, [photographers, selectedCategory, selectedCity, searchQuery, startDate, endDate, maxPrice, minRating, sortBy, bookings]);

  const categoriesList = ['All', 'Wedding', 'Pre-Wedding', 'Portrait', 'Event', 'Fashion & Editorial', 'Maternity'];

  return (
    <div className="min-h-screen pb-24 text-[#1A1A1A]">
      {/* Header Bar */}
      <div className="border-b border-[#E8E2D2] bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
                Browse Master Photographers
              </h1>
              <p className="mt-1 text-xs text-[#767471]">
                Curated directory of verified visual artists with transparent commission tiers and verified diaries.
              </p>
            </div>

            {/* Search, Date Range, Filter Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative min-w-[200px] flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#767471]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, city, style..."
                  className="w-full rounded-xl border border-[#D9D2C2] bg-[#FBF9F5] py-2 pl-9 pr-8 text-xs text-[#1A1A1A] placeholder-[#767471] focus:border-[#C59B27] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-[#767471] hover:text-[#1A1A1A]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Date Range Picker inline */}
              <div className="w-full sm:w-64">
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(s, e) => {
                    setStartDate(s);
                    setEndDate(e);
                  }}
                  placeholder="Filter by Date Range"
                  compact
                />
              </div>

              {/* Modal trigger */}
              <button
                id="toggle-filter-modal-btn"
                onClick={() => setShowFilterModal(true)}
                className="relative flex items-center gap-1.5 rounded-xl border border-[#D9D2C2] bg-white px-3.5 py-2 text-xs font-semibold text-[#1A1A1A] shadow-xs hover:border-[#C59B27] transition"
              >
                <SlidersHorizontal className="h-4 w-4 text-[#C59B27]" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1A1A1A] text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Category Horizontal Pills */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-[#1A1A1A] text-[#FBF9F5] shadow-xs'
                    : 'bg-[#F0ECE1]/70 text-[#52504E] border border-[#E8E2D2] hover:border-[#C59B27]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Filter Bar */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0ECE1]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-[#767471]">City:</span>
              {['All', 'Ahmedabad', 'Jaipur', 'Udaipur', 'Mumbai'].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                    selectedCity === city
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-[#F0ECE1] text-[#52504E] hover:bg-[#E8E2D2]'
                  }`}
                >
                  {city}
                </button>
              ))}

              {(startDate || endDate) && (
                <div className="inline-flex items-center gap-1 rounded-full bg-[#C59B27]/15 border border-[#C59B27]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#997316]">
                  <Calendar className="h-3 w-3" />
                  <span>Dates applied</span>
                  <button
                    onClick={() => {
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }}
                    className="ml-1 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedCity('All');
                    setStartDate(undefined);
                    setEndDate(undefined);
                    setMaxPrice(40000);
                    setMinRating(4.0);
                    setAvailableThisWeek(false);
                  }}
                  className="text-[11px] text-[#C59B27] font-semibold hover:underline ml-1"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#767471]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-[#D9D2C2] bg-white px-2.5 py-1 text-xs font-semibold text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
              >
                <option value="recommended">Curated / Recommended</option>
                <option value="rating">Rating (Highest)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid of Photographers */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 text-xs text-[#767471]">
          Displaying <span className="font-semibold text-[#1A1A1A]">{filteredPhotographers.length}</span> verified photographers
        </div>

        {filteredPhotographers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D9D2C2] bg-white py-16 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-[#C59B27]" />
            <h3 className="mt-3 font-serif text-base font-bold text-[#1A1A1A]">No Photographers Found</h3>
            <p className="mt-1 text-xs text-[#767471] max-w-sm mx-auto">
              No visual artist matches your current filter selection or date availability. Try clearing or expanding your search dates.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCity('All');
                setStartDate(undefined);
                setEndDate(undefined);
                setMaxPrice(40000);
                setMinRating(4.0);
              }}
              className="mt-4 rounded-xl bg-[#1A1A1A] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#333] transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPhotographers.map((artist) => {
              const isSaved = isPhotographerSaved(artist.id);
              return (
                <div
                  key={artist.id}
                  className="group overflow-hidden rounded-3xl border border-[#E8E2D2] bg-white shadow-xs transition hover:shadow-lg hover:border-[#C59B27]/50 flex flex-col justify-between"
                >
                  <div>
                    {/* 3-Image Preview Strip */}
                    <div className="grid grid-cols-3 gap-1 bg-[#F0ECE1]/30 p-2">
                      <div
                        onClick={() => onNavigate('detail', artist.id)}
                        className="col-span-2 h-44 overflow-hidden rounded-l-2xl relative cursor-pointer"
                      >
                        <img
                          src={artist.hero_images[0]}
                          alt={`${artist.business_name} master`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="rounded-full bg-[#1A1A1A]/80 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-bold text-white">
                            {artist.shoots_completed > 0 ? `${artist.shoots_completed}+ Shoots` : 'New Master'}
                          </span>
                        </div>
                      </div>
                      <div
                        onClick={() => onNavigate('detail', artist.id)}
                        className="grid grid-rows-2 gap-1 h-44 cursor-pointer"
                      >
                        <div className="overflow-hidden rounded-tr-2xl">
                          <img
                            src={artist.hero_images[1] || artist.hero_images[0]}
                            alt={`${artist.business_name} frame 2`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="overflow-hidden rounded-br-2xl">
                          <img
                            src={artist.hero_images[2] || artist.hero_images[0]}
                            alt={`${artist.business_name} frame 3`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Body Info */}
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="cursor-pointer" onClick={() => onNavigate('detail', artist.id)}>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-serif text-base font-bold text-[#1A1A1A] group-hover:text-[#997316] transition">
                              {artist.business_name}
                            </h3>
                            {artist.is_verified && (
                              <ShieldCheck className="h-4 w-4 text-[#2D6A4F] shrink-0" />
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-[#767471]">
                            <MapPin className="h-3 w-3 text-[#C59B27]" />
                            <span>{artist.city}, {artist.state}</span>
                          </div>
                        </div>

                        {/* Save Heart Button */}
                        <button
                          onClick={() => toggleSavePhotographer(artist.id)}
                          className={`rounded-full p-2 transition ${
                            isSaved
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-[#FBF9F5] text-[#767471] hover:text-rose-500 hover:bg-rose-50'
                          }`}
                          aria-label="Save photographer"
                        >
                          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Rating & Review stats */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-md bg-[#FBF9F5] border border-[#E8E2D2] px-2 py-0.5 text-xs font-bold text-[#1A1A1A]">
                          <Star className="h-3 w-3 fill-[#C59B27] text-[#C59B27]" />
                          <span>{artist.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-[11px] text-[#767471]">
                          ({artist.review_count} verified reviews)
                        </span>
                      </div>

                      {/* Categories Pills */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {artist.categories.slice(0, 3).map((cat) => (
                          <span
                            key={cat}
                            className="rounded-lg bg-[#F0ECE1] px-2 py-0.5 text-[10px] font-medium text-[#52504E]"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-[#52504E] line-clamp-2">
                        {artist.bio}
                      </p>
                    </div>
                  </div>

                  {/* Footer with Starting Price and Action */}
                  <div className="flex items-center justify-between border-t border-[#F0ECE1] bg-[#FDFBF7] px-5 py-3.5">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#767471]">
                        Starting Session
                      </span>
                      <div className="text-sm font-bold text-[#1A1A1A]">
                        ₹{artist.starting_price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('detail', artist.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-[#FBF9F5] transition hover:bg-[#333] group-hover:border-[#C59B27]"
                    >
                      <span>View Atelier</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#C59B27]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Advanced Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[#D9D2C2] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-4">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Refine Search Parameters
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="rounded-full p-1.5 text-[#767471] hover:bg-[#F0ECE1]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-5 text-xs">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Photography Genre</label>
                <div className="flex flex-wrap gap-1.5">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-lg px-3 py-1.5 font-medium transition ${
                        selectedCategory === cat
                          ? 'bg-[#1A1A1A] text-white'
                          : 'bg-[#F0ECE1] text-[#52504E]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#1A1A1A]">Max Session Budget</label>
                  <span className="font-bold text-[#C59B27]">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={60000}
                  step={2000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#C59B27]"
                />
              </div>

              {/* Min Rating */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Minimum Client Rating</label>
                <div className="flex gap-2">
                  {[4.0, 4.5, 4.8, 4.9].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 font-medium transition ${
                        minRating === r
                          ? 'bg-[#1A1A1A] text-white'
                          : 'bg-[#F0ECE1] text-[#52504E]'
                      }`}
                    >
                      <Star className="h-3 w-3 fill-current" />
                      <span>{r}+</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between border-t border-[#F0ECE1] pt-4">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedCity('All');
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setMaxPrice(40000);
                  setMinRating(4.0);
                }}
                className="text-xs font-semibold text-[#767471] hover:underline"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="rounded-xl bg-[#1A1A1A] px-6 py-2.5 text-xs font-bold text-white shadow-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
