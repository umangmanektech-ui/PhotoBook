"use client";

import { AuthModal } from "@/components/auth/AuthModal";
import { AuthView } from "@/components/auth/AuthView";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { BookingFlowModal } from "@/components/booking/BookingFlowModal";
import { CustomerBookingsView } from "@/components/bookings/CustomerBookingsView";
import { ExploreView } from "@/components/explore/ExploreView";
import { HomeView } from "@/components/home/HomeView";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Header } from "@/components/navigation/Header";
import { PhotographerDetailView } from "@/components/photographer/PhotographerDetailView";
import { CustomerProfileView } from "@/components/profile/CustomerProfileView";
import { PWAInstaller } from "@/components/pwa/PWAInstaller";
import { SavedView } from "@/components/saved/SavedView";
import { PhotographerStudioView } from "@/components/studio/PhotographerStudioView";
import { AppProvider, useApp } from "@/lib/store/app-context";
import { useState } from "react";

function AppContent() {
  const { currentUser, switchUserRole, isAuthenticated } = useApp();

  // Navigation state
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [selectedPhotographerId, setSelectedPhotographerId] = useState<string>(
    "user-photographer-arjun",
  );
  const [exploreCategory, setExploreCategory] = useState<string>("All");
  const [chatBookingId, setChatBookingId] = useState<string | undefined>(
    undefined,
  );

  // Booking Modal state
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [bookingPhotographerId, setBookingPhotographerId] = useState<string>(
    "user-photographer-arjun",
  );
  const [bookingPackageId, setBookingPackageId] = useState<string | undefined>(
    undefined,
  );
  const [bookingInitialDate, setBookingInitialDate] = useState<
    string | undefined
  >(undefined);
  const [pendingBooking, setPendingBooking] = useState<{
    photographerId: string;
    packageId?: string;
    initialDate?: string;
  } | null>(null);

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "register">(
    "login",
  );
  const [authInitialRole, setAuthInitialRole] = useState<
    "customer" | "photographer"
  >("customer");
  const [authCustomTitle, setAuthCustomTitle] = useState<string | undefined>(
    undefined,
  );
  const [authCustomDesc, setAuthCustomDesc] = useState<string | undefined>(
    undefined,
  );

  const handleNavigate = (tab: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (tab === "detail" || tab === "photographer-detail") {
      if (param) setSelectedPhotographerId(param);
      setCurrentTab("photographer-detail");
      return;
    }

    if (tab === "explore") {
      if (param) setExploreCategory(param);
      else setExploreCategory("All");
      setCurrentTab("explore");
      return;
    }

    if (tab === "auth" || tab === "login") {
      setAuthInitialMode("login");
      setAuthCustomTitle(undefined);
      setAuthCustomDesc(undefined);
      if (param === "photographer" || param === "customer") {
        setAuthInitialRole(param);
      }
      setCurrentTab("auth");
      return;
    }

    if (tab === "register") {
      setAuthInitialMode("register");
      setAuthCustomTitle(undefined);
      setAuthCustomDesc(undefined);
      if (param === "photographer" || param === "customer") {
        setAuthInitialRole(param);
      }
      setCurrentTab("auth");
      return;
    }

    setCurrentTab(tab);
  };

  const handleOpenBooking = (
    photographerId: string,
    packageId?: string,
    initialDate?: string,
  ) => {
    const targetDate = initialDate;
    if (!isAuthenticated) {
      setPendingBooking({ photographerId, packageId, initialDate: targetDate });
      setAuthCustomTitle("Sign In to Book a Session");
      setAuthCustomDesc(
        "A patron account is required to reserve dates, receive booking confirmation, and access your private gallery.",
      );
      setAuthInitialMode("login");
      setAuthInitialRole("customer");
      setAuthModalOpen(true);
      return;
    }
    setBookingPhotographerId(photographerId);
    setBookingPackageId(packageId);
    setBookingInitialDate(targetDate);
    setBookingModalOpen(true);
  };

  const handleOpenChat = (bookingId?: string) => {
    setChatBookingId(bookingId);
  };

  // Determine studio subtab
  const getStudioTab = () => {
    switch (currentTab) {
      case "studio-bookings":
        return "requests";
      case "studio-portfolio":
        return "portfolio";
      case "studio-packages":
        return "packages";
      case "studio-profile":
        return "profile";
      case "studio-calendar":
        return "calendar";
      default:
        return "requests";
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1A1A] flex flex-col font-sans">
      {/* Top Header with Role-Based Navigation */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAuth={() => {
          setAuthInitialMode("login");
          setAuthModalOpen(true);
        }}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {/* CUSTOMER VIEWS */}
        {currentTab === "home" && <HomeView onNavigate={handleNavigate} />}

        {currentTab === "explore" && (
          <ExploreView
            initialCategory={exploreCategory}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === "photographer-detail" && (
          <PhotographerDetailView
            photographerId={selectedPhotographerId}
            onBack={() => handleNavigate("explore")}
            onSelectPackageToBook={(pkgId, date) =>
              handleOpenBooking(selectedPhotographerId, pkgId, date)
            }
            onOpenChat={() => {}}
          />
        )}

        {currentTab === "bookings" && (
          <ProtectedRoute
            allowedRoles={["customer", "photographer"]}
            fallbackTitle="My Bookings & Reservations"
            fallbackDescription="Sign in to view your upcoming shoots, live booking status, session passes, and delivered photo galleries."
            onNavigate={handleNavigate}
            onOpenAuth={(mode, role) => {
              setAuthInitialMode(mode || "login");
              setAuthInitialRole(role || "customer");
              setAuthModalOpen(true);
            }}
          >
            <CustomerBookingsView
              onNavigate={handleNavigate}
              onOpenChat={() => {}}
            />
          </ProtectedRoute>
        )}

        {currentTab === "profile" && (
          <ProtectedRoute
            allowedRoles={["customer", "photographer"]}
            fallbackTitle="Patron Profile Settings"
            fallbackDescription="Sign in to manage your contact details, event preferences, and personal booking history."
            onNavigate={handleNavigate}
            onOpenAuth={(mode, role) => {
              setAuthInitialMode(mode || "login");
              setAuthInitialRole(role || "customer");
              setAuthModalOpen(true);
            }}
          >
            <CustomerProfileView onNavigate={handleNavigate} />
          </ProtectedRoute>
        )}

        {currentTab === "saved" && <SavedView onNavigate={handleNavigate} />}

        {/* PHOTOGRAPHER STUDIO VIEWS (Protected for Photographer Pros only) */}
        {(currentTab === "studio" ||
          currentTab === "studio-bookings" ||
          currentTab === "studio-portfolio" ||
          currentTab === "studio-packages" ||
          currentTab === "studio-profile" ||
          currentTab === "studio-calendar") && (
          <ProtectedRoute
            allowedRoles={["photographer"]}
            fallbackTitle="Photographer Atelier Portal"
            fallbackDescription="The Studio workspace, commission calendar, pricing tier manager, and client gallery vaults are accessible to registered photographers."
            onNavigate={handleNavigate}
            onOpenAuth={(mode, role) => {
              setAuthInitialMode(mode || "login");
              setAuthInitialRole(role || "photographer");
              setAuthModalOpen(true);
            }}
          >
            <PhotographerStudioView
              key={currentTab}
              initialTab={getStudioTab()}
              onNavigate={handleNavigate}
            />
          </ProtectedRoute>
        )}

        {/* AUTH VIEW (Dedicated Login / Register Page) */}
        {currentTab === "auth" && (
          <div className="py-8 px-4 sm:px-6">
            <AuthView
              initialMode={authInitialMode}
              initialRole={authInitialRole}
              onSuccess={(role) => {
                if (role === "photographer") {
                  setCurrentTab("studio");
                } else {
                  setCurrentTab("home");
                }
              }}
            />
          </div>
        )}
      </main>

      {/* Persistent Bottom Nav for Mobile */}
      <BottomNav currentTab={currentTab} onNavigate={handleNavigate} />

      {/* PWA offline / install banner */}
      <PWAInstaller />

      {/* Multi-step Booking Flow Modal */}
      {bookingModalOpen && (
        <BookingFlowModal
          photographerId={bookingPhotographerId}
          initialPackageId={bookingPackageId}
          initialDate={bookingInitialDate ?? ""}
          onClose={() => setBookingModalOpen(false)}
          onComplete={(booking) => {
            setCurrentTab("bookings");
          }}
          onOpenChat={() => {}}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        key={`${authModalOpen}-${authInitialMode}-${authInitialRole}-${authCustomTitle || ""}`}
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingBooking(null);
        }}
        customTitle={authCustomTitle}
        customDescription={authCustomDesc}
        initialMode={authInitialMode}
        initialRole={authInitialRole}
        onSuccess={(role) => {
          setAuthModalOpen(false);
          if (pendingBooking && role === "customer") {
            setBookingPhotographerId(pendingBooking.photographerId);
            setBookingPackageId(pendingBooking.packageId);
            setBookingInitialDate(pendingBooking.initialDate);
            setBookingModalOpen(true);
            setPendingBooking(null);
          } else if (role === "photographer") {
            setCurrentTab("studio");
            setPendingBooking(null);
          } else {
            setCurrentTab("home");
            setPendingBooking(null);
          }
        }}
      />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
