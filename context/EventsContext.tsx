"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Event } from "@/types";
import { generateId } from "@/utils/auth";
import { setLocalStorage, getLocalStorage } from "@/utils/storage";

interface EventsContextType {
  isHydrated: boolean;
  events: Event[];
  addEvent: (event: Omit<Event, "id" | "createdAt">) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const EVENTS_STORAGE_KEY = "event_manager_events";

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedEvents = getLocalStorage(EVENTS_STORAGE_KEY, []);
    setEvents(storedEvents);
    setIsHydrated(true);
  }, []);

  const addEvent = useCallback(
    async (event: Omit<Event, "id" | "createdAt">): Promise<void> => {
      const newEvent: Event = {
        ...event,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      setLocalStorage(EVENTS_STORAGE_KEY, updatedEvents);
    },
    [events],
  );

  const updateEvent = useCallback(
    async (id: string, updates: Partial<Event>): Promise<void> => {
      const event = events.find((e) => e.id === id);
      if (!event) {
        throw new Error("Event not found");
      }

      const updatedEvent = { ...event, ...updates };
      const updatedEvents = events.map((e) => (e.id === id ? updatedEvent : e));
      setEvents(updatedEvents);
      setLocalStorage(EVENTS_STORAGE_KEY, updatedEvents);
    },
    [events],
  );

  const deleteEvent = useCallback(
    async (id: string): Promise<void> => {
      const updatedEvents = events.filter((event) => event.id !== id);
      setEvents(updatedEvents);
      setLocalStorage(EVENTS_STORAGE_KEY, updatedEvents);
    },
    [events],
  );

  const getEventById = useCallback(
    (id: string): Event | undefined => {
      return events.find((event) => event.id === id);
    },
    [events],
  );

  const value = useMemo(
    () => ({
      isHydrated,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventById,
    }),
    [isHydrated, events, addEvent, updateEvent, deleteEvent, getEventById],
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within EventsProvider");
  }
  return context;
}
