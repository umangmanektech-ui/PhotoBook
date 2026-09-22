"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";
import {
  INITIAL_CATEGORIES,
  INITIAL_PACKAGES,
  INITIAL_PHOTOGRAPHERS,
  INITIAL_PORTFOLIO_ITEMS,
  INITIAL_REVIEWS,
  INITIAL_USERS,
} from "../data/mock-db";
import {
  AppNotification,
  Booking,
  BookingStatus,
  Category,
  ChatMessage,
  PackageTier,
  PhotographerProfile,
  PortfolioItem,
  Review,
  UserProfile,
} from "../types";

export const GUEST_USER: UserProfile = {
  id: "user-guest",
  email: "guest@photobook.app",
  role: "customer",
  full_name: "Guest Explorer",
  avatar_url:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
  phone: "",
  city: "Ahmedabad",
  created_at: "2025-01-01T00:00:00Z",
};

interface StoreData {
  users: UserProfile[];
  currentUser: UserProfile;
  photographers: PhotographerProfile[];
  packages: PackageTier[];
  portfolioItems: PortfolioItem[];
  bookings: Booking[];
  messages: ChatMessage[];
  reviews: Review[];
  savedPhotographerIds: string[];
  notifications: AppNotification[];
}

const DEFAULT_STORE_DATA: StoreData = {
  users: [],
  currentUser: GUEST_USER,
  photographers: INITIAL_PHOTOGRAPHERS,
  packages: INITIAL_PACKAGES,
  portfolioItems: INITIAL_PORTFOLIO_ITEMS,
  bookings: [],
  messages: [],
  reviews: INITIAL_REVIEWS,
  savedPhotographerIds: [],
  notifications: [],
};

const STORAGE_KEY = "photobook_clean_v4";

let storeState: StoreData = DEFAULT_STORE_DATA;
const storeListeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      storeState = {
        ...DEFAULT_STORE_DATA,
        ...parsed,
        currentUser: parsed.currentUser || GUEST_USER,
        users: parsed.users || [],
        photographers:
          parsed.photographers && parsed.photographers.length
            ? parsed.photographers
            : INITIAL_PHOTOGRAPHERS,
      };
    }
  } catch {
    // Ignore parse error
  }
}

function subscribe(callback: () => void) {
  storeListeners.add(callback);
  return () => {
    storeListeners.delete(callback);
  };
}

function getSnapshot(): StoreData {
  return storeState;
}

function getServerSnapshot(): StoreData {
  return DEFAULT_STORE_DATA;
}

function setStoreState(updater: (prev: StoreData) => StoreData) {
  storeState = updater(storeState);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storeState));
    } catch {
      // Ignore storage write error
    }
  }
  storeListeners.forEach((listener) => listener());
}

export interface RegisterParams {
  role: "customer" | "photographer";
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  business_name?: string;
  bio?: string;
  starting_price?: number;
  categories?: string[];
  gear?: string[];
  experience_years?: number;
  avatar_url?: string;
}

