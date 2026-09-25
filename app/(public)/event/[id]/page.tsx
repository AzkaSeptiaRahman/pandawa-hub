"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Images,
  Sparkles,
  Play,
  Calendar,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import BackButton from "@/components/ui/BackButton";
import EmptyState from "@/components/ui/EmptyState";
import { mediaUrl } from "@/lib/mediaUrl";

const API = process.env.NEXT_PUBLIC_API_URL;

type MediaItem = {
  id: number;
  type: "gallery" | "highlight";
  url: string;
  title?: string;
};

type EventData = {
  name?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  media?: MediaItem[];
};

export default function EventDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      const response = await fetch(`${API}/api/events/${id}`);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Event not found");
      }

      setEvent(result);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const youtubeThumbnail = (url: string) => {
    if (!url) return "";

    const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);

    if (!match) return "";

    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-mid">
        Loading event...
      </main>
    );
  }

  if (error || !event) {
    return (
      <div className="relative min-h-screen">
        <div className="app-hero" aria-hidden="true" />

        <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
          <div className="w-full max-w-sm rounded-[26px] border border-line-soft bg-card p-9 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
              <AlertTriangle size={22} />
            </div>

            <h1 className="text-xl font-bold">Event Not Found</h1>

            <p className="mt-2 text-sm text-low">{error}</p>

            <div className="mt-6 flex justify-center">
              <Button variant="secondary" onClick={() => router.back()}>
                Back
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const gallery =
    event.media?.filter((item) => item.type === "gallery") || [];

  const highlights =
    event.media?.filter((item) => item.type === "highlight") || [];

  return (
    <div className="relative min-h-screen">
      <div className="app-hero" aria-hidden="true" />

      <div className="relative z-10 px-5 pt-6 md:px-8">
        <BackButton />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl space-y-8 px-5 py-8 md:px-8">
        {/* EVENT HEADER */}
        <section className="overflow-hidden rounded-[26px] border border-line-soft bg-card">
          <div className="relative h-64 bg-card-2 md:h-80">
            {event.thumbnail && (
              <img
                src={mediaUrl(event.thumbnail)}
                alt="event"
                className="h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
              <Badge tone="brand" className="mb-4">
                <Images size={13} />
                Gallery &amp; Live
              </Badge>

              <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
                {event.title || event.name}
              </h1>

              {event.description && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mid md:text-base">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section>
          <div className="mb-5 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-brand-soft text-brand">
              <Images size={18} />
            </span>
            <h2 className="text-xl font-bold">Event Gallery</h2>
          </div>

          {gallery.length === 0 ? (
            <EmptyState
              icon={<Images size={22} />}
              title="No gallery uploaded yet"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square overflow-hidden rounded-[18px] border border-line-soft bg-card-2"
                >
                  <img
                    src={mediaUrl(item.url)}
                    alt="gallery"
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* HIGHLIGHT */}
        <section>
          <div className="mb-5 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-accent/15 text-accent">
              <Sparkles size={18} />
            </span>
            <h2 className="text-xl font-bold">Event Highlight</h2>
          </div>

          {highlights.length === 0 ? (
            <EmptyState
              icon={<Sparkles size={22} />}
              title="No highlight available"
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-[26px] border border-line-soft bg-card"
                >
                  {youtubeThumbnail(item.url) && (
                    <div className="relative h-52">
                      <img
                        src={youtubeThumbnail(item.url)}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
                          <Play size={22} className="fill-white" />
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-lg font-bold">{item.title}</h3>

                    <div className="mt-5">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm">
                          <Play size={14} className="fill-white" />
                          Watch
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
