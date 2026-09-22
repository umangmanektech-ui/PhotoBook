import {
  UserProfile,
  PhotographerProfile,
  Category,
  PackageTier,
  PortfolioItem,
  Booking,
  ChatMessage,
  Review,
  AppNotification
} from '../types';

export const INITIAL_USERS: UserProfile[] = [];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-wedding',
    name: 'Wedding',
    slug: 'wedding',
    iconName: 'Heart',
    artist_count: 142,
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-prewedding',
    name: 'Pre-Wedding',
    slug: 'pre-wedding',
    iconName: 'Sparkles',
    artist_count: 85,
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-portrait',
    name: 'Portrait',
    slug: 'portrait',
    iconName: 'Camera',
    artist_count: 112,
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-event',
    name: 'Event',
    slug: 'event',
    iconName: 'Calendar',
    artist_count: 64,
    image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-fashion',
    name: 'Fashion & Editorial',
    slug: 'fashion',
    iconName: 'Crown',
    artist_count: 48,
    image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-maternity',
    name: 'Maternity',
    slug: 'maternity',
    iconName: 'Sun',
    artist_count: 39,
    image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
  }
];

export const INITIAL_PHOTOGRAPHERS: PhotographerProfile[] = [
  {
    id: 'user-photographer-arjun',
    business_name: 'Arjun K. Photography',
    bio: 'Specializing in candid wedding & fine-art destination visual storytelling. Capturing natural poetry, unscripted grace, and authentic human emotions across Rajasthan, Gujarat and international heritage destinations.',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    travel_range_km: 1500,
    starting_price: 8000,
    rating: 4.92,
    review_count: 128,
    is_verified: true,
    is_featured: true,
    gear: ['Sony Alpha A7 IV (x2)', 'GM 24-70mm f/2.8 II', 'GM 85mm f/1.4', 'Profoto A10 Flashes', 'DJI Mavic 3 Pro'],
    languages: ['Gujarati', 'English', 'Hindi'],
    honors: ['Vogue India Top 20 Wedding Visualists 2023', 'Fearless Photographers Awarded 2024', 'WedMeGood Gold Standard'],
    experience_years: 8,
    shoots_completed: 320,
    hero_images: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85'
    ],
    categories: ['Wedding', 'Pre-Wedding', 'Portrait']
  },
  {
    id: 'user-photographer-miraal',
    business_name: 'Miraal Studio',
    bio: 'Contemporary portraiture and intimate celebration narratives. Focused on warm natural light, quiet moments, and timeless tones that age like vintage wine.',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    travel_range_km: 300,
    starting_price: 12000,
    rating: 4.95,
    review_count: 84,
    is_verified: true,
    is_featured: false,
    gear: ['Canon EOS R5', 'Canon RF 50mm f/1.2L', 'Canon RF 28-70mm f/2L'],
    languages: ['Hindi', 'English', 'Gujarati'],
    honors: ['Better Photography Excellence 2023'],
    experience_years: 6,
    shoots_completed: 180,
    hero_images: [
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1524863479829-916d8e77f114?auto=format&fit=crop&w=1000&q=85'
    ],
    categories: ['Portrait', 'Fashion & Editorial', 'Pre-Wedding']
  },
  {
    id: 'user-photographer-meera',
    business_name: 'Meera Sen Visuals',
    bio: 'Heirloom visual stories for royal palace weddings, intimate havellis, and heritage celebrations. Every photograph is composed as an oil painting.',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    travel_range_km: 2000,
    starting_price: 18000,
    rating: 4.94,
    review_count: 110,
    is_verified: true,
    is_featured: true,
    gear: ['Hasselblad X2D 100C', 'Leica M11', 'Sony A1'],
    languages: ['Hindi', 'English'],
    honors: ['Architectural Digest Feature', 'Harper’s Bazaar Bride 2024'],
    experience_years: 10,
    shoots_completed: 410,
    hero_images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85'
    ],
    categories: ['Wedding', 'Pre-Wedding', 'Event']
  },
  {
    id: 'user-photographer-kabir',
    business_name: 'Kabir Lens & Co.',
    bio: 'Cinematography and master stills for high-profile weddings and luxury brand events. Combining 4K aerial drone perspectives with candid close-ups.',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    travel_range_km: 2500,
    starting_price: 22000,
    rating: 4.96,
    review_count: 145,
    is_verified: true,
    is_featured: true,
    gear: ['RED Komodo 6K', 'Sony FX3', 'G Master Lenses'],
    languages: ['Hindi', 'English', 'Marwari'],
    honors: ['WeddingSutra Gold Winner', 'Dronestagram Global Top 10'],
    experience_years: 11,
    shoots_completed: 520,
    hero_images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85'
    ],
    categories: ['Wedding', 'Event', 'Fashion & Editorial']
  },
  {
    id: 'user-photographer-dev',
    business_name: 'Dev Varma Visuals',
    bio: 'Energetic celebration photography capturing raw laughter, tears of joy, and the midnight dance floor euphoria. Fast delivery and vibrant color fidelity.',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    travel_range_km: 1000,
    starting_price: 15000,
    rating: 4.88,
    review_count: 96,
    is_verified: true,
    is_featured: false,
    gear: ['Nikon Z8', 'Nikkor Z 70-200mm f/2.8 S', 'Nikkor Z 35mm f/1.8'],
    languages: ['Marathi', 'Hindi', 'English'],
    honors: ['Mumbai Press Club Photojournalism Special Mention'],
    experience_years: 7,
    shoots_completed: 240,
    hero_images: [
      'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85'
    ],
    categories: ['Event', 'Wedding', 'Portrait']
  },
  {
    id: 'user-photographer-ananya',
    business_name: 'Ananya Roy Fine Art',
    bio: 'Soulful portraits, intimate baby showers, and maternity visual poems. Creating safe, calm environments where natural expressions flourish effortlessly.',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    travel_range_km: 600,
    starting_price: 10000,
    rating: 4.86,
    review_count: 62,
    is_verified: true,
    is_featured: false,
    gear: ['Fujifilm GFX 100S', 'Fujinon GF 110mm f/2'],
    languages: ['Bengali', 'English', 'Kannada', 'Hindi'],
    honors: ['National Child & Maternity Portrait Winner 2023'],
    experience_years: 5,
    shoots_completed: 130,
    hero_images: [
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1524863479829-916d8e77f114?auto=format&fit=crop&w=1000&q=85'
    ],
    categories: ['Maternity', 'Portrait']
  }
];

