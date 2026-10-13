-- =========================================================
-- PHOTOBOOK - MINIMAL SEED DATA (LITTLE DATA)
-- Run this in your Supabase SQL Editor after schema.sql
-- =========================================================

-- 1. SEED PROFILES (1 Patron Client, 2 Curated Visual Artists)
INSERT INTO public.profiles (id, email, role, full_name, avatar_url, phone)
VALUES
  (
    '11111111-1111-4111-a111-111111111111',
    'rhea.kapoor@example.com',
    'customer',
    'Rhea Kapoor',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    '+91 98250 12345'
  ),
  (
    '22222222-2222-4222-a222-222222222222',
    'arjun@arjunphotography.in',
    'photographer',
    'Arjun K.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    '+91 98980 67890'
  ),
  (
    '33333333-3333-4333-a333-333333333333',
    'contact@meerasen.com',
    'photographer',
    'Meera Sen',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    '+91 94290 54321'
  )
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  phone = EXCLUDED.phone;

-- 2. SEED PHOTOGRAPHER PROFILES
INSERT INTO public.photographer_profiles (
  id,
  business_name,
  bio,
  city,
  state,
  country,
  travel_range_km,
  starting_price,
  rating,
  review_count,
  is_verified,
  is_featured,
  gear,
  languages,
  honors,
  experience_years,
  shoots_completed,
  hero_images,
  categories,
  blackout_dates
)
VALUES
  (
    '22222222-2222-4222-a222-222222222222',
    'Arjun K. Photography',
    'Specializing in candid heritage wedding & fine-art destination visual storytelling across India and royal heritage venues.',
    'Ahmedabad',
    'Gujarat',
    'India',
    450,
    45000,
    4.96,
    38,
    true,
    true,
    ARRAY['Leica SL2-S', 'Sony A1 Dual Bodies', '50mm f/1.2 GM', '35mm f/1.4 GM'],
    ARRAY['English', 'Hindi', 'Gujarati'],
    ARRAY['Fearless Photographers Award 2024', 'Better Photography Wedding Artist of the Year Nominee'],
    8,
    145,
    ARRAY[
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80'
    ],
    ARRAY['Wedding', 'Pre-Wedding', 'Portrait'],
    ARRAY['2026-10-15', '2026-10-16']
  ),
  (
    '33333333-3333-4333-a333-333333333333',
    'Meera Sen Studio',
    'Editorial fashion, contemporary portraiture, and high-elegance intimate celebration narratives with natural light mastery.',
    'Mumbai',
    'Maharashtra',
    'India',
    250,
    35000,
    4.92,
    29,
    true,
    true,
    ARRAY['Canon EOS R5', 'RF 85mm f/1.2L', 'RF 28-70mm f/2L', 'Profoto B10X'],
    ARRAY['English', 'Hindi', 'Bengali'],
    ARRAY['Vogue India Featured Artist 2023', 'Harper’s Bazaar Emerging Visionary'],
    6,
    95,
    ARRAY[
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80'
    ],
    ARRAY['Fashion & Editorial', 'Portrait', 'Event'],
    ARRAY['2026-11-05']
  )
ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  bio = EXCLUDED.bio,
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;

