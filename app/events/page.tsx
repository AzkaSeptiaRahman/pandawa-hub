"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`
      );

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
  const openEvent = (event: any) => {
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
  const filteredEvents = events.filter((event) => {
    return event.name
      ? event.name.toLowerCase().includes(search.toLowerCase())
      : false;
  });

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading...
      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">

        {/* TITLE */}
        <h1 className="text-6xl font-bold text-center">
          Select Your Event
        </h1>

        {/* DESCRIPTION */}
        <p className="text-center text-slate-400 mt-5">
          Access photos, videos, and livestream recordings from your special
          moments
        </p>

        {/* SEARCH */}
        <input
          placeholder="Search event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            mt-12
            w-full
            p-5
            rounded-3xl
            bg-white/10
            border
            border-white/20
          "
        />

        {/* EVENT GRID */}
        <div
          className="
            grid
            md:grid-cols-3
            gap-8
            mt-14
          "
        >
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => openEvent(event)}
              className="
                cursor-pointer
                rounded-3xl
                overflow-hidden
                bg-white/10
                border
                border-white/20
                hover:scale-105
                transition
              "
            >
              {/* THUMBNAIL */}
              <div className="h-56 bg-blue-700">
                {event.thumbnail && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${event.thumbnail}`}
                    alt={event.name || "Event"}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />
                )}
              </div>

              {/* EVENT INFORMATION */}
              <div className="p-6">

                {/* EVENT NAME */}
                <h2 className="text-2xl font-bold">
                  {event.name}
                </h2>

                {/* EVENT TITLE */}
                <p className="text-slate-300 mt-3">
                  {event.title}
                </p>

                {/* EVENT META */}
                <div
                  className="
                    flex
                    gap-3
                    mt-5
                    flex-wrap
                  "
                >

                  {/* DATE */}
                  <span
                    className="
                      px-4
                      py-2
                      rounded-full
                      bg-blue-500/20
                    "
                  >
                    📅 {event.date}
                  </span>

                  {/* TYPE */}
                  <span
                    className="
                      px-4
                      py-2
                      rounded-full
                      bg-white/10
                    "
                  >
                    {event.type === "PERSONAL"
                      ? "🎓 Personal Photo"
                      : "📸 Gallery & Live"}
                  </span>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}