interface AppContextType {
  users: UserProfile[];
  currentUser: UserProfile;
  isAuthenticated: boolean;
  photographers: PhotographerProfile[];
  categories: Category[];
  packages: PackageTier[];
  portfolioItems: PortfolioItem[];
  bookings: Booking[];
  messages: ChatMessage[];
  reviews: Review[];
  savedPhotographerIds: string[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  unreadMessagesCount: number;

  // Authentication & Profile Management
  switchUserRole: (role: "customer" | "photographer") => void;
  setCurrentUser: (user: UserProfile) => void;
  registerUser: (params: RegisterParams) => {
    success: boolean;
    user?: UserProfile;
    error?: string;
  };
  loginUser: (
    email: string,
    role?: "customer" | "photographer",
  ) => { success: boolean; user?: UserProfile; error?: string };
  logoutUser: () => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => void;
  updatePhotographerProfile: (
    photographerId: string,
    profileData: Partial<PhotographerProfile>,
  ) => void;

  // Bookings & Shortlist
  toggleSavePhotographer: (photographerId: string) => void;
  isPhotographerSaved: (photographerId: string) => boolean;
  requestBooking: (bookingParams: {
    photographerId: string;
    packageId: string;
    eventDate: string;
    eventTimeStart: string;
    eventTimeEnd: string;
    durationHours: number;
    eventType: string;
    venueName: string;
    venueAddress: string;
    guestCount: number;
    creativeNotes?: string;
  }) => { success: boolean; booking?: Booking; error?: string };
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  markGalleryDelivered: (
    bookingId: string,
    photoCount: number,
    pin: string,
    url: string,
  ) => void;

  // Messaging (kept for data layer completeness even if UI is hidden)
  sendMessage: (bookingId: string, content: string) => void;
  markMessagesRead: (bookingId: string) => void;

  // Studio Packages & Portfolio
  addPackage: (pkg: Omit<PackageTier, "id" | "photographer_id">) => void;
  createPackage: (pkg: Omit<PackageTier, "id" | "photographer_id">) => void;
  updatePackage: (pkg: PackageTier) => void;
  deletePackage: (packageId: string) => void;
  addPortfolioItem: (item: {
    title: string;
    image_url: string;
    category: string;
    caption?: string;
    photographer_id?: string;
  }) => void;
  deletePortfolioItem: (itemId: string) => void;

  // Calendar Availability
  blockedDates: string[];
  toggleDateBlock: (date: string) => void;
  checkAvailability: (
    photographerId: string,
    date: string,
  ) => { isAvailable: boolean; reason?: string };

  // Notifications
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const {
    users,
    currentUser,
    photographers,
    packages,
    portfolioItems,
    bookings,
    messages,
    reviews,
    savedPhotographerIds,
    notifications,
  } = store;

  const categories = INITIAL_CATEGORIES;

  const setCurrentUser = useCallback((user: UserProfile) => {
    setStoreState((prev) => ({ ...prev, currentUser: user }));
  }, []);

  const switchUserRole = useCallback((role: "customer" | "photographer") => {
    setStoreState((prev) => {
      const targetUser =
        prev.users.find((u) => u.role === role) ||
        (role === "customer" ? INITIAL_USERS[0] : INITIAL_USERS[1]);
      return {
        ...prev,
        currentUser: targetUser,
      };
    });
  }, []);

  const registerUser = useCallback((params: RegisterParams) => {
    if (!params.email || !params.full_name) {
      return { success: false, error: "Name and email are required." };
    }

    const userId = `user-${params.role}-${Date.now()}`;
    const defaultAvatar =
      params.avatar_url ||
      (params.role === "photographer"
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80");

    const newUser: UserProfile = {
      id: userId,
      email: params.email,
      role: params.role,
      full_name: params.full_name,
      avatar_url: defaultAvatar,
      phone: params.phone || "+91 98765 43210",
      city: params.city || "Ahmedabad",
      created_at: new Date().toISOString(),
    };

    let newPhotographer: PhotographerProfile | null = null;
    let starterPackages: PackageTier[] = [];
    let starterPortfolio: PortfolioItem[] = [];

    if (params.role === "photographer") {
      newPhotographer = {
        id: userId,
        business_name:
          params.business_name || `${params.full_name} Photography`,
        bio:
          params.bio ||
          "Fine-art and candid photography storytelling. Crafting timeless visual narratives.",
        city: params.city || "Ahmedabad",
        state: "Gujarat",
        country: "India",
        travel_range_km: 500,
        starting_price: params.starting_price || 12000,
        rating: 5.0,
        review_count: 0,
        is_verified: true,
        is_featured: false,
        gear:
          params.gear && params.gear.length > 0
            ? params.gear
            : ["Sony Alpha A7 IV", "24-70mm f/2.8 GM", "85mm f/1.4 GM"],
        languages: ["English", "Hindi"],
        honors: ["Verified PhotoBook Atelier Member"],
        experience_years: params.experience_years || 4,
        shoots_completed: 0,
        hero_images: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
        ],
        categories:
          params.categories && params.categories.length > 0
            ? params.categories
            : ["Wedding", "Portrait", "Pre-Wedding"],
        blackout_dates: [],
      };

      // Create initial starter packages
      starterPackages = [
        {
          id: `pkg-${userId}-1`,
          photographer_id: userId,
          name: "Essential Collection",
          tagline: "Portraits & Intimate Engagements",
          price: params.starting_price || 12000,
          duration_hours: 3,
          deliverables: [
            "3 Hours dedicated coverage",
            "120 Color-Graded high-resolution stills",
            "Private password-protected digital vault",
            "7-Day turnaround guarantee",
          ],
          turnaround_days: 7,
          is_popular: false,
          is_active: true,
        },
        {
          id: `pkg-${userId}-2`,
          photographer_id: userId,
          name: "Signature Folio",
          tagline: "Comprehensive Event & Wedding Story",
          price: (params.starting_price || 12000) * 2,
          duration_hours: 6,
          deliverables: [
            "6 Hours master coverage with 2 shooters",
            "300 Retouched & color-mastered master stills",
            "Handbound fine art photo album",
            "Full digital cloud archive with download PIN",
          ],
          turnaround_days: 10,
          is_popular: true,
          is_active: true,
        },
      ];

      // Create starter portfolio frames
      starterPortfolio = [
        {
          id: `frame-${userId}-1`,
          photographer_id: userId,
          title: "Golden Sunset Elegance",
          image_url:
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
          category: "Wedding",
          caption: "Sunset natural light portrait session.",
          views: 12,
          created_at: new Date().toISOString().split("T")[0],
        },
        {
          id: `frame-${userId}-2`,
          photographer_id: userId,
          title: "Candid Celebrations",
          image_url:
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85",
          category: "Pre-Wedding",
          caption: "Unscripted laughter and timeless emotion.",
          views: 18,
          created_at: new Date().toISOString().split("T")[0],
        },
      ];
    }

    setStoreState((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser,
      photographers: newPhotographer
        ? [newPhotographer, ...prev.photographers]
        : prev.photographers,
      packages:
        starterPackages.length > 0
          ? [...starterPackages, ...prev.packages]
          : prev.packages,
      portfolioItems:
        starterPortfolio.length > 0
          ? [...starterPortfolio, ...prev.portfolioItems]
          : prev.portfolioItems,
    }));

    return { success: true, user: newUser };
  }, []);

