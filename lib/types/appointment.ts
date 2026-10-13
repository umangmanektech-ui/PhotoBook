// ─── Time Slots ────────────────────────────────────────────────────────────────

export const TIME_SLOTS = [
  { id: 'ts-0900', time: '09:00', label: '9:00 AM' },
  { id: 'ts-1000', time: '10:00', label: '10:00 AM' },
  { id: 'ts-1100', time: '11:00', label: '11:00 AM' },
  { id: 'ts-1200', time: '12:00', label: '12:00 PM' },
  { id: 'ts-1300', time: '13:00', label: '1:00 PM' },
  { id: 'ts-1400', time: '14:00', label: '2:00 PM' },
  { id: 'ts-1500', time: '15:00', label: '3:00 PM' },
  { id: 'ts-1600', time: '16:00', label: '4:00 PM' },
  { id: 'ts-1700', time: '17:00', label: '5:00 PM' },
  { id: 'ts-1800', time: '18:00', label: '6:00 PM' },
] as const;

export type TimeSlotId = (typeof TIME_SLOTS)[number]['id'];

export interface TimeSlot {
  id: string;
  time: string;
  label: string;
}

// ─── Photographers ─────────────────────────────────────────────────────────────

export interface StudioPhotographer {
  id: string;
  name: string;
  role: 'main' | 'associate';
  avatar: string;
  coverImage: string;
  bio: string;
  shortBio: string;
  specialties: string[];
  experience: number; // years
  rating: number;
  reviewCount: number;
  instagram?: string;
  portfolio: StudioPortfolioItem[];
}

export interface StudioPortfolioItem {
  id: string;
  photographerId: string;
  imageUrl: string;
  category: string;
  title: string;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  name: string;
  description: string;
  durationLabel: string;
  /** How many 1-hour slots this service typically spans */
  slotsRequired: number;
  startingPrice: number;
  includes: string[];
  emoji: string;
  popular?: boolean;
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  photographerId: string;
  photographerName: string;
  date: string; // "YYYY-MM-DD"
  slots: string[]; // TimeSlot IDs booked in this appointment
  serviceId: string;
  serviceName: string;
  notes: string;
  status: AppointmentStatus;
  venueType?: 'studio' | 'on-location';
  venueAddress?: string;
  addons?: string[];
  totalAmount: number;
  createdAt: string;
}

// ─── Availability ──────────────────────────────────────────────────────────────

/** Which slots are free/booked for a given photographer on a date */
export interface PhotographerDayAvailability {
  photographerId: string;
  date: string;
  bookedSlots: string[]; // slot IDs that are taken
}
