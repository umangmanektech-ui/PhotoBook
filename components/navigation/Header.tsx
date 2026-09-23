"use client";

import { useApp } from "@/lib/store/app-context";
import {
  ArrowRight,
  Calendar,
  Camera,
  ChevronDown,
  Heart,
  Layers,
  LogOut,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenAuth?: () => void;
}

export function Header({ currentTab, onNavigate, onOpenAuth }: HeaderProps) {
  const { currentUser, isAuthenticated, switchUserRole, logoutUser } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E2D2] bg-[#FBF9F5]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-btn"
            onClick={() =>
              onNavigate(
                currentUser.role === "photographer" ? "studio" : "home",
              )
            }
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A1A1A] p-1.5 shadow-sm transition-transform group-hover:scale-105">
              <div className="absolute inset-0 rounded-lg border border-[#C59B27]/40" />
              {/* Gold aperture icon */}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-[#C59B27]"
                fill="currentColor"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9z"
                  opacity="0.3"
                />
                <circle cx="12" cy="12" r="3" fill="#FBF9F5" />
              </svg>
            </div>
            <div>
              <span className=" text-lg font-bold tracking-tight text-[#1A1A1A]">
                PhotoBook
              </span>
              <span className="ml-1.5 hidden text-[10px] font-semibold uppercase tracking-widest text-[#C59B27] sm:inline-block">
                Atelier
              </span>
            </div>
          </button>

          {/* Breadcrumb badge */}
          {/* <div className="hidden items-center text-xs text-[#767471] md:flex">
            <span className="mx-2 text-[#C59B27]">•</span>
            <span className="uppercase tracking-wider font-semibold text-[11px] text-[#52504E]">
              {!isAuthenticated
                ? "Curated Marketplace"
                : currentUser.role === "photographer"
                  ? "Studio Pro Workspace"
                  : "Patron Account"}
            </span>
          </div> */}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 md:flex">
          {/* Public / Unauthenticated Navigation */}
          {!isAuthenticated ? (
            <>
              <button
                id="nav-home-link"
                onClick={() => onNavigate("home")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "home"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                Home
              </button>
              <button
                id="nav-explore-link"
                onClick={() => onNavigate("explore")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "explore"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                All Photographers
              </button>
              <button
                id="nav-saved-link"
                onClick={() => onNavigate("saved")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "saved"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                Saved
              </button>
            </>
          ) : currentUser.role === "customer" ? (
            <>
              <button
                id="nav-home-link"
                onClick={() => onNavigate("home")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "home"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                Home
              </button>
              <button
                id="nav-explore-link"
                onClick={() => onNavigate("explore")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "explore"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                All Photographers
              </button>
              <button
                id="nav-bookings-link"
                onClick={() => onNavigate("bookings")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "bookings"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                My Bookings
              </button>
              <button
                id="nav-saved-link"
                onClick={() => onNavigate("saved")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "saved"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                Saved
              </button>
              <button
                id="nav-profile-link"
                onClick={() => onNavigate("profile")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "profile"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                Profile
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-studio-overview"
                onClick={() => onNavigate("studio")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "studio"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                Studio Overview
              </button>
              <button
                id="nav-studio-bookings"
                onClick={() => onNavigate("studio-bookings")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "studio-bookings"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                Booking Requests
              </button>
              <button
                id="nav-studio-portfolio"
                onClick={() => onNavigate("studio-portfolio")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "studio-portfolio"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                Portfolio Works
              </button>
              <button
                id="nav-studio-packages"
                onClick={() => onNavigate("studio-packages")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "studio-packages"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                Packages
              </button>
              <button
                id="nav-studio-profile"
                onClick={() => onNavigate("studio-profile")}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentTab === "studio-profile"
                    ? "text-[#C59B27] border-b-2 border-[#C59B27] pb-1"
                    : "text-[#52504E] hover:text-[#1A1A1A]"
                }`}
              >
                Studio Profile
              </button>
            </>
          )}
        </nav>

        {/* Right Action Controls: User Account Menu & Auth CTA */}
        <div className="flex items-center gap-3">
          {/* Sign In / Register button only shown when not authenticated */}
          {!isAuthenticated ? (
            <button
              id="header-auth-cta-btn"
              onClick={() => onNavigate("auth")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-4 py-2 text-xs font-bold text-white hover:bg-[#333] transition shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#C59B27]" />
              <span>Sign In / Register</span>
            </button>
          ) : (
            /* User Account Popover - ONLY rendered when signed in */
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full border border-[#D9D2C2] bg-white p-1 pr-2.5 transition hover:border-[#C59B27] shadow-2xs"
              >
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.full_name}
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-[#C59B27]/40"
                />
                <div className="hidden text-left sm:block">
                  <div className="text-xs font-bold text-[#1A1A1A] max-w-[100px] truncate leading-tight">
                    {currentUser.full_name.split(" ")[0]}
                  </div>
                  <div className="text-[9px] uppercase font-bold text-[#C59B27] leading-none">
                    {currentUser.role === "photographer"
                      ? "Photographer"
                      : "Customer"}
                  </div>
                </div>
                <ChevronDown className="h-3 w-3 text-[#767471]" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#D9D2C2] bg-white p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  {/* User Summary Header */}
                  <div className="px-3 py-2 border-b border-[#F0ECE1] mb-1">
                    <div className="font-bold text-xs text-[#1A1A1A] truncate">
                      {currentUser.full_name}
                    </div>
                    <div className="text-[11px] text-[#767471] truncate">
                      {currentUser.email}
                    </div>
                    <span className="inline-block mt-1 rounded-full bg-[#C59B27]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#997316]">
                      {currentUser.role === "photographer"
                        ? "Studio Pro Account"
                        : "Patron Account"}
                    </span>
                  </div>

                  {/* Direct navigation options based on role */}
                  {currentUser.role === "customer" ? (
                    <>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate("profile");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#FBF9F5] transition"
                      >
                        <User className="h-4 w-4 text-[#C59B27]" />
                        <span>Manage Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate("bookings");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#FBF9F5] transition"
                      >
                        <Calendar className="h-4 w-4 text-[#C59B27]" />
                        <span>My Bookings</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate("saved");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#FBF9F5] transition"
                      >
                        <Heart className="h-4 w-4 text-rose-500" />
                        <span>Saved Photographers</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate("studio-profile");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#FBF9F5] transition"
                      >
                        <Settings className="h-4 w-4 text-[#C59B27]" />
                        <span>Studio Profile & Gear</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate("studio-bookings");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#FBF9F5] transition"
                      >
                        <Calendar className="h-4 w-4 text-[#C59B27]" />
                        <span>Booking Requests</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate("studio-portfolio");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#FBF9F5] transition"
                      >
                        <Layers className="h-4 w-4 text-[#C59B27]" />
                        <span>Manage Portfolio</span>
                      </button>
                    </>
                  )}

                  {/* Role Switch Shortcut */}
                  {/* <div className="mt-1 pt-1 border-t border-[#F0ECE1]">
                    <button
                      onClick={() => {
                        const nextRole =
                          currentUser.role === "customer"
                            ? "photographer"
                            : "customer";
                        switchUserRole(nextRole);
                        setShowUserMenu(false);
                        onNavigate(
                          nextRole === "photographer" ? "studio" : "home",
                        );
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F0ECE1] transition"
                    >
                      <div className="flex items-center gap-2">
                        {currentUser.role === "customer" ? (
                          <Camera className="h-4 w-4 text-[#C59B27]" />
                        ) : (
                          <User className="h-4 w-4 text-[#C59B27]" />
                        )}
                        <span>
                          Switch to{" "}
                          {currentUser.role === "customer"
                            ? "Studio Pro"
                            : "Client Mode"}
                        </span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-[#767471]" />
                    </button>
                  </div> */}

                  {/* Sign Out Action */}
                  <div className="mt-1 pt-1 border-t border-[#F0ECE1]">
                    <button
                      id="header-signout-btn"
                      onClick={() => {
                        logoutUser();
                        setShowUserMenu(false);
                        onNavigate("home");
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
