'use client';

import {
  ALL_PORTFOLIO_ITEMS,
  STUDIO_INFO,
  STUDIO_PHOTOGRAPHERS,
} from '@/lib/data/studio-data';
import {
  ArrowRight,
  Award,
  Camera,
  Clock,
  Instagram,
  Sparkles,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.floor(rating)
              ? 'fill-[#C59B27] text-[#C59B27]'
              : 'text-[#D9D2C2]'
          }`}
        />
      ))}
    </div>
  );
}

export default function PhotographersPage() {
  const router = useRouter();

  const mainPhotographer = STUDIO_PHOTOGRAPHERS.find((p) => p.role === 'main')!;
  const associatePhotographers = STUDIO_PHOTOGRAPHERS.filter((p) => p.role === 'associate');

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1A1A]">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-[#E8E2D2] bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F0ECE1] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#997316] mb-3">
            <Sparkles className="h-3 w-3" />
            The Creative Team
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1A1A]">
            Meet Our Photographers
          </h1>
          <p className="mt-2 text-sm text-[#767471] max-w-2xl leading-relaxed">
            Our atelier is led by Arjun Kumar, supported by accomplished associate photographers. Learn about each artist&apos;s unique style, view their individual work, and select your preferred photographer for your session.
          </p>

          {/* Studio booking principle banner */}
          <div className="mt-8 rounded-2xl bg-[#FFFBF0] border border-[#C59B27]/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C59B27] text-[#1A1A1A]">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1A1A1A]">How Studio Booking Works</h4>
                <p className="text-xs text-[#767471] mt-0.5 leading-relaxed">
                  By default, all sessions are assigned to our <strong>Lead Artist Arjun Kumar</strong>. If Arjun is already booked for your date or time slot, you can easily choose our seasoned associates Priya or Rohit!
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/book')}
              className="shrink-0 flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#333] transition"
            >
              <span>Book Session</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#C59B27]" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {/* ── Lead Photographer Spotlight ────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-[#C59B27]" />
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Lead Photographer</h2>
          </div>

          <div className="overflow-hidden rounded-3xl border-2 border-[#C59B27] bg-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Photo & badge */}
              <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col items-center justify-start bg-[#FBF9F5]/60 border-b lg:border-b-0 lg:border-r border-[#F0ECE1]">
                <div className="relative w-full max-w-[240px]">
                  <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-[#E8E2D2]">
                    <img
                      src={mainPhotographer.avatar}
                      alt={mainPhotographer.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="mt-3.5 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C59B27] px-3.5 py-1 text-[10px] font-bold text-[#1A1A1A] shadow-xs uppercase tracking-wider">
                      <Award className="h-3.5 w-3.5" />
                      Studio Founder & Lead
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & details */}
              <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-3xl font-bold text-[#1A1A1A]">
                        {mainPhotographer.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#C59B27] mt-0.5">
                        {mainPhotographer.experience} Years Experience · {STUDIO_INFO.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-[#F0ECE1] px-3 py-1.5">
                      <StarRating rating={mainPhotographer.rating} />
                      <span className="text-xs font-bold text-[#1A1A1A]">
                        {mainPhotographer.rating} ({mainPhotographer.reviewCount})
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-[#52504E] leading-relaxed">
                    {mainPhotographer.bio}
                  </p>

                  {/* Specialties */}
                  <div className="mt-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#767471] block mb-2">
                      Core Specialties
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {mainPhotographer.specialties.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-[#FBF9F5] border border-[#D9D2C2] px-3 py-1 text-xs font-medium text-[#1A1A1A]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio preview */}
                  <div className="mt-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#767471] block mb-2">
                      Signature Works
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {ALL_PORTFOLIO_ITEMS.filter((i) => i.photographerId === mainPhotographer.id)
                        .slice(0, 4)
                        .map((item) => (
                          <div
                            key={item.id}
                            onClick={() => router.push('/portfolio')}
                            className="aspect-square rounded-xl overflow-hidden cursor-pointer group"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover transition group-hover:scale-105"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-[#F0ECE1] flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => router.push(`/book?photographer=${mainPhotographer.id}`)}
                    className="flex items-center gap-2 rounded-xl bg-[#C59B27] px-6 py-3 text-xs font-bold text-[#1A1A1A] hover:bg-[#D4AF37] transition shadow-md"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Book with {mainPhotographer.name.split(' ')[0]}</span>
                  </button>

                  <button
                    onClick={() => router.push('/portfolio')}
                    className="flex items-center gap-2 rounded-xl border border-[#D9D2C2] bg-white px-5 py-3 text-xs font-bold text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
                  >
                    <span>View Arjun&apos;s Portfolio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  {mainPhotographer.instagram && (
                    <a
                      href={`https://instagram.com/${mainPhotographer.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-1.5 text-xs text-[#767471] hover:text-[#C59B27]"
                    >
                      <Instagram className="h-4 w-4" />
                      <span>{mainPhotographer.instagram}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Associate Photographers ────────────────────────────────────────── */}
        <section>
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Associate Photographers</h2>
            <p className="text-xs text-[#767471] mt-1">
              Hand-picked and mentored by Arjun Kumar, delivering exceptional artistry and seamless client experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {associatePhotographers.map((photog) => {
              const photogWorks = ALL_PORTFOLIO_ITEMS.filter((i) => i.photographerId === photog.id);
              return (
                <div
                  key={photog.id}
                  className="rounded-3xl border border-[#E8E2D2] bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-4">
                      <img
                        src={photog.avatar}
                        alt={photog.name}
                        className="h-20 w-20 rounded-2xl object-cover ring-2 ring-[#F0ECE1]"
                      />
                      <div className="flex-1">
                        <span className="rounded-full bg-[#F0ECE1] px-2.5 py-0.5 text-[10px] font-bold text-[#767471] uppercase tracking-wider">
                          Associate Artist
                        </span>
                        <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mt-1">
                          {photog.name}
                        </h3>
                        <p className="text-xs text-[#C59B27] font-semibold">
                          {photog.experience} yrs exp. · {photog.specialties.slice(0, 2).join(' & ')}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <StarRating rating={photog.rating} />
                          <span className="text-[11px] text-[#767471]">
                            {photog.rating} ({photog.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-[#52504E] leading-relaxed">
                      {photog.bio}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {photog.specialties.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-[#FBF9F5] border border-[#E8E2D2] px-2.5 py-0.5 text-[10px] text-[#52504E]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Preview works */}
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {photogWorks.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => router.push('/portfolio')}
                          className="aspect-square rounded-xl overflow-hidden cursor-pointer group"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-[#F0ECE1] flex items-center justify-between">
                    <button
                      onClick={() => router.push(`/book?photographer=${photog.id}`)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#1A1A1A] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#333] transition"
                    >
                      <Camera className="h-3.5 w-3.5 text-[#C59B27]" />
                      <span>Book with {photog.name.split(' ')[0]}</span>
                    </button>

                    <button
                      onClick={() => router.push('/portfolio')}
                      className="flex items-center gap-1 text-xs font-semibold text-[#767471] hover:text-[#1A1A1A]"
                    >
                      <span>View Works</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