-- 3. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, icon_name, artist_count, image_url)
VALUES
  (
    'cat-wedding',
    'Wedding',
    'wedding',
    'Heart',
    142,
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'cat-prewedding',
    'Pre-Wedding',
    'pre-wedding',
    'Sparkles',
    85,
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'cat-portrait',
    'Portrait',
    'portrait',
    'Camera',
    112,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'cat-fashion',
    'Fashion & Editorial',
    'fashion',
    'Crown',
    48,
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  artist_count = EXCLUDED.artist_count;

-- 4. SEED PACKAGES
INSERT INTO public.packages (
  id,
  photographer_id,
  name,
  tagline,
  price,
  duration_hours,
  deliverables,
  turnaround_days,
  is_popular,
  is_active
)
VALUES
  (
    '44444444-4444-4444-a444-444444444441',
    '22222222-2222-4222-a222-222222222222',
    'Heritage Wedding Master',
    'Full day comprehensive bridal & celebration documentation with two master cinematographers.',
    85000,
    10,
    ARRAY[
      '10 Hours On-Site Coverage with Arjun + 1 Associate',
      '500+ Master Color Graded High-Resolution Digital Negatives',
      'Curated Leather-bound 40-page Fine-Art Heirloom Album',
      'Private Encrypted Cloud Gallery Vault with PIN Access'
    ],
    14,
    true,
    true
  ),
  (
    '44444444-4444-4444-a444-444444444442',
    '22222222-2222-4222-a222-222222222222',
    'Editorial Pre-Wedding',
    'Cinematic couple session at heritage or scenic outdoor destination.',
    45000,
    4,
    ARRAY[
      '4 Hours Golden Hour Session at 2 Locations',
      '120 Curated Magazine-grade Retouched Images',
      'Teaser Slideshow Film in 4K',
      'High-Speed Online Download Vault'
    ],
    7,
    false,
    true
  ),
  (
    '44444444-4444-4444-a444-444444444443',
    '33333333-3333-4333-a333-333333333333',
    'Editorial Lookbook Collection',
    'High fashion atelier lookbook or premium brand styling shoot.',
    55000,
    6,
    ARRAY[
      '6 Hours Studio or Location Shoot',
      '8 Complete Styled Looks / Outfits',
      '75 Commercial-use Retouched High-Res Frames',
      'Expedited Digital Proofing in 48 Hours'
    ],
    10,
    true,
    true
  ),
  (
    '44444444-4444-4444-a444-444444444444',
    '33333333-3333-4333-a333-333333333333',
    'Signature Personal Portrait',
    'Artistic portraiture celebrating milestone, executive profile, or artistic expression.',
    35000,
    3,
    ARRAY[
      '3 Hours Dedicated Session with Hair & Makeup Guidance',
      '40 Fine-Art Retouched Images',
      '3 Archival Cotton Rag Physical Fine-Art Prints'
    ],
    5,
    false,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 5. SEED PORTFOLIO ITEMS
INSERT INTO public.portfolio_items (
  id,
  photographer_id,
  title,
  image_url,
  category,
  caption
)
VALUES
  (
    '55555555-5555-4555-a555-555555555551',
    '22222222-2222-4222-a222-222222222222',
    'Udaipur Palace Sunset Vows',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    'Wedding',
    'Natural candid emotions during sunset ceremony at Lake Palace, Udaipur.'
  ),
  (
    '55555555-5555-4555-a555-555555555552',
    '22222222-2222-4222-a222-222222222222',
    'Amber Fort Twilight Prelude',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    'Pre-Wedding',
    'Soft dramatic twilight architecture in Jaipur.'
  ),
  (
    '55555555-5555-4555-a555-555555555553',
    '22222222-2222-4222-a222-222222222222',
    'Bridal Heritage Adornment',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    'Portrait',
    'Intricate hand-embroidered zardozi and kundan jewelry captured in soft diffused sunlight.'
  ),
  (
    '55555555-5555-4555-a555-555555555554',
    '33333333-3333-4333-a333-333333333333',
    'South Bombay Vogue Session',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    'Fashion & Editorial',
    'Contemporary high fashion styling amidst historic Victorian Gothic architecture.'
  ),
  (
    '55555555-5555-4555-a555-555555555555',
    '33333333-3333-4333-a333-333333333333',
    'Colaba Monochromes',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    'Portrait',
    'High contrast natural light black and white portraiture.'
  ),
  (
    '55555555-5555-4555-a555-555555555556',
    '33333333-3333-4333-a333-333333333333',
    'Atelier Silk Drapery',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    'Fashion & Editorial',
    'Handloom organza drapery editorial movement.'
  )
ON CONFLICT (id) DO NOTHING;

-- 6. SEED SAMPLE BOOKING
INSERT INTO public.bookings (
  id,
  booking_code,
  customer_id,
  photographer_id,
  package_id,
  status,
  event_date,
  event_time_start,
  event_time_end,
  duration_hours,
  event_type,
  venue_name,
  venue_address,
  guest_count,
  creative_notes,
  total_price,
  delivered_gallery_pin,
  delivered_photos_count,
  delivered_gallery_url
)
VALUES
  (
    '66666666-6666-4666-a666-666666666661',
    'PB-9042',
    '11111111-1111-4111-a111-111111111111',
    '22222222-2222-4222-a222-222222222222',
    '44444444-4444-4444-a444-444444444441',
    'confirmed',
    '2026-11-20',
    '16:00',
    '02:00',
    10,
    'Wedding Ceremony & Reception',
    'The Oberoi Udaivilas',
    'Haridas Ji Ki Magri, Udaipur, Rajasthan 313001',
    250,
    'Please focus on candid emotional moments between grandparents and families during the twilight pheras.',
    85000,
    'PB-7892',
    NULL,
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- 7. SEED SAMPLE REVIEW
INSERT INTO public.reviews (
  id,
  booking_id,
  customer_id,
  photographer_id,
  rating,
  creativity_rating,
  punctuality_rating,
  professionalism_rating,
  comment,
  event_title
)
VALUES
  (
    '77777777-7777-4777-a777-777777777771',
    '66666666-6666-4666-a666-666666666661',
    '11111111-1111-4111-a111-111111111111',
    '22222222-2222-4222-a222-222222222222',
    5.0,
    5.0,
    5.0,
    5.0,
    'Arjun and his team were an absolute dream. He captured unspoken emotions and the golden hour light in Udaipur was pure poetry. Our families treasure every single photograph!',
    'Udaipur Royal Wedding'
  )
ON CONFLICT (id) DO NOTHING;

-- 8. SEED INITIAL MESSAGES
INSERT INTO public.messages (
  id,
  booking_id,
  sender_id,
  receiver_id,
  content,
  is_read
)
VALUES
  (
    '88888888-8888-4888-a888-888888888881',
    '66666666-6666-4666-a666-666666666661',
    '11111111-1111-4111-a111-111111111111',
    '22222222-2222-4222-a222-222222222222',
    'Namaste Arjun! We are thrilled to confirm you for our wedding in Udaipur on Nov 20th.',
    true
  ),
  (
    '88888888-8888-4888-a888-888888888882',
    '66666666-6666-4666-a666-666666666661',
    '22222222-2222-4222-a222-222222222222',
    '11111111-1111-4111-a111-111111111111',
    'Hello Rhea! Truly honored to document your celebration. I have reviewed your notes on candid family frames—we will make it timeless.',
    true
  )
ON CONFLICT (id) DO NOTHING;
