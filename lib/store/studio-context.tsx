'use client';

import React, { createContext, useCallback, useContext, useSyncExternalStore } from 'react';
import type { Appointment, AppointmentStatus, PhotographerDayAvailability } from '@/lib/types/appointment';
import { SEEDED_BOOKED_SLOTS } from '@/lib/data/studio-data';

// ─── Store Shape ──────────────────────────────────────────────────────────────

interface StudioStore {
  appointments: Appointment[];
  bookedSlots: PhotographerDayAvailability[]; // merged: seeded + user-created
}

const SEEDED_SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-89210',
    customerId: 'guest',
    customerName: 'Aarav Patel',
    customerPhone: '9876543210',
    customerEmail: 'aarav.patel@example.com',
    photographerId: 'p-1',
    photographerName: 'Arjun Kumar',
    date: '2026-10-20',
    slots: ['ts-0900', 'ts-1000', 'ts-1100', 'ts-1200'],
    serviceId: 'srv-prewedding',
    serviceName: 'Pre-Wedding & Couple Story',
    venueType: 'studio',
    venueAddress: 'In-Studio Atelier (Ahmedabad)',
    addons: ['ad-drone', 'ad-styling'],
    totalAmount: 32000,
    status: 'confirmed',
    notes: 'Sunset aesthetic and traditional couple portraits.',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_STORE: StudioStore = {
  appointments: SEEDED_SAMPLE_APPOINTMENTS,
  bookedSlots: SEEDED_BOOKED_SLOTS,
};

const STORAGE_KEY = 'photobook_studio_v1';

// ─── External Store (like app-context pattern) ────────────────────────────────

