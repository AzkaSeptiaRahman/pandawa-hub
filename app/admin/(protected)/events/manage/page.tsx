"use client";

import { useEffect, useRef, useState } from "react";
import {
  Settings2,
  Images,
  Video,
  Save,
  Upload,
  Plus,
  ImageOff,
  Trash2,
  Pencil,
  X,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Label from "@/components/ui/Label";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Alert from "@/components/ui/Alert";
import { mediaUrl } from "@/lib/mediaUrl";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ManageEventPage() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const [events, setEvents] = useState<any[]>([]);
  const [eventId, setEventId] = useState("");
  const [event, setEvent] = useState<any>(null);

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightUrl, setHighlightUrl] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingMediaId, setEditingMediaId] = useState<number | null>(null);
  const [mediaTitle, setMediaTitle] = useState("");

  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await fetch(`${API}/api/admin/events/options`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setEvents(data);
  };

  const loadEvent = async (id: string) => {
    const res = await fetch(`${API}/api/events/${id}`);

    const data = await res.json();

    setEvent(data);
  };

  const selectEvent = (id: string) => {
    setEventId(id);
    setThumbnail(null);
    loadEvent(id);
  };

  const updateEvent = async () => {
    try {
      setLoading(true);

      const form = new FormData();

      form.append("name", event.name);
      form.append("title", event.title);
      form.append("date", event.date);
      form.append("description", event.description || "");
      form.append("slug", event.slug || "");
      form.append("type", event.type || "");
      form.append("status", event.status || "");

      if (thumbnail) {
        form.append("thumbnail", thumbnail);
      }

      const res = await fetch(`${API}/api/admin/events/${eventId}`, {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Event updated");
        loadEvent(eventId);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const uploadGallery = async () => {
    const form = new FormData();

    form.append("event_id", eventId);

    galleryFiles.forEach((file) => {
      form.append("photos", file);
    });

    const res = await fetch(`${API}/api/admin/events/media/gallery`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: form,
    });

    if (res.ok) {
      setMessage("Gallery uploaded");
      setGalleryFiles([]);

      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }

      loadEvent(eventId);
    }
  };

  const youtubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);

    if (!match) return null;

    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  };

  const addHighlight = async () => {
    const res = await fetch(`${API}/api/admin/events/media/highlight`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        event_id: eventId,
        title: highlightTitle,
        url: highlightUrl,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Highlight added");
      setHighlightTitle("");
      setHighlightUrl("");
      loadEvent(eventId);
    } else {
      setMessage(data.message);
    }
  };

  const deleteMedia = async (id: number) => {
    if (!confirm("Delete this media?")) return;

    const res = await fetch(`${API}/api/admin/events/media/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Media deleted");
      loadEvent(eventId);
    } else {
      setMessage(data.message || "Delete failed");
    }
  };

  const startEditMedia = (item: any) => {
    setEditingMediaId(item.id);
    setMediaTitle(item.title || "");
  };

  const saveMediaTitle = async (id: number) => {
    const res = await fetch(`${API}/api/admin/events/media/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: mediaTitle }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Media title updated");
      setEditingMediaId(null);
      loadEvent(eventId);
    } else {
      setMessage(data.message || "Update failed");
    }
  };

  return (
    <div className="space-y-7">
      <PageHeader
        title="Manage Event"
        subtitle="Update event details, gallery, and highlights."
      />

      {/* SELECT EVENT */}
      <Card className="p-6 md:p-8">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-brand-soft text-brand">
            <Settings2 size={18} />
          </span>
          <h2 className="text-lg font-bold">Select Event</h2>
        </div>

        <Select value={eventId} onChange={(e) => selectEvent(e.target.value)}>
          <option value="">Choose Event</option>

          {events.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </Card>

      {event && (
        <>
          {/* EVENT INFORMATION */}
          <Card className="space-y-5 p-6 md:p-8">
            <h2 className="text-lg font-bold">Event Information</h2>

            <label className="block cursor-pointer rounded-[18px] border border-dashed border-line bg-card-2 p-5 text-center transition hover:border-brand/50">
              {thumbnail ? (
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="thumbnail"
                  className="h-48 w-full rounded-[13px] object-cover"
                />
              ) : event.thumbnail ? (
                <img
                  src={mediaUrl(event.thumbnail)}
                  alt="thumbnail"
                  className="h-48 w-full rounded-[13px] object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center rounded-[13px] bg-field text-low">
                  <ImageOff size={26} />
                </div>
              )}

              <p className="mt-3 text-sm font-semibold text-mid">
                Change Event Thumbnail
              </p>

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files) {
                    setThumbnail(e.target.files[0]);
                  }
                }}
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input
                  value={event.name || ""}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  value={event.title || ""}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label>Date</Label>
                <Input
                  value={event.date || ""}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      date: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Slug</Label>
                <Input
                  value={event.slug || ""}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      slug: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Type</Label>
                <Select
                  value={event.type || "PERSONAL"}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="PERSONAL">PERSONAL</option>
                  <option value="GALLERY">GALLERY</option>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label>Status</Label>
                <Select
                  value={event.status || "active"}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={event.description || ""}
                  onChange={(e) =>
                    setEvent({
                      ...event,
                      description: e.target.value,
                    })
                  }
                  className="min-h-32"
                />
              </div>
            </div>

            <Button onClick={updateEvent} disabled={loading}>
              <Save size={16} />
              {loading ? "Saving..." : "Save Event"}
            </Button>
          </Card>

          {/* GALLERY UPLOAD */}
          <Card className="space-y-5 p-6 md:p-8">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-brand-soft text-brand">
                <Images size={18} />
              </span>
              <h2 className="text-lg font-bold">Gallery Upload</h2>
            </div>

            <input
              ref={galleryInputRef}
              id="gallery"
              type="file"
              multiple
              hidden
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setGalleryFiles(Array.from(e.target.files));
                }
              }}
            />

            <label
              htmlFor="gallery"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[18px] border border-dashed border-line bg-card-2 p-8 text-center transition hover:border-brand/50 hover:bg-field"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Upload size={22} />
              </span>

              <span className="text-sm font-semibold text-hi">
                Choose Photos
              </span>

              <span className="text-xs text-low">
                {galleryFiles.length > 0
                  ? `${galleryFiles.length} photo(s) selected`
                  : "Select multiple images"}
              </span>
            </label>

            {galleryFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {galleryFiles.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt="gallery preview"
                    className="h-24 w-full rounded-[13px] object-cover"
                  />
                ))}
              </div>
            )}

            <Button onClick={uploadGallery}>
              <Upload size={16} />
              Upload Gallery
            </Button>
          </Card>

          {/* YOUTUBE HIGHLIGHT */}
          <Card className="space-y-5 p-6 md:p-8">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-danger/15 text-danger">
                <Video size={18} />
              </span>
              <h2 className="text-lg font-bold">Youtube Highlight</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Title"
                  value={highlightTitle}
                  onChange={(e) => setHighlightTitle(e.target.value)}
                />
              </div>

              <div>
                <Label>Youtube URL</Label>
                <Input
                  placeholder="Youtube URL"
                  value={highlightUrl}
                  onChange={(e) => setHighlightUrl(e.target.value)}
                />
              </div>
            </div>

            {youtubeThumbnail(highlightUrl) && (
              <img
                src={youtubeThumbnail(highlightUrl)!}
                alt="highlight preview"
                className="w-64 max-w-full rounded-[13px]"
              />
            )}

            <Button variant="secondary" onClick={addHighlight}>
              <Plus size={16} />
              Add Highlight
            </Button>
          </Card>

          {/* EXISTING MEDIA */}
          <Card className="p-6 md:p-8">
            <h2 className="mb-5 text-lg font-bold">Existing Media</h2>

            {event.media?.length ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {event.media?.map((item: any) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-[18px] border border-line-soft bg-card-2"
                  >
                    {item.type === "gallery" ? (
                      <img
                        src={mediaUrl(item.url)}
                        alt={item.title || "media"}
                        className="h-32 w-full object-cover"
                      />
                    ) : (
                      <img
                        src={youtubeThumbnail(item.url) || ""}
                        alt={item.title || "media"}
                        className="h-32 w-full object-cover"
                      />
                    )}

                    {editingMediaId === item.id ? (
                      <div className="space-y-2 p-3">
                        <Input
                          value={mediaTitle}
                          onChange={(e) => setMediaTitle(e.target.value)}
                          placeholder="Media title"
                        />

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => saveMediaTitle(item.id)}
                          >
                            <Save size={14} />
                            Save
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingMediaId(null)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2 p-3">
                        <p className="truncate text-sm text-mid">
                          {item.title}
                        </p>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => startEditMedia(item)}
                          aria-label="Edit media title"
                        >
                          <Pencil size={14} />
                        </Button>
                      </div>
                    )}

                    <div className="px-3 pb-3">
                      <Button
                        variant="danger"
                        size="sm"
                        fullWidth
                        onClick={() => deleteMedia(item.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-low">No media uploaded yet.</p>
            )}
          </Card>
        </>
      )}

      {message && <Alert tone="info">{message}</Alert>}
    </div>
  );
}
