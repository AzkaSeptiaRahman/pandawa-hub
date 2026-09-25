"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Calendar, Images, CalendarX, Pencil, Save, X } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Label from "@/components/ui/Label";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import FileDropzone from "@/components/ui/FileDropzone";
import { mediaUrl } from "@/lib/mediaUrl";

type EventData = {
  id: number;
  name: string;
  title: string;
  date: string;
  thumbnail: string | null;
  type: string;
  slug: string;
  description: string | null;
  status: string;
};

const API = process.env.NEXT_PUBLIC_API_URL;

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [thumbKey, setThumbKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    title: "",
    date: "",
    slug: "",
    type: "PERSONAL",
    status: "active",
    description: "",
  });

  const [form, setForm] = useState({
    name: "",
    slug: "",
    date: "",
    type: "PERSONAL",
    description: "",
    status: "active",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetch(`${API}/api/admin/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setEvents(data.events || []);
    } catch (error) {
      console.error(error);
    }
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const changeName = (value: string) => {
    setForm({
      ...form,
      name: value,
      slug: slugify(value),
    });
  };

  const updateField = (field: string, value: string) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleThumbnail = (files: FileList) => {
    const file = files?.[0];

    if (!file) return;

    setThumbnail(file);

    const url = URL.createObjectURL(file);

    setPreview(url);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setPreview("");
    setThumbKey((k) => k + 1);
  };

  const createEvent = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = new FormData();

      data.append("name", form.name);
      data.append("slug", form.slug);
      data.append("date", form.date);
      data.append("type", form.type);
      data.append("description", form.description);
      data.append("status", form.status);

      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      const res = await fetch(`${API}/api/admin/events`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.message || "Create failed");
        return;
      }

      setMessage("Event created");

      setForm({
        name: "",
        slug: "",
        date: "",
        type: "PERSONAL",
        description: "",
        status: "active",
      });

      removeThumbnail();

      loadEvents();
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (event: EventData) => {
    setEditingId(event.id);
    setEditForm({
      name: event.name || "",
      title: event.title || "",
      date: event.date || "",
      slug: event.slug || "",
      type: event.type || "PERSONAL",
      status: event.status || "active",
      description: event.description || "",
    });
  };

  const updateEditField = (field: string, value: string) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const updateEvent = async () => {
    if (editingId === null) return;

    try {
      setLoading(true);

      const form = new FormData();

      form.append("name", editForm.name);
      form.append("title", editForm.title);
      form.append("date", editForm.date);
      form.append("slug", editForm.slug);
      form.append("type", editForm.type);
      form.append("status", editForm.status);
      form.append("description", editForm.description);

      const res = await fetch(`${API}/api/admin/events/${editingId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.message || "Update failed");
        return;
      }

      setMessage("Event updated");
      setEditingId(null);
      loadEvents();
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: number) => {
    if (!confirm("Delete event?")) {
      return;
    }

    try {
      const res = await fetch(`${API}/api/admin/events/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Delete failed");
        return;
      }

      setMessage("Event deleted");

      loadEvents();
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  return (
    <div className="space-y-7">
      <PageHeader
        title="Event Management"
        subtitle="Manage Personal and Gallery Events"
      />

      {/* CREATE PANEL */}
      <Card className="space-y-5 p-6 md:p-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-brand-soft text-brand">
            <Plus size={18} />
          </span>
          <h2 className="text-lg font-bold">Create Event</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Event Name</Label>
            <Input
              placeholder="Event Name"
              value={form.name}
              onChange={(e) => changeName(e.target.value)}
            />
          </div>

          <div>
            <Label>Slug</Label>
            <Input
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
            />
          </div>

          <div>
            <Label>Event Date</Label>
            <Input
              placeholder="Event Date"
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
            />
          </div>

          <div>
            <Label>Type</Label>
            <Select
              value={form.type}
              onChange={(e) => updateField("type", e.target.value)}
            >
              <option value="PERSONAL">PERSONAL</option>
              <option value="GALLERY">GALLERY</option>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="min-h-32"
            />
          </div>

          {/* THUMBNAIL UPLOAD */}
          <div className="md:col-span-2">
            <Label>Thumbnail</Label>

            <FileDropzone
              key={thumbKey}
              id="thumbnail"
              accept="image/*"
              fileName={thumbnail?.name}
              fileSize={
                thumbnail
                  ? `${(thumbnail.size / 1024).toFixed(1)} KB`
                  : undefined
              }
              placeholder="Choose Thumbnail"
              hint="PNG or JPG, recommended 16:9"
              onSelect={handleThumbnail}
            />

            {preview && (
              <div className="relative mt-4 overflow-hidden rounded-[18px] border border-line-soft">
                <img
                  src={preview}
                  alt="preview"
                  className="h-56 w-full object-cover"
                />

                <button
                  onClick={removeThumbnail}
                  className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-danger/90 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-danger"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Button onClick={createEvent} disabled={loading}>
            {loading ? "CREATING..." : "CREATE EVENT"}
          </Button>

          {message && (
            <span className="text-sm text-mid">{message}</span>
          )}
        </div>
      </Card>

      {/* EVENT LIST */}
      <div>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Event List</h2>

          <Badge tone="neutral">{events.length} Events</Badge>
        </div>

        {events.length === 0 ? (
          <EmptyState
            icon={<CalendarX size={22} />}
            title="No events yet"
            description="Create your first event using the form above."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {events.map((event) => (
              <Card key={event.id} className="p-5">
                {editingId === event.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => updateEditField("name", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Slug</Label>
                      <Input
                        value={editForm.slug}
                        onChange={(e) => updateEditField("slug", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Date</Label>
                      <Input
                        value={editForm.date}
                        onChange={(e) => updateEditField("date", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={editForm.type}
                          onChange={(e) => updateEditField("type", e.target.value)}
                        >
                          <option value="PERSONAL">PERSONAL</option>
                          <option value="GALLERY">GALLERY</option>
                        </Select>
                      </div>

                      <div>
                        <Label>Status</Label>
                        <Select
                          value={editForm.status}
                          onChange={(e) => updateEditField("status", e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm" onClick={updateEvent} disabled={loading}>
                        <Save size={14} />
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        <X size={14} />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {event.thumbnail ? (
                      <img
                        src={mediaUrl(event.thumbnail)}
                        alt={event.name}
                        className="mb-5 h-44 w-full rounded-[18px] object-cover"
                      />
                    ) : (
                      <div className="mb-5 flex h-44 w-full items-center justify-center rounded-[18px] bg-card-2 text-low">
                        <Images size={26} />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold">
                          {event.name}
                        </h3>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <Badge tone="brand">{event.type}</Badge>

                          <Badge tone={event.status === "active" ? "success" : "neutral"}>
                            {event.status}
                          </Badge>

                          {event.date && (
                            <Badge tone="neutral">
                              <Calendar size={12} />
                              {event.date}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => startEdit(event)}
                        >
                          <Pencil size={14} />
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
