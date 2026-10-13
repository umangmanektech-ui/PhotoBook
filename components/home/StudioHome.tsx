'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Award, Camera, CheckCircle2, Heart, Instagram,
  MapPin, MessageCircle, Phone, Sparkles, Star
} from 'lucide-react';
import { SERVICES, STUDIO_INFO, STUDIO_PHOTOGRAPHERS, TESTIMONIALS, ALL_PORTFOLIO_ITEMS } from '@/lib/data/studio-data';

const MAIN_PHOTOGRAPHER = STUDIO_PHOTOGRAPHERS.find(p => p.role === 'main')!;
const ASSOCIATE_PHOTOGRAPHERS = STUDIO_PHOTOGRAPHERS.filter(p => p.role === 'associate');

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'fill-[#C59B27] text-[#C59B27]' : 'text-[#D9D2C2]'}`} />
      ))}
    </div>
  );
}

export function StudioHome() {
  const router = useRouter();
  const [activePortfolioCategory, setActivePortfolioCategory] = useState('All');

  const portfolioCategories = ['All', ...Array.from(new Set(ALL_PORTFOLIO_ITEMS.map(i => i.category)))];
  const filteredPortfolio = activePortfolioCategory === 'All'
    ? ALL_PORTFOLIO_ITEMS
    : ALL_PORTFOLIO_ITEMS.filter(i => i.category === activePortfolioCategory);

  return (
    <div className="min-h-screen bg-[#FBF9F5]">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1A1A1A] text-white">
        {/* Background hero image */}
        <div className="absolute inset-0">
          <img
            src={MAIN_PHOTOGRAPHER.coverImage}
            alt="Hero"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 lg:py-40 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C59B27]/40 bg-[#C59B27]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#C59B27] mb-5">
              <Sparkles className="h-3 w-3" />
              {STUDIO_INFO.location}
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {STUDIO_INFO.name}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#B0AAA0] leading-relaxed max-w-md">
              {STUDIO_INFO.tagline}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <StarRating rating={STUDIO_INFO.rating} />
              <span className="text-sm text-[#B0AAA0]">
                {STUDIO_INFO.rating} · {STUDIO_INFO.reviewCount} reviews · {STUDIO_INFO.totalSessions}+ sessions
              </span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/book')}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#C59B27] px-7 py-3.5 text-sm font-bold text-[#1A1A1A] shadow-lg hover:bg-[#D4AF37] transition"
              >
                <Camera className="h-4 w-4" />
                Book a Session
              </button>
              <button
                onClick={() => router.push('/portfolio')}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition backdrop-blur-sm"
              >
                View Portfolio <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────────────── */}
      <section className="border-b border-[#E8E2D2] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-[#E8E2D2]">
            {[
              { label: 'Sessions Delivered', value: `${STUDIO_INFO.totalSessions}+` },
              { label: 'Client Rating', value: `${STUDIO_INFO.rating}/5` },
              { label: 'Years of Experience', value: `${new Date().getFullYear() - STUDIO_INFO.established}+` },
            ].map(stat => (
              <div key={stat.label} className="py-6 text-center">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{stat.value}</div>
                <div className="mt-1 text-[11px] text-[#767471] font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Photographer ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <div className="relative max-w-sm mx-auto w-full">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={MAIN_PHOTOGRAPHER.avatar}
                alt={MAIN_PHOTOGRAPHER.name}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-5 -right-3 sm:-right-6 rounded-2xl bg-[#1A1A1A] p-4 shadow-2xl max-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={MAIN_PHOTOGRAPHER.rating} />
              </div>
              <div className="font-serif text-lg font-bold text-white">{MAIN_PHOTOGRAPHER.rating}</div>
              <div className="text-[10px] text-[#A0A0A0]">{MAIN_PHOTOGRAPHER.reviewCount} verified reviews</div>
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F0ECE1] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#997316] mb-4">
              <Camera className="h-3 w-3" />
              Lead Photographer
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">{MAIN_PHOTOGRAPHER.name}</h2>
            <p className="mt-1 text-sm text-[#C59B27] font-semibold">{MAIN_PHOTOGRAPHER.experience}+ years · {STUDIO_INFO.location}</p>

            <p className="mt-4 text-sm text-[#52504E] leading-relaxed">{MAIN_PHOTOGRAPHER.bio}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {MAIN_PHOTOGRAPHER.specialties.map(s => (
                <span key={s} className="rounded-full border border-[#D9D2C2] bg-[#FBF9F5] px-3 py-1 text-xs font-medium text-[#52504E]">{s}</span>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/book')}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-6 py-3 text-sm font-bold text-white hover:bg-[#333] transition"
              >
                <Camera className="h-4 w-4 text-[#C59B27]" /> Book with {MAIN_PHOTOGRAPHER.name.split(' ')[0]}
              </button>
              {MAIN_PHOTOGRAPHER.instagram && (
                <a
                  href={`https://instagram.com/${MAIN_PHOTOGRAPHER.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#D9D2C2] bg-white px-6 py-3 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────────────── */}
      <section className="bg-[#F0ECE1]/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#C59B27]">What We Offer</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#1A1A1A]">Our Services</h2>
            <p className="mt-2 text-sm text-[#767471] max-w-lg mx-auto">Transparent pricing, curated packages, zero hidden fees. Every session comes with a personalised pre-shoot consultation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(svc => (
              <div
                key={svc.id}
                onClick={() => router.push(`/book?service=${svc.id}`)}
                className={`cursor-pointer relative rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md hover:border-[#C59B27] transition group ${
                  svc.popular ? 'border-[#C59B27] ring-1 ring-[#C59B27]/30' : 'border-[#E8E2D2]'
                }`}
              >
                {svc.popular && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-[#C59B27] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                    Most Popular
                  </span>
                )}
                <div className="text-3xl mb-3">{svc.emoji}</div>
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">{svc.name}</h3>
                <p className="mt-1 text-xs text-[#767471] leading-relaxed">{svc.description}</p>

                <div className="mt-4 space-y-1.5">
                  {svc.includes.map(inc => (
                    <div key={inc} className="flex items-center gap-2 text-xs text-[#52504E]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#C59B27] shrink-0" />
                      {inc}
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-[#F0ECE1] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#767471]">Starting from</div>
                    <div className="font-serif text-xl font-bold text-[#1A1A1A]">₹{svc.startingPrice.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-[#767471]">
                      {svc.durationLabel} · Extra: +₹{Math.round(svc.startingPrice / svc.slotsRequired).toLocaleString('en-IN')}/hr
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/book?service=${svc.id}`);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-[#1A1A1A] px-4 py-2 text-xs font-bold text-white group-hover:bg-[#C59B27] group-hover:text-[#1A1A1A] transition"
                  >
                    Book <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio Preview ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#C59B27]">Our Work</span>
            <h2 className="mt-1 font-serif text-3xl font-bold text-[#1A1A1A]">Portfolio</h2>
          </div>
          <button
            onClick={() => router.push('/portfolio')}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#C59B27] hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {portfolioCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActivePortfolioCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activePortfolioCategory === cat
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#F0ECE1] text-[#52504E] hover:bg-[#E8E2D2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {filteredPortfolio.slice(0, 12).map((item, idx) => (
            <div key={item.id} className="break-inside-avoid">
              <div className={`relative overflow-hidden rounded-2xl group ${idx % 5 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <div>
                    <div className="text-[10px] font-bold text-[#C59B27] uppercase tracking-wider">{item.category}</div>
                    <div className="text-xs font-semibold text-white">{item.title}</div>
                    <div className="text-[10px] text-white/70">
                      {STUDIO_PHOTOGRAPHERS.find(p => p.id === item.photographerId)?.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Team ────────────────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#C59B27]">The Studio</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white">Meet Our Photographers</h2>
            <p className="mt-2 text-sm text-[#B0AAA0] max-w-lg mx-auto">When you book with us, you book with the best. Our associates are hand-picked and trained to maintain the same creative standards.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STUDIO_PHOTOGRAPHERS.map(photog => (
              <div key={photog.id} className={`rounded-3xl border p-6 text-center ${photog.role === 'main' ? 'border-[#C59B27]/50 bg-[#C59B27]/5' : 'border-white/10 bg-white/5'}`}>
                {photog.role === 'main' && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C59B27] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-3">
                    <Award className="h-3 w-3" /> Lead Photographer
                  </div>
                )}
                <img
                  src={photog.avatar}
                  alt={photog.name}
                  className={`mx-auto h-24 w-24 rounded-full object-cover mb-4 ${photog.role === 'main' ? 'ring-2 ring-[#C59B27] ring-offset-2 ring-offset-[#1A1A1A]' : ''}`}
                />
                <h3 className="font-serif text-lg font-bold text-white">{photog.name}</h3>
                <p className="text-[11px] text-[#C59B27] font-semibold mt-0.5">{photog.experience} yrs exp.</p>
                <p className="mt-2 text-xs text-[#A0A0A0] leading-relaxed">{photog.shortBio}</p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  <StarRating rating={photog.rating} />
                  <span className="text-xs text-[#767471] ml-1">{photog.rating} ({photog.reviewCount})</span>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {photog.specialties.slice(0, 3).map(s => (
                    <span key={s} className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] text-[#B0AAA0]">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C59B27]">Client Stories</span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#1A1A1A]">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="rounded-2xl border border-[#E8E2D2] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.rating }, (_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#C59B27] text-[#C59B27]" />
                ))}
              </div>
              <p className="text-sm text-[#52504E] leading-relaxed italic">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-bold text-[#1A1A1A]">{t.name}</div>
                  <div className="text-[11px] text-[#C59B27] font-semibold">{t.event}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#C59B27]/20 border border-[#C59B27]/30 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#C59B27] mb-5">
            <Sparkles className="h-3 w-3" />
            Ready to Book?
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Let's create something beautiful together.
          </h2>
          <p className="mt-3 text-sm text-[#B0AAA0] leading-relaxed max-w-lg mx-auto">
            Book your session in minutes. Choose your date, pick your time slots, and we'll handle the rest. Zero upfront payment required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/book')}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#C59B27] px-8 py-4 text-sm font-bold text-[#1A1A1A] hover:bg-[#D4AF37] transition shadow-lg"
            >
              <Camera className="h-4 w-4" /> Book a Session
            </button>
            <a
              href={`tel:${STUDIO_INFO.phone.replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 transition"
            >
              <Phone className="h-4 w-4" /> {STUDIO_INFO.phone}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
