"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CalendarX } from "lucide-react";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import EventCard, { EventCardData } from "@/components/ui/EventCard";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function EventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<EventCardData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetch(`${API}/api/events`);

      const data = await res.json();

      setEvents(data.events || data);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EVENT NAVIGATION
  // ==========================================
  const openEvent = (event: EventCardData) => {
    // PERSONAL PHOTO
    // Masuk ke halaman search
    if (event.type === "PERSONAL") {
      router.push(`/search?event=${event.id}`);
      return;
    }

    // GALLERY & LIVE
    // Masuk ke halaman detail event
    if (event.type === "GALLERY") {
      router.push(`/event/${event.id}`);
      return;
    }
  };

  // ==========================================
  // SEARCH FILTER
  // ==========================================
  const filteredEvents = events.filter((event) =>
    event.name
      ? event.name.toLowerCase().includes(search.toLowerCase())
      : false
  );

  return (
    <div className="relative min-h-screen">
      <div className="app-hero" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1100px] px-5 py-10 md:px-8 md:py-12">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold leading-tight md:text-[42px]">
            Select Your Event
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm text-mid md:text-base">
            Access photos, videos, and livestream recordings from your special
            moments
          </p>
        </header>

        <div className="relative mx-auto mt-9 max-w-xl">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-low"
          />
          <Input
            placeholder="Search event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full py-4 pl-12"
          />
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center text-mid">
              <span className="inline-flex items-center gap-3">
                <Spinner />
                Loading events...
              </span>
            </div>
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              icon={<CalendarX size={22} />}
              title="No events found"
              description={
                search
                  ? "Try a different keyword or clear the search."
                  : "There are no events available right now."
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  apiUrl={API || ""}
                  onClick={() => openEvent(event)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