export const INITIAL_PACKAGES: PackageTier[] = [
  // Arjun K. Packages (Matches Image 6 & Image 18)
  {
    id: 'pkg-arjun-essential',
    photographer_id: 'user-photographer-arjun',
    name: 'Essential Session',
    tagline: 'Portraits & Intimate Engagements',
    price: 8000,
    duration_hours: 2,
    deliverables: [
      '2 Hours on-location coverage',
      '100 Color-Graded high-res stills',
      'Private password-protected web gallery',
      '7-Day turnaround guarantee',
      'Print-ready master export files'
    ],
    turnaround_days: 7,
    is_popular: false,
    is_active: true,
  },
  {
    id: 'pkg-arjun-signature',
    photographer_id: 'user-photographer-arjun',
    name: 'Signature Folio',
    tagline: 'Complete Event & Pre-Wedding Narrative',
    price: 18000,
    duration_hours: 5,
    deliverables: [
      '5 Hours comprehensive coverage',
      '300 Retouched & color-mastered stills',
      'Handbound bespoke linen album (30 pages)',
      'Travel included within 50 km',
      'Full digital cloud archive with download PIN',
      'Drone aerial establishing photos included'
    ],
    turnaround_days: 10,
    is_popular: true,
    is_active: true,
  },
  {
    id: 'pkg-arjun-heritage',
    photographer_id: 'user-photographer-arjun',
    name: 'Grand Heritage Tier',
    tagline: 'Luxury Wedding Day Narrative',
    price: 30000,
    duration_hours: 8,
    deliverables: [
      'Full 8h+ day coverage with 2 master shooters',
      '500 Master edited RAW + high-res JPG files',
      '4K Cinematic Highlight Reel (3 minutes)',
      'Luxury heirloom Italian leather box with archival prints',
      'Unlimited location hopping across destination',
      'Express 72-hour preview curation of 40 highlight stills'
    ],
    turnaround_days: 14,
    is_popular: false,
    is_active: true,
  },
  // Meera Sen Packages
  {
    id: 'pkg-meera-royal',
    photographer_id: 'user-photographer-meera',
    name: 'Heritage Romance',
    tagline: 'Haveli & Palace Wedding Shoot',
    price: 18000,
    duration_hours: 4,
    deliverables: [
      '4 Hours heritage aesthetic shoot',
      '200 Fine-art graded master images',
      'Editorial color correction',
      'Online gallery with full rights'
    ],
    turnaround_days: 7,
    is_popular: true,
    is_active: true,
  },
  // Kabir Lens Packages
  {
    id: 'pkg-kabir-cinematic',
    photographer_id: 'user-photographer-kabir',
    name: 'Lakeside Cinema & Stills',
    tagline: 'Cinematic Pre-Wedding & Drone',
    price: 22000,
    duration_hours: 6,
    deliverables: [
      '6 Hours continuous coverage',
      '350 High-res retouched stills',
      'Drone aerial cinematic clips',
      'Personalized keepsake thumb drive'
    ],
    turnaround_days: 12,
    is_popular: true,
    is_active: true,
  }
];

