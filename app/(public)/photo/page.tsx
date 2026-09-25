"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  AlertTriangle,
  Home,
  ImageOff,
  Camera,
  GraduationCap,
  FileText,
  User,
  IdCard,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import BackButton from "@/components/ui/BackButton";
import { mediaUrl } from "@/lib/mediaUrl";

type Photo = { url: string };

type PhotoData = {
  student: {
    id: number;
    name: string;
    graduation_number: string;
    faculty: string;
    study_program: string;
  };
  downloadToken?: string;
  photos: Record<string, Photo[] | undefined>;
};

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Photo() {
  const router = useRouter();

  const [data, setData] = useState<PhotoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const saved = sessionStorage.getItem("photoSearch");

        if (!saved) {
          setError("Search data not found");
          return;
        }

        const response = await fetch(`${API}/api/photos/search`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: saved,
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Photo not found");
          return;
        }

        setData(result);
      } catch (error) {
        console.error(error);
        setError("Cannot connect to server");
      } finally {
        setLoading(false);
      }
    };

    loadPhoto();
  }, []);

  const reportProblem = () => {
    if (!data) return;

    const subject = encodeURIComponent(
      `Report Photo - ${data.student.name}`
    );

    const body = encodeURIComponent(
`Hello Pandawa Creative Team,

Saya ingin melaporkan masalah terkait foto wisuda.

Detail Mahasiswa:

Nama:
${data.student.name}

Nomor Wisuda:
${data.student.graduation_number}

Fakultas:
${data.student.faculty}

Program Studi:
${data.student.study_program}


Detail masalah:

(Tuliskan masalah foto di sini)


Terima kasih.

`
    );

    window.location.href = `mailto:contact@pandawacreative.com?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-mid">
        Loading...
      </main>
    );
  }

  if (error || !data) {
    return (
      <div className="relative min-h-screen">
        <div className="app-hero" aria-hidden="true" />

        <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
          <div className="w-full max-w-sm rounded-[26px] border border-line-soft bg-card p-9 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
              <AlertTriangle size={22} />
            </div>

            <h1 className="text-xl font-bold">{error}</h1>

            <div className="mt-6 flex justify-center">
              <Button variant="secondary" onClick={() => router.push("/")}>
                Return Home
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="app-hero" aria-hidden="true" />

      <div className="relative z-10 px-5 pt-6 md:px-8">
        <BackButton />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl space-y-8 px-5 py-8 md:px-8">
        {/* PHOTO GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PhotoCard
            icon={<Camera size={20} />}
            title="Foto Bebas"
            photo={data.photos.BEBAS?.[0]}
          />

          <PhotoCard
            icon={<GraduationCap size={20} />}
            title="Foto Kuncir"
            photo={data.photos.KUNCIR?.[0]}
          />

          <PhotoCard
            icon={<FileText size={20} />}
            title="Foto Ijazah"
            photo={data.photos.IJAZAH?.[0]}
          />
        </div>

        {/* STUDENT DETAIL */}
        <div className="rounded-[26px] border border-line-soft bg-card p-7 md:p-9">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-bold text-white">
              {data.student.name.charAt(0).toUpperCase()}
            </div>

            <h1 className="text-2xl font-extrabold md:text-3xl">
              {data.student.name}
            </h1>

            <div className="mt-4">
              <Badge tone="brand">
                <IdCard size={13} />
                {data.student.graduation_number}
              </Badge>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoRow
              icon={<IdCard size={16} />}
              label="Graduation Number"
              value={data.student.graduation_number}
            />

            <InfoRow
              icon={<GraduationCap size={16} />}
              label="Faculty"
              value={data.student.faculty}
            />

            <InfoRow
              icon={<User size={16} />}
              label="Study Program"
              value={data.student.study_program}
              className="sm:col-span-2"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap justify-center gap-4 pb-6">
          <Button
            variant="primary"
            onClick={() => {
              const token = data.downloadToken;

              const url = `${API}/api/download/${data.student.id}`;

              window.open(
                token ? `${url}?token=${encodeURIComponent(token)}` : url,
                "_blank"
              );
            }}
          >
            <Download size={16} />
            DOWNLOAD ALL PHOTOS
          </Button>

          <Button variant="danger" onClick={reportProblem}>
            <AlertTriangle size={16} />
            REPORT PROBLEM
          </Button>

          <Button variant="secondary" onClick={() => router.push("/")}>
            <Home size={16} />
            RETURN TO HOME
          </Button>
        </div>
      </main>
    </div>
  );
}

function PhotoCard({
  title,
  icon,
  photo,
}: {
  title: string;
  icon: React.ReactNode;
  photo?: Photo;
}) {
  return (
    <div className="rounded-[26px] border border-line-soft bg-card p-5">
      <div className="mb-4 flex items-center justify-center gap-2 text-mid">
        {icon}
        <h2 className="text-base font-bold text-hi">{title}</h2>
      </div>

      {photo ? (
        <img
          src={mediaUrl(photo.url)}
          alt={title}
          className="aspect-square w-full rounded-[18px] object-cover"
        />
      ) : (
        <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-[18px] bg-card-2 text-low">
          <ImageOff size={28} />
          <span className="text-sm">No Photo</span>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-[18px] border border-line-soft bg-card-2 p-4 ${className}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-low">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[12.5px] font-semibold text-low">{label}</p>
        <p className="truncate text-sm font-semibold text-hi">{value}</p>
      </div>
    </div>
  );
}
