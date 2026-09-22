export type UserRole = 'customer' | 'photographer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url: string;
  phone?: string;
  city?: string;
  created_at?: string;
}

export interface PhotographerProfile {
  id: string; // matches profile id
  business_name: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  travel_range_km: number;
  starting_price: number;
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_featured: boolean;
  gear: string[];
  languages: string[];
  honors: string[];
  experience_years: number;
  shoots_completed: number;
  hero_images: string[];
  categories: string[];
  blackout_dates?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  artist_count: number;
  image_url: string;
}

export interface PackageTier {
  id: string;
  photographer_id: string;
  name: string;
  tagline: string;
  price: number;
  duration_hours: number;
  deliverables: string[];
  turnaround_days: number;
  is_popular?: boolean;
  is_active: boolean;
}

export interface PortfolioItem {
  id: string;
  photographer_id: string;
  title: string;
  image_url: string;
  category: string;
  caption?: string;
  views?: number;
  created_at?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled' | 'rejected';

export interface Booking {
  id: string;
  booking_code: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  photographer_id: string;
  photographer_name: string;
  photographer_city: string;
  photographer_image: string;
  package_id: string;
  package_name: string;
  status: BookingStatus;
  event_date: string; // YYYY-MM-DD
  event_time_start: string;
  event_time_end: string;
  duration_hours: number;
  event_type: string;
  venue_name: string;
  venue_address: string;
  guest_count: number;
  creative_notes?: string;
  total_price: number;
  created_at: string;
  delivered_gallery_pin?: string;
  delivered_photos_count?: number;
  delivered_gallery_url?: string;
}

export interface ChatMessage {
  id: string;
  booking_id: string;
  sender_id: string;
  sender_name: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  customer_name: string;
  customer_avatar?: string;
  photographer_id: string;
  rating: number;
  creativity_rating: number;
  punctuality_rating: number;
  professionalism_rating: number;
  comment: string;
  event_title: string;
  created_at: string;
}

export interface AvailabilityDate {
  date: string; // YYYY-MM-DD
  is_available: boolean;
  reason?: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'booking_request' | 'booking_accepted' | 'booking_delivered' | 'message' | 'system';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface FilterOptions {
  category?: string;
  city?: string;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availableThisWeek?: boolean;
  sortBy?: 'recommended' | 'rating' | 'price_asc' | 'price_desc' | 'shoots';
}