  const loginUser = useCallback(
    (email: string, preferredRole?: "customer" | "photographer") => {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) {
        return { success: false, error: "Please enter a valid email address." };
      }

      const existingUser = users.find(
        (u) => u.email.toLowerCase() === cleanEmail,
      );
      if (existingUser) {
        setStoreState((prev) => ({ ...prev, currentUser: existingUser }));
        return { success: true, user: existingUser };
      }

      // Auto-create newly logged-in account
      const role: "customer" | "photographer" = preferredRole || "customer";
      const namePart = cleanEmail
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email: cleanEmail,
        role,
        full_name:
          namePart ||
          (role === "photographer" ? "Studio Artist" : "Art Patron"),
        avatar_url:
          role === "photographer"
            ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
            : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        city: "Ahmedabad",
        created_at: new Date().toISOString(),
      };

      setStoreState((prev) => ({
        ...prev,
        users: [...prev.users, newUser],
        currentUser: newUser,
      }));
      return { success: true, user: newUser };
    },
    [users],
  );

  const logoutUser = useCallback(() => {
    setStoreState((prev) => ({
      ...prev,
      currentUser: GUEST_USER,
    }));
  }, []);

  const updateUserProfile = useCallback((profileData: Partial<UserProfile>) => {
    setStoreState((prev) => {
      const updatedCurrentUser = { ...prev.currentUser, ...profileData };
      return {
        ...prev,
        currentUser: updatedCurrentUser,
        users: prev.users.map((u) =>
          u.id === prev.currentUser.id ? { ...u, ...profileData } : u,
        ),
      };
    });
  }, []);

  const updatePhotographerProfile = useCallback(
    (photographerId: string, profileData: Partial<PhotographerProfile>) => {
      setStoreState((prev) => {
        const updatedPhotogs = prev.photographers.map((p) =>
          p.id === photographerId ? { ...p, ...profileData } : p,
        );
        return {
          ...prev,
          photographers: updatedPhotogs,
          // Also update currentUser name if it matches
          currentUser:
            prev.currentUser.id === photographerId && profileData.business_name
              ? {
                  ...prev.currentUser,
                  full_name: profileData.business_name,
                  city: profileData.city || prev.currentUser.city,
                }
              : prev.currentUser,
        };
      });
    },
    [],
  );

  const toggleSavePhotographer = useCallback((photographerId: string) => {
    setStoreState((prev) => {
      const exists = prev.savedPhotographerIds.includes(photographerId);
      return {
        ...prev,
        savedPhotographerIds: exists
          ? prev.savedPhotographerIds.filter((id) => id !== photographerId)
          : [...prev.savedPhotographerIds, photographerId],
      };
    });
  }, []);

  const isPhotographerSaved = useCallback(
    (photographerId: string) => savedPhotographerIds.includes(photographerId),
    [savedPhotographerIds],
  );

  const checkAvailability = useCallback(
    (photographerId: string, date: string) => {
      const targetPhotog = photographers.find((p) => p.id === photographerId);
      if (targetPhotog?.blackout_dates?.includes(date)) {
        return {
          isAvailable: false,
          reason: `Artist has blocked off ${date} in their diary.`,
        };
      }

      const existing = bookings.find(
        (b) =>
          b.photographer_id === photographerId &&
          b.event_date === date &&
          (b.status === "confirmed" || b.status === "pending"),
      );
      if (existing) {
        return {
          isAvailable: false,
          reason: `Artist is already engaged on ${date}`,
        };
      }
      return { isAvailable: true };
    },
    [bookings, photographers],
  );

  const requestBooking = useCallback(
    (params: {
      photographerId: string;
      packageId: string;
      eventDate: string;
      eventTimeStart: string;
      eventTimeEnd: string;
      durationHours: number;
      eventType: string;
      venueName: string;
      venueAddress: string;
      guestCount: number;
      creativeNotes?: string;
    }) => {
      // Strictly enforce that customers must be logged in to book
      if (
        currentUser.id === "user-guest" ||
        !currentUser.email ||
        currentUser.email === "guest@photobook.app"
      ) {
        return {
          success: false,
          error: "Please sign in or create an account to book a photographer.",
        };
      }

      const avail = checkAvailability(params.photographerId, params.eventDate);
      if (!avail.isAvailable) {
        return { success: false, error: avail.reason };
      }

      const photographer = photographers.find(
        (p) => p.id === params.photographerId,
      );
      const pkg = packages.find((p) => p.id === params.packageId);

      if (!photographer || !pkg) {
        return { success: false, error: "Photographer or Package not found" };
      }

      const codeNum = Math.floor(10000 + Math.random() * 90000);
      const bookingCode = `PB-${codeNum}`;

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        booking_code: bookingCode,
        customer_id: currentUser.id,
        customer_name: currentUser.full_name || "Valued Patron",
        customer_email: currentUser.email,
        customer_phone: currentUser.phone || "+91 98250 12345",
        photographer_id: photographer.id,
        photographer_name: photographer.business_name,
        photographer_city: photographer.city,
        photographer_image: photographer.hero_images[0] || "",
        package_id: pkg.id,
        package_name: pkg.name,
        status: "pending",
        event_date: params.eventDate,
        event_time_start: params.eventTimeStart,
        event_time_end: params.eventTimeEnd,
        duration_hours: params.durationHours,
        event_type: params.eventType,
        venue_name: params.venueName,
        venue_address: params.venueAddress,
        guest_count: params.guestCount,
        creative_notes: params.creativeNotes,
        total_price: pkg.price,
        created_at: new Date().toISOString(),
      };

      const photogNotif: AppNotification = {
        id: `notif-${Date.now()}-1`,
        user_id: photographer.id,
        title: "New Booking Inquiry Received",
        message: `${currentUser.full_name} requested ${pkg.name} for ${params.eventDate} at ${params.venueName}.`,
        type: "booking_request",
        link: "/studio/bookings",
        is_read: false,
        created_at: new Date().toISOString(),
      };

      const clientNotif: AppNotification = {
        id: `notif-${Date.now()}-2`,
        user_id: currentUser.id,
        title: "Reservation Request Dispatched",
        message: `Your booking request ${bookingCode} with ${photographer.business_name} has been sent. Zero upfront payment required.`,
        type: "system",
        link: "/bookings",
        is_read: false,
        created_at: new Date().toISOString(),
      };

      setStoreState((prev) => ({
        ...prev,
        bookings: [newBooking, ...prev.bookings],
        notifications: [photogNotif, clientNotif, ...prev.notifications],
      }));

      return { success: true, booking: newBooking };
    },
    [checkAvailability, photographers, packages, currentUser],
  );

  const updateBookingStatus = useCallback(
    (bookingId: string, status: BookingStatus) => {
      const booking = bookings.find((b) => b.id === bookingId);
      let notif: AppNotification | null = null;
      if (booking) {
        let title = `Booking Status Updated: ${status.toUpperCase()}`;
        let message = `Booking ${booking.booking_code} status was updated to ${status}.`;
        let targetUser = booking.customer_id;

        if (status === "confirmed") {
          title = "Booking Request Confirmed!";
          message = `${booking.photographer_name} has accepted and reserved ${booking.event_date} for you.`;
        } else if (status === "rejected") {
          title = "Booking Request Declined";
          message = `${booking.photographer_name} was unable to accept the date ${booking.event_date}.`;
        } else if (status === "cancelled") {
          title = "Booking Request Cancelled";
          message = `${booking.customer_name} cancelled reservation ${booking.booking_code}.`;
          targetUser = booking.photographer_id;
        }

        notif = {
          id: `notif-${Date.now()}`,
          user_id: targetUser,
          title,
          message,
          type: status === "confirmed" ? "booking_accepted" : "system",
          link:
            targetUser === booking.customer_id
              ? "/bookings"
              : "/studio/bookings",
          is_read: false,
          created_at: new Date().toISOString(),
        };
      }

      setStoreState((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.id === bookingId ? { ...b, status } : b,
        ),
        notifications: notif
          ? [notif, ...prev.notifications]
          : prev.notifications,
      }));
    },
    [bookings],
  );

  const markGalleryDelivered = useCallback(
    (bookingId: string, photoCount: number, pin: string, url: string) => {
      const booking = bookings.find((b) => b.id === bookingId);
      let notif: AppNotification | null = null;

      if (booking) {
        notif = {
          id: `notif-${Date.now()}`,
          user_id: booking.customer_id,
          title: "High-Res Gallery Delivered!",
          message: `${booking.photographer_name} has published ${photoCount} master photographs. Access PIN: ${pin}`,
          type: "booking_delivered",
          link: "/bookings",
          is_read: false,
          created_at: new Date().toISOString(),
        };
      }

      setStoreState((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                status: "delivered",
                delivered_photos_count: photoCount,
                delivered_gallery_pin: pin,
                delivered_gallery_url: url,
              }
            : b,
        ),
        notifications: notif
          ? [notif, ...prev.notifications]
          : prev.notifications,
      }));
    },
    [bookings],
  );

  const sendMessage = useCallback(
    (bookingId: string, content: string) => {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking || !content.trim()) return;

      const isPhotographer = currentUser.id === booking.photographer_id;
      const receiverId = isPhotographer
        ? booking.customer_id
        : booking.photographer_id;

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        booking_id: bookingId,
        sender_id: currentUser.id,
        sender_name: currentUser.full_name,
        receiver_id: receiverId,
        content: content.trim(),
        created_at: new Date().toISOString(),
        is_read: false,
      };

      setStoreState((prev) => ({
        ...prev,
        messages: [...prev.messages, newMsg],
      }));
    },
    [bookings, currentUser],
  );

  const markMessagesRead = useCallback(
    (bookingId: string) => {
      setStoreState((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.booking_id === bookingId && m.receiver_id === currentUser.id
            ? { ...m, is_read: true }
            : m,
        ),
      }));
    },
    [currentUser.id],
  );

  const addPackage = useCallback(
    (pkg: Omit<PackageTier, "id" | "photographer_id">) => {
      const newPkg: PackageTier = {
        ...pkg,
        id: `pkg-${Date.now()}`,
        photographer_id: currentUser.id,
      };
      setStoreState((prev) => ({
        ...prev,
        packages: [...prev.packages, newPkg],
      }));
    },
    [currentUser.id],
  );

  const updatePackage = useCallback((pkg: PackageTier) => {
    setStoreState((prev) => ({
      ...prev,
      packages: prev.packages.map((p) => (p.id === pkg.id ? pkg : p)),
    }));
  }, []);

  const deletePackage = useCallback((packageId: string) => {
    setStoreState((prev) => ({
      ...prev,
      packages: prev.packages.filter((p) => p.id !== packageId),
    }));
  }, []);

  const addPortfolioItem = useCallback(
    (item: {
      title: string;
      image_url: string;
      category: string;
      caption?: string;
      photographer_id?: string;
    }) => {
      const newItem: PortfolioItem = {
        ...item,
        id: `frame-${Date.now()}`,
        photographer_id: item.photographer_id || currentUser.id,
        views: 0,
        created_at: new Date().toISOString().split("T")[0],
      };
      setStoreState((prev) => ({
        ...prev,
        portfolioItems: [newItem, ...prev.portfolioItems],
      }));
    },
    [currentUser.id],
  );

  const deletePortfolioItem = useCallback((itemId: string) => {
    setStoreState((prev) => ({
      ...prev,
      portfolioItems: prev.portfolioItems.filter((i) => i.id !== itemId),
    }));
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setStoreState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n,
      ),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setStoreState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.user_id === currentUser.id ? { ...n, is_read: true } : n,
      ),
    }));
  }, [currentUser.id]);

  const unreadNotificationsCount = notifications.filter(
    (n) => n.user_id === currentUser.id && !n.is_read,
  ).length;

  const unreadMessagesCount = messages.filter(
    (m) => m.receiver_id === currentUser.id && !m.is_read,
  ).length;

  const currentPhotog =
    photographers.find((p) => p.id === currentUser.id) || photographers[0];
  const blockedDates = currentPhotog?.blackout_dates || [];

  const toggleDateBlock = useCallback(
    (date: string) => {
      setStoreState((prev) => ({
        ...prev,
        photographers: prev.photographers.map((p) => {
          if (p.id !== currentUser.id && p.id !== "user-photographer-arjun")
            return p;
          const currentBlocks = p.blackout_dates || [];
          const exists = currentBlocks.includes(date);
          const nextBlocks = exists
            ? currentBlocks.filter((d) => d !== date)
            : [...currentBlocks, date];
          return { ...p, blackout_dates: nextBlocks };
        }),
      }));
    },
    [currentUser.id],
  );

  const isAuthenticated = Boolean(
    currentUser &&
    currentUser.id !== "user-guest" &&
    currentUser.email !== "guest@photobook.app",
  );

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        isAuthenticated,
        switchUserRole,
        setCurrentUser,
        registerUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        updatePhotographerProfile,
        photographers,
        categories,
        packages,
        portfolioItems,
        bookings,
        messages,
        reviews,
        savedPhotographerIds,
        notifications,
        unreadNotificationsCount,
        unreadMessagesCount,
        toggleSavePhotographer,
        isPhotographerSaved,
        requestBooking,
        updateBookingStatus,
        markGalleryDelivered,
        sendMessage,
        markMessagesRead,
        addPackage,
        createPackage: addPackage,
        updatePackage,
        deletePackage,
        blockedDates,
        toggleDateBlock,
        addPortfolioItem,
        deletePortfolioItem,
        markNotificationRead,
        markAllNotificationsRead,
        checkAvailability,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
