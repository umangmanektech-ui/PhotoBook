import type { PhotographerDayAvailability, Service, StudioPhotographer, StudioPortfolioItem } from '@/lib/types/appointment';

// ─── Studio Info ───────────────────────────────────────────────────────────────

export const STUDIO_INFO = {
  name: 'Arjun Kumar Photography',
  tagline: 'Capturing your most precious moments with artistry and soul.',
  location: 'Ahmedabad, Gujarat',
  phone: '+91 98765 43210',
  email: 'hello@arjunkumar.photography',
  instagram: '@arjunkumar.photography',
  established: 2016,
  totalSessions: 847,
  rating: 4.9,
  reviewCount: 312,
};

// ─── Photographers ─────────────────────────────────────────────────────────────

export const STUDIO_PHOTOGRAPHERS: StudioPhotographer[] = [
  {
    id: 'phot-arjun',
    name: 'Arjun Kumar',
    role: 'main',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    bio: "With over 8 years of experience capturing intimate celebrations across India, Arjun brings a photojournalistic eye to every session. His philosophy is simple — observe, wait, and capture the truth of the moment. Winner of the India Wedding Photographer of the Year award (2022, 2023), his work has been featured in Vogue India and Harper's Bazaar Bride.",
    shortBio: 'Award-winning photographer with 8+ years crafting visual stories across India.',
    specialties: ['Wedding', 'Pre-Wedding', 'Portrait', 'Editorial'],
    experience: 8,
    rating: 4.9,
    reviewCount: 247,
    instagram: '@arjunkumar.photography',
    portfolio: [],
  },
  {
    id: 'phot-priya',
    name: 'Priya Mehta',
    role: 'associate',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b9c638ee?auto=format&fit=crop&w=400&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80',
    bio: 'Priya specialises in natural-light portraiture and intimate couple sessions. Her gentle, unobtrusive approach creates a relaxed atmosphere that lets authentic emotions surface naturally.',
    shortBio: 'Natural-light portrait specialist with a gentle, candid approach.',
    specialties: ['Portrait', 'Maternity', 'Event', 'Pre-Wedding'],
    experience: 5,
    rating: 4.8,
    reviewCount: 89,
    instagram: '@priyamehta.frames',
    portfolio: [],
  },
  {
    id: 'phot-rohit',
    name: 'Rohit Shah',
    role: 'associate',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80',
    bio: 'Rohit brings a bold, cinematic aesthetic to events and corporate shoots. His background in film gives every frame a cinematic depth that makes clients feel like they are the protagonist of their own story.',
    shortBio: 'Cinematic storyteller specialising in events and corporate photography.',
    specialties: ['Event', 'Corporate', 'Product', 'Wedding'],
    experience: 4,
    rating: 4.7,
    reviewCount: 64,
    instagram: '@rohitshah.lens',
    portfolio: [],
  },
];

// ─── Portfolio Items ───────────────────────────────────────────────────────────

const PORTFOLIO_ITEMS: StudioPortfolioItem[] = [
  // Arjun — Wedding
  { id: 'pi-1', photographerId: 'phot-arjun', category: 'Wedding', title: 'Udaipur Palace Wedding', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi-2', photographerId: 'phot-arjun', category: 'Wedding', title: 'Golden Hour Ceremony', imageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi-3', photographerId: 'phot-arjun', category: 'Pre-Wedding', title: 'Rajasthan Sands', imageUrl: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi-4', photographerId: 'phot-arjun', category: 'Portrait', title: 'Studio Portrait', imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi-5', photographerId: 'phot-arjun', category: 'Wedding', title: 'Baraat Procession', imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi-6', photographerId: 'phot-arjun', category: 'Pre-Wedding', title: 'Lakeside Moments', imageUrl: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80' },
  // Priya — Portrait
  { id: 'pi-7', photographerId: 'phot-priya', category: 'Portrait', title: 'Window Light', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi-8', photographerId: 'phot-priya', category: 'Maternity', title: 'Expecting Joy', imageUrl: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi-9', photographerId: 'phot-priya', category: 'Pre-Wedding', title: 'Garden Romance', imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi-10', photographerId: 'phot-priya', category: 'Event', title: 'Birthday Celebrations', imageUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80' },
  // Rohit — Event
  { id: 'pi-11', photographerId: 'phot-rohit', category: 'Event', title: 'Corporate Summit', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi-12', photographerId: 'phot-rohit', category: 'Wedding', title: 'Cinematic Ceremony', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi-13', photographerId: 'phot-rohit', category: 'Event', title: 'Cultural Gala', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80' },
  { id: 'pi-14', photographerId: 'phot-rohit', category: 'Corporate', title: 'Brand Portraits', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' },
];

// Assign portfolios to photographers
STUDIO_PHOTOGRAPHERS.forEach((p) => {
  p.portfolio = PORTFOLIO_ITEMS.filter((item) => item.photographerId === p.id);
});

export const ALL_PORTFOLIO_ITEMS = PORTFOLIO_ITEMS;

// ─── Services ─────────────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    id: 'svc-portrait',
    name: 'Portrait Session',
    description: 'Timeless individual or couple portraits in studio or outdoor setting.',
    durationLabel: '2 Hours Base Slot',
    slotsRequired: 2,
    startingPrice: 5000,
    emoji: '🖼️',
    popular: false,
    includes: ['2-hour standard slot included', '30+ edited images', 'Online gallery', 'Extra time: ₹2,500/hr'],
  },
  {
    id: 'svc-prewedding',
    name: 'Pre-Wedding',
    description: 'Romantic storytelling session at your favourite location.',
    durationLabel: '4 Hours Base Slot',
    slotsRequired: 4,
    startingPrice: 25000,
    emoji: '💑',
    popular: true,
    includes: ['4-hour standard slot included', '100+ edited images', 'Location scouting', 'Extra time: ₹6,250/hr'],
  },
  {
    id: 'svc-wedding',
    name: 'Wedding Coverage',
    description: 'Full-day coverage of your celebrations — from getting ready to reception.',
    durationLabel: '8 Hours Full Day',
    slotsRequired: 8,
    startingPrice: 75000,
    emoji: '💍',
    popular: false,
    includes: ['8-hour full day slot included', '500+ edited images', '2 photographers', 'Extra time: ₹9,375/hr'],
  },
  {
    id: 'svc-event',
    name: 'Event Coverage',
    description: 'Corporate events, birthdays, anniversaries, and milestone celebrations.',
    durationLabel: '4 Hours Base Slot',
    slotsRequired: 4,
    startingPrice: 15000,
    emoji: '🎉',
    popular: false,
    includes: ['4-hour standard slot included', '200+ edited images', 'Same-day previews', 'Extra time: ₹3,750/hr'],
  },
  {
    id: 'svc-maternity',
    name: 'Maternity & Newborn',
    description: 'Celebrating new life with gentle, emotion-filled imagery.',
    durationLabel: '2 Hours Base Slot',
    slotsRequired: 2,
    startingPrice: 8000,
    emoji: '🌸',
    popular: false,
    includes: ['2-hour standard slot included', '40+ edited images', 'Props included', 'Extra time: ₹4,000/hr'],
  },
];