export const INITIAL_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'frame-1',
    photographer_id: 'user-photographer-arjun',
    title: 'The Royal Vow • Jaipur',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85',
    category: 'Wedding',
    caption: 'Mandap sacred fire ceremony at Rambagh Palace courtyard.',
    views: 1420,
    created_at: '2024-02-10'
  },
  {
    id: 'frame-2',
    photographer_id: 'user-photographer-arjun',
    title: 'Twilight Echoes',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85',
    category: 'Pre-Wedding',
    caption: 'Sunset portrait session over the golden sand dunes.',
    views: 980,
    created_at: '2024-02-12'
  },
  {
    id: 'frame-3',
    photographer_id: 'user-photographer-arjun',
    title: 'Mudras of Light',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    category: 'Portrait',
    caption: 'Natural window chiaroscuro with traditional silver ornaments.',
    views: 1150,
    created_at: '2024-02-18'
  },
  {
    id: 'frame-4',
    photographer_id: 'user-photographer-arjun',
    title: 'Petals in Flight',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
    category: 'Wedding',
    caption: 'Baraat procession greeting with marigold and rose petal rain.',
    views: 2300,
    created_at: '2024-03-01'
  },
  {
    id: 'frame-5',
    photographer_id: 'user-photographer-arjun',
    title: 'Udaivilas Celebration',
    image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85',
    category: 'Wedding',
    caption: 'Reflection pool sangeet celebration under starlight chandeliers.',
    views: 1840,
    created_at: '2024-03-05'
  },
  {
    id: 'frame-6',
    photographer_id: 'user-photographer-arjun',
    title: 'Serenade at Stepwell',
    image_url: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?auto=format&fit=crop&w=1000&q=85',
    category: 'Pre-Wedding',
    caption: 'Adalaj Stepwell geometric arches architectural pre-wedding study.',
    views: 1670,
    created_at: '2024-03-12'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [];

export const INITIAL_MESSAGES: ChatMessage[] = [];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    booking_id: 'bk-verified-1',
    customer_id: 'user-client-v1',
    customer_name: 'Ananya & Rohan',
    customer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    photographer_id: 'user-photographer-arjun',
    rating: 5.0,
    creativity_rating: 5.0,
    punctuality_rating: 4.9,
    professionalism_rating: 5.0,
    comment: 'Booking through PhotoBook was seamless. The artist captured natural candid frames with timeless light and artistic elegance.',
    event_title: 'Wedding & Reception • Heritage Celebration',
    created_at: '2024-10-18T10:00:00Z',
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