let storeState: StudioStore = DEFAULT_STORE;
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<StudioStore>;
      const userApts = (parsed.appointments ?? []).filter(
        (a) => !SEEDED_SAMPLE_APPOINTMENTS.some((s) => s.id === a.id),
      );
      storeState = {
        appointments: [...userApts, ...SEEDED_SAMPLE_APPOINTMENTS],
        bookedSlots: [
          ...SEEDED_BOOKED_SLOTS,
          ...(parsed.bookedSlots ?? []).filter(
            (b) => !SEEDED_BOOKED_SLOTS.some((s) => s.photographerId === b.photographerId && s.date === b.date),
          ),
        ],
      };
    }
  } catch {
    // ignore
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() { return storeState; }
function getServerSnapshot() { return DEFAULT_STORE; }

function setState(updater: (prev: StudioStore) => StudioStore) {
  storeState = updater(storeState);
  if (typeof window !== 'undefined') {
    try {
      // Only persist user-created appointments and their booked slots (not seeded)
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          appointments: storeState.appointments,
          bookedSlots: storeState.bookedSlots.filter(
            (b) =>
              !SEEDED_BOOKED_SLOTS.some(
                (s) => s.photographerId === b.photographerId && s.date === b.date,
              ),
          ),
        }),
      );
    } catch {/* ignore */}
  }
  listeners.forEach((cb) => cb());
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface StudioContextType {
  appointments: Appointment[];

  /** Get booked slot IDs for a photographer on a date */
  getBookedSlots: (photographerId: string, date: string) => string[];

  /** Check if a specific slot is free for a photographer on a date */
  isSlotAvailable: (photographerId: string, date: string, slotId: string) => boolean;

  /** Is the main photographer fully booked on this date? */
  isDateFullyBooked: (photographerId: string, date: string) => boolean;

  /** Book a new appointment (creates appointment + marks slots booked) */
  createAppointment: (
    params: Omit<Appointment, 'id' | 'createdAt' | 'status'>,
  ) => { success: boolean; appointment?: Appointment; error?: string };

  /** Cancel an appointment */
  cancelAppointment: (appointmentId: string) => void;

  /** Get appointments for a specific customer */
  getCustomerAppointments: (customerId: string) => Appointment[];
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

const ALL_SLOT_IDS = ['ts-0900','ts-1000','ts-1100','ts-1200','ts-1300','ts-1400','ts-1500','ts-1600','ts-1700','ts-1800'];

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const getBookedSlots = useCallback((photographerId: string, date: string): string[] => {
    const entry = store.bookedSlots.find(
      (b) => b.photographerId === photographerId && b.date === date,
    );
    return entry?.bookedSlots ?? [];
  }, [store.bookedSlots]);

  const isSlotAvailable = useCallback((photographerId: string, date: string, slotId: string): boolean => {
    const booked = getBookedSlots(photographerId, date);
    return !booked.includes(slotId);
  }, [getBookedSlots]);

  const isDateFullyBooked = useCallback((photographerId: string, date: string): boolean => {
    const booked = getBookedSlots(photographerId, date);
    return booked.length >= ALL_SLOT_IDS.length;
  }, [getBookedSlots]);

  const createAppointment = useCallback(
    (params: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
      // Validate slots are still free
      const booked = storeState.bookedSlots.find(
        (b) => b.photographerId === params.photographerId && b.date === params.date,
      );
      const alreadyBooked = booked?.bookedSlots ?? [];
      const conflict = params.slots.some((s) => alreadyBooked.includes(s));
      if (conflict) {
        return { success: false, error: 'One or more selected slots are no longer available. Please refresh and try again.' };
      }

      const appointment: Appointment = {
        ...params,
        id: `apt-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setState((prev) => {
        // Merge booked slots for this photographer+date
        const existingIdx = prev.bookedSlots.findIndex(
          (b) => b.photographerId === params.photographerId && b.date === params.date,
        );
        let newBookedSlots = [...prev.bookedSlots];
        if (existingIdx >= 0) {
          newBookedSlots[existingIdx] = {
            ...newBookedSlots[existingIdx],
            bookedSlots: [...new Set([...newBookedSlots[existingIdx].bookedSlots, ...params.slots])],
          };
        } else {
          newBookedSlots.push({ photographerId: params.photographerId, date: params.date, bookedSlots: params.slots });
        }
        return {
          appointments: [...prev.appointments, appointment],
          bookedSlots: newBookedSlots,
        };
      });

      return { success: true, appointment };
    },
    [],
  );

  const cancelAppointment = useCallback((appointmentId: string) => {
    setState((prev) => {
      const apt = prev.appointments.find((a) => a.id === appointmentId);
      if (!apt) return prev;

      // Free up the slots (only if no other appointment claims them)
      const otherApts = prev.appointments.filter(
        (a) => a.id !== appointmentId && a.photographerId === apt.photographerId && a.date === apt.date && a.status !== 'cancelled',
      );
      const stillBooked = new Set(otherApts.flatMap((a) => a.slots));

      // Keep seeded slots always booked
      const seeded = SEEDED_BOOKED_SLOTS.find(
        (s) => s.photographerId === apt.photographerId && s.date === apt.date,
      );
      seeded?.bookedSlots.forEach((s) => stillBooked.add(s));

      const newBookedSlots = prev.bookedSlots.map((b) =>
        b.photographerId === apt.photographerId && b.date === apt.date
          ? { ...b, bookedSlots: [...stillBooked] }
          : b,
      );

      return {
        appointments: prev.appointments.map((a) =>
          a.id === appointmentId ? { ...a, status: 'cancelled' as AppointmentStatus } : a,
        ),
        bookedSlots: newBookedSlots,
      };
    });
  }, []);

  const getCustomerAppointments = useCallback((customerId: string) => {
    return store.appointments.filter((a) => a.customerId === customerId);
  }, [store.appointments]);

  return (
    <StudioContext.Provider
      value={{
        appointments: store.appointments,
        getBookedSlots,
        isSlotAvailable,
        isDateFullyBooked,
        createAppointment,
        cancelAppointment,
        getCustomerAppointments,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within StudioProvider');
  return ctx;
}