// ─── Pre-seeded Booked Slots (Demo Data) ──────────────────────────────────────

const today = new Date();
const dateStr = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

export const SEEDED_BOOKED_SLOTS: PhotographerDayAvailability[] = [
  // Arjun busy tomorrow morning
  { photographerId: 'phot-arjun', date: dateStr(1), bookedSlots: ['ts-0900', 'ts-1000', 'ts-1100'] },
  // Priya busy tomorrow afternoon
  { photographerId: 'phot-priya', date: dateStr(1), bookedSlots: ['ts-1400', 'ts-1500'] },
  // Arjun fully booked day after tomorrow (wedding)
  { photographerId: 'phot-arjun', date: dateStr(2), bookedSlots: ['ts-0900','ts-1000','ts-1100','ts-1200','ts-1400','ts-1500','ts-1600','ts-1700'] },
  // Arjun partially busy in 3 days
  { photographerId: 'phot-arjun', date: dateStr(3), bookedSlots: ['ts-1400', 'ts-1500', 'ts-1600'] },
  // Rohit busy in 3 days
  { photographerId: 'phot-rohit', date: dateStr(3), bookedSlots: ['ts-0900', 'ts-1000'] },
];

// ─── Testimonials ──────────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Rhea & Kabir Singhania',
    event: 'Wedding – Udaipur Palace',
    quote: 'Arjun didn\'t just photograph our wedding — he documented our souls. Every frame tells a story we never knew was happening around us.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Meera Patel',
    event: 'Maternity Session',
    quote: 'Priya made me feel completely at ease. The photos are so natural and filled with warmth — I treasure every single one.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c638ee?auto=format&fit=crop&w=100&q=80',
    rating: 5,
  },
  {
    id: 't3',
    name: 'TechPrime India',
    event: 'Annual Summit 2024',
    quote: 'Rohit\'s cinematic style elevated our corporate event photography to another level. Professional, quick, and incredibly talented.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    rating: 5,
  },
];

// ─── Service Add-ons (Enrich-style upsells) ───────────────────────────────────

export interface StudioAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export const STUDIO_ADDONS: StudioAddon[] = [
  {
    id: 'addon-drone',
    name: 'Cinematic Drone Coverage',
    description: '4K aerial cinematic perspective of outdoor grounds & venues',
    price: 3500,
    icon: '🚁',
  },
  {
    id: 'addon-reel',
    name: 'Same-Day Instagram Reel',
    description: 'Edited 60s viral-ready teaser reel delivered within 24 hours',
    price: 2000,
    icon: '🎬',
  },
  {
    id: 'addon-raw',
    name: 'RAW Files & Wooden USB Drive',
    description: 'Complete uncompressed master files in keepsake wooden box',
    price: 1500,
    icon: '🎞️',
  },
  {
    id: 'addon-second-shooter',
    name: 'Second Shooter Assistant',
    description: 'Simultaneous candid audience & ceremony angle coverage',
    price: 4000,
    icon: '📸',
  },
  {
    id: 'addon-album',
    name: 'Luxury Hardcover Photo Album',
    description: '30-page handcrafted flush-mount archival photobook',
    price: 5000,
    icon: '🖼️',
  },
];
