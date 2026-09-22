import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_PHOTOGRAPHERS,
  INITIAL_PACKAGES,
  INITIAL_PORTFOLIO_ITEMS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_MESSAGES
} from '@/lib/data/mock-db';

export async function GET() {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({
      configured: false,
      message: 'Supabase credentials not configured in environment.'
    }, { status: 400 });
  }

  try {
    // Check if tables exist
    const { data: catData, error: catError } = await supabase.from('categories').select('id').limit(1);
    
    if (catError) {
      return NextResponse.json({
        configured: true,
        tables_ready: false,
        error: catError.message,
        hint: 'Please run the SQL statements in supabase/schema.sql in your Supabase SQL Editor.'
      });
    }

    const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
    const { count: photogCount } = await supabase.from('photographer_profiles').select('*', { count: 'exact', head: true });

    return NextResponse.json({
      configured: true,
      tables_ready: true,
      counts: {
        categories: catCount ?? 0,
        photographers: photogCount ?? 0,
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ configured: true, error: message }, { status: 500 });
  }
}

export async function POST() {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      message: 'Supabase credentials missing.'
    }, { status: 400 });
  }

  const results: Record<string, unknown> = {};

  try {
    // 1. Seed Profiles
    const { data: pData, error: pError } = await supabase
      .from('profiles')
      .upsert(
        INITIAL_USERS.map((u) => ({
          id: u.id,
          email: u.email,
          role: u.role,
          full_name: u.full_name,
          avatar_url: u.avatar_url,
          phone: u.phone,
        }))
      )
      .select();
    results.profiles = pError ? { error: pError.message } : { count: pData?.length };

    // 2. Seed Photographer Profiles
    const { data: ppData, error: ppError } = await supabase
      .from('photographer_profiles')
      .upsert(
        INITIAL_PHOTOGRAPHERS.map((p) => ({
          id: p.id,
          business_name: p.business_name,
          bio: p.bio,
          city: p.city,
          state: p.state,
          country: p.country,
          travel_range_km: p.travel_range_km,
          starting_price: p.starting_price,
          rating: p.rating,
          review_count: p.review_count,
          is_verified: p.is_verified,
          is_featured: p.is_featured,
          gear: p.gear,
          languages: p.languages,
          honors: p.honors,
          experience_years: p.experience_years,
          shoots_completed: p.shoots_completed,
          hero_images: p.hero_images,
          categories: p.categories,
          blackout_dates: p.blackout_dates || [],
        }))
      )
      .select();
    results.photographers = ppError ? { error: ppError.message } : { count: ppData?.length };

    // 3. Seed Categories
    const { data: cData, error: cError } = await supabase
      .from('categories')
      .upsert(
        INITIAL_CATEGORIES.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon_name: c.iconName,
          artist_count: c.artist_count,
          image_url: c.image_url,
        }))
      )
      .select();
    results.categories = cError ? { error: cError.message } : { count: cData?.length };

    // 4. Seed Packages
    const { data: pkgData, error: pkgError } = await supabase
      .from('packages')
      .upsert(
        INITIAL_PACKAGES.map((pkg) => ({
          id: pkg.id,
          photographer_id: pkg.photographer_id,
          name: pkg.name,
          tagline: pkg.tagline,
          price: pkg.price,
          duration_hours: pkg.duration_hours,
          deliverables: pkg.deliverables,
          turnaround_days: pkg.turnaround_days,
          is_popular: pkg.is_popular,
          is_active: pkg.is_active,
        }))
      )
      .select();
    results.packages = pkgError ? { error: pkgError.message } : { count: pkgData?.length };

    // 5. Seed Portfolio Items
    const { data: portData, error: portError } = await supabase
      .from('portfolio_items')
      .upsert(
        INITIAL_PORTFOLIO_ITEMS.map((item) => ({
          id: item.id,
          photographer_id: item.photographer_id,
          title: item.title,
          image_url: item.image_url,
          category: item.category,
          caption: item.caption,
          views: item.views || 0,
        }))
      )
      .select();
    results.portfolio_items = portError ? { error: portError.message } : { count: portData?.length };

    // 6. Seed Bookings
    const { data: bData, error: bError } = await supabase
      .from('bookings')
      .upsert(
        INITIAL_BOOKINGS.map((b) => ({
          id: b.id,
          booking_code: b.booking_code,
          customer_id: b.customer_id,
          photographer_id: b.photographer_id,
          package_id: b.package_id,
          status: b.status,
          event_date: b.event_date,
          event_time_start: b.event_time_start,
          event_time_end: b.event_time_end,
          duration_hours: b.duration_hours,
          event_type: b.event_type,
          venue_name: b.venue_name,
          venue_address: b.venue_address,
          guest_count: b.guest_count,
          creative_notes: b.creative_notes,
          total_price: b.total_price,
          delivered_gallery_pin: b.delivered_gallery_pin,
        }))
      )
      .select();
    results.bookings = bError ? { error: bError.message } : { count: bData?.length };

    // 7. Seed Reviews
    const { data: rData, error: rError } = await supabase
      .from('reviews')
      .upsert(
        INITIAL_REVIEWS.map((r) => ({
          id: r.id,
          booking_id: r.booking_id,
          customer_id: r.customer_id,
          photographer_id: r.photographer_id,
          rating: r.rating,
          creativity_rating: r.creativity_rating,
          punctuality_rating: r.punctuality_rating,
          professionalism_rating: r.professionalism_rating,
          comment: r.comment,
          event_title: r.event_title,
        }))
      )
      .select();
    results.reviews = rError ? { error: rError.message } : { count: rData?.length };

    // 8. Seed Messages
    const { data: mData, error: mError } = await supabase
      .from('messages')
      .upsert(
        INITIAL_MESSAGES.map((m) => ({
          id: m.id,
          booking_id: m.booking_id,
          sender_id: m.sender_id,
          receiver_id: m.receiver_id,
          content: m.content,
          is_read: m.is_read,
        }))
      )
      .select();
    results.messages = mError ? { error: mError.message } : { count: mData?.length };

    return NextResponse.json({
      success: true,
      message: 'Supabase seed data successfully synced!',
      results
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}
