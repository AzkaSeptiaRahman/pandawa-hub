"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Camera, CheckCircle2, AlertTriangle, Trash2, ImageOff } from "lucide-react";

import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Label from "@/components/ui/Label";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";
import { mediaUrl } from "@/lib/mediaUrl";

type GraduateOption = {
  id: number;
  graduation_number: string;
  name: string;
};

type PhotoRow = {
  id: number;
  type: string;
  url: string;
  name: string;
  graduation_number: string;
};

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPhotoUpload() {
  const [graduates, setGraduates] = useState<GraduateOption[]>([]);
  const [graduateId, setGraduateId] = useState("");
  const [type, setType] = useState("BEBAS");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadGraduates();
    loadPhotos();
  }, []);

  const loadGraduates = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API}/api/admin/graduates/options`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed load graduates");
        return;
      }

      setGraduates(data);
    } catch (error) {
      console.error(error);
      setMessage("Cannot load graduates");
    }
  };

  const handleFile = (files: FileList) => {
    const selected = files?.[0];

    console.log("FILE SELECTED", selected);

    if (!selected) {
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setMessage("");
    setSuccess(false);
  };

  const resetFile = () => {
    setFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadPhoto = async () => {
    setMessage("");
    setSuccess(false);

    if (!graduateId) {
      setMessage("Select graduate first");
      return;
    }

    if (!file) {
      setMessage("Please select photo");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();

      form.append("graduate_id", graduateId);
      form.append("type", type);
      form.append("file", file);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API}/api/admin/photos/upload`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: form,
      });

      const data = await response.json();

      console.log("UPLOAD RESPONSE", data);

      if (!response.ok) {
        setMessage(data.message || "Upload failed");
        return;
      }

      setMessage("Upload success");
      setSuccess(true);

      resetFile();
      loadPhotos();
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async () => {
    try {
      setLoadingPhotos(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API}/api/admin/photos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setPhotos(Array.isArray(data.photos) ? data.photos : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const deletePhoto = async (id: number) => {
    if (!confirm("Delete this photo?")) return;

    const token = localStorage.getItem("token");

    const response = await fetch(`${API}/api/admin/photos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
      setPhotos((current) => current.filter((photo) => photo.id !== id));
    } else {
      setMessage(data.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-7">
      <PageHeader
        title="Upload Graduate Photo"
        subtitle="Upload a single photo for a specific graduate."
      />

      <Card className="space-y-6 p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label>Graduate</Label>

            <Select
              value={graduateId}
              onChange={(e) => setGraduateId(e.target.value)}
            >
              <option value="">Select Graduate</option>

              {graduates.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.graduation_number} - {item.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Photo Type</Label>

            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="BEBAS">BEBAS</option>
              <option value="KUNCIR">KUNCIR</option>
              <option value="IJAZAH">IJAZAH</option>
            </Select>
          </div>
        </div>

        {/* PHOTO PICKER */}
        <div>
          <Label>Photo</Label>

          <input
            ref={fileInputRef}
            id="photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFile(e.target.files);
            }}
          />

          <label
            htmlFor="photo"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[18px] border border-dashed border-line bg-card-2 p-8 text-center transition hover:border-brand/50 hover:bg-field"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
              <Camera size={22} />
            </span>

            <span className="text-sm font-semibold text-hi">
              {file ? file.name : "Choose Photo"}
            </span>

            <span className="text-xs text-low">
              {file
                ? `${(file.size / 1024).toFixed(1)} KB`
                : "PNG or JPG"}
            </span>
          </label>
        </div>

        {preview && (
          <div className="overflow-hidden rounded-[18px] border border-line-soft">
            <img
              src={preview}
              alt="preview"
              className="aspect-square w-full object-cover"
            />
          </div>
        )}

        <Button onClick={uploadPhoto} disabled={loading} fullWidth size="lg">
          <Upload size={16} />
          {loading ? "UPLOADING..." : "UPLOAD PHOTO"}
        </Button>

        {message && (
          <Alert tone={success ? "success" : "info"}>
            <span className="inline-flex items-center gap-2">
              {success ? (
                <CheckCircle2 size={15} />
              ) : (
                <AlertTriangle size={15} />
              )}
              {message}
            </span>
          </Alert>
        )}
      </Card>

      {/* UPLOADED PHOTOS */}
      <div>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Uploaded Photos</h2>
        </div>

        {loadingPhotos ? (
          <EmptyState title="Loading photos..." />
        ) : photos.length === 0 ? (
          <EmptyState
            icon={<ImageOff size={22} />}
            title="No photos uploaded"
            description="Uploaded photos will appear here."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden p-0">
                <img
                  src={mediaUrl(photo.url)}
                  alt={`${photo.graduation_number} ${photo.type}`}
                  className="h-32 w-full object-cover"
                />

                <div className="space-y-3 p-4">
                  <div className="flex items-center gap-2">
                    <Badge tone="brand">{photo.type}</Badge>
                    <span className="truncate text-sm text-mid">
                      {photo.graduation_number} - {photo.name}
                    </span>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    onClick={() => deletePhoto(photo.id)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
