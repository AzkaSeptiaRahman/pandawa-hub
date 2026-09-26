"use client";

import { useEffect, useRef, useState } from "react";
import {
  PackagePlus,
  Upload,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Info,
  RotateCcw,
  SkipForward,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Label from "@/components/ui/Label";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Alert from "@/components/ui/Alert";
import { useBulkUpload } from "@/components/admin/BulkUploadProvider";

type Event = {
  id: number;
  name: string;
  type: string;
};

type GraduateOption = {
  id?: number;
  graduation_number?: string;
  name?: string;
  faculty: string;
  study_program?: string;
};

type FailedFile = {
  file: string;
  reason: string;
};

type SuccessFile = {
  file: string;
  graduate_id?: number;
  graduate?: string;
  graduation_number?: string;
  faculty?: string;
  type?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL;

export default function BulkUpload() {
  const [events, setEvents] = useState<Event[]>([]);
  const [graduates, setGraduates] = useState<GraduateOption[]>([]);

  const [eventId, setEventId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [loadingFaculty, setLoadingFaculty] = useState(false);

  const { state: bulk, isActive, startUpload } = useBulkUpload();
  const loading = isActive;

  const [failedFiles, setFailedFiles] = useState<FailedFile[]>([]);
  const [skippedFiles, setSkippedFiles] = useState<FailedFile[]>([]);
  const [successFiles, setSuccessFiles] = useState<SuccessFile[]>([]);
  const [hasResult, setHasResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const zipInputRef = useRef<HTMLInputElement | null>(null);

  // =====================================================
  // LOAD EVENTS
  // =====================================================

  useEffect(() => {
    loadEvents();
  }, []);

  // Sinkronkan hasil dari provider (upload tetap berjalan
  // walau pengguna sempat pindah halaman admin).
  useEffect(() => {
    if (bulk.status === "success") {
      const success = bulk.result?.success || [];
      const failed = (bulk.result?.failed || []).map((item) => ({
        file: item.file,
        reason: item.reason || "Unknown error",
      }));
      const skipped = (bulk.result?.skipped || []).map((item) => ({
        file: item.file,
        reason: item.reason || "Skipped",
      }));

      setSuccessFiles(success);
      setFailedFiles(failed);
      setSkippedFiles(skipped);
      setHasResult(true);
      setCopied(false);

      setMessage(
        failed.length === 0
          ? `Upload completed successfully. ${success.length} file(s) uploaded.`
          : `Upload completed with ${failed.length} failed file(s).`,
      );

      setFile(null);

      if (zipInputRef.current) {
        zipInputRef.current.value = "";
      }
    }

    if (bulk.status === "error") {
      setHasResult(false);
      setMessage(bulk.error || "Upload failed");

      setFile(null);

      if (zipInputRef.current) {
        zipInputRef.current.value = "";
      }
    }
  }, [bulk.status, bulk.result, bulk.error]);

  const loadEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API}/api/admin/events/options`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed load events");
        return;
      }

      const eventData = Array.isArray(data) ? data : data.events || [];

      // BULK hanya PERSONAL
      setEvents(eventData.filter((item: Event) => item.type === "PERSONAL"));
    } catch (error) {
      console.error("LOAD EVENTS ERROR:", error);
      setMessage("Failed load events");
    }
  };

  // =====================================================
  // LOAD GRADUATES BY EVENT
  // =====================================================

  const loadGraduates = async (selectedEventId: string) => {
    if (!selectedEventId) {
      setGraduates([]);
      setFaculty("");
      return;
    }

    try {
      setLoadingFaculty(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API}/api/admin/graduates/options?eventId=${selectedEventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();

        console.error("INVALID GRADUATE RESPONSE:", text);

        setGraduates([]);
        setMessage("Invalid response when loading faculty");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setGraduates([]);
        setMessage(data.message || "Failed load faculty");
        return;
      }

      const graduateData = Array.isArray(data)
        ? data
        : data.graduates || data.options || [];

      setGraduates(graduateData);

      if (graduateData.length === 0) {
        setMessage("No graduate data found for this event");
      }
    } catch (error) {
      console.error("LOAD GRADUATES ERROR:", error);
      setGraduates([]);
      setMessage("Failed load faculty");
    } finally {
      setLoadingFaculty(false);
    }
  };

  // =====================================================
  // UNIQUE FACULTIES
  // =====================================================

  const faculties = Array.from(
    new Set(
      graduates
        .map((item) => item.faculty?.trim())
        .filter((item): item is string => Boolean(item)),
    ),
  ).sort();

  // =====================================================
  // RESET FILE INPUT
  // =====================================================

  const resetFileInput = () => {
    setFile(null);

    if (zipInputRef.current) {
      zipInputRef.current.value = "";
    }
  };

  // =====================================================
  // EVENT CHANGE
  // =====================================================

  const handleEventChange = (selectedId: string) => {
    if (isActive) return;

    setEventId(selectedId);
    setFaculty("");
    setGraduates([]);

    resetFileInput();

    setMessage("");
    setFailedFiles([]);
    setSkippedFiles([]);
    setSuccessFiles([]);
    setHasResult(false);
    setCopied(false);

    if (selectedId) {
      loadGraduates(selectedId);
    }
  };

  // =====================================================
  // FACULTY CHANGE
  // =====================================================

  const handleFacultyChange = (value: string) => {
    if (isActive) return;

    setFaculty(value);

    resetFileInput();

    setMessage("");
    setFailedFiles([]);
    setSkippedFiles([]);
    setSuccessFiles([]);
    setHasResult(false);
    setCopied(false);
  };

  // =====================================================
  // ZIP CHANGE
  // =====================================================

  const handleZipChange = (files: FileList) => {
    // Penjagaan: tidak boleh memilih ZIP lain saat upload berjalan.
    if (isActive) {
      setMessage(
        "An upload is already in progress. Please wait until it finishes.",
      );

      if (zipInputRef.current) {
        zipInputRef.current.value = "";
      }

      return;
    }

    const selected = files?.[0];

    if (!selected) {
      return;
    }

    if (!selected.name.toLowerCase().endsWith(".zip")) {
      setFile(null);
      setMessage("Only ZIP file allowed");

      if (zipInputRef.current) {
        zipInputRef.current.value = "";
      }

      return;
    }

    setFile(selected);
    setMessage(`Selected: ${selected.name}`);
  };

  // =====================================================
  // COPY FAILED FILENAMES
  // =====================================================

  const copyFailedFilenames = async () => {
    if (failedFiles.length === 0) {
      return;
    }

    const filenames = failedFiles.map((item) => item.file).join("\n");

    try {
      await navigator.clipboard.writeText(filenames);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("COPY ERROR:", error);
      setMessage("Failed to copy filenames");
    }
  };

  // =====================================================
  // CLEAR RESULT
  // =====================================================

  const clearResult = () => {
    setFailedFiles([]);
    setSkippedFiles([]);
    setSkippedFiles([]);
    setSuccessFiles([]);
    setHasResult(false);
    setCopied(false);
    setMessage("");
  };

  // =====================================================
  // UPLOAD
  // =====================================================

  const upload = () => {
    setMessage("");
    setCopied(false);

    if (isActive) {
      setMessage(
        "An upload is already in progress. Please wait until it finishes.",
      );
      return;
    }

    if (!eventId) {
      setMessage("Please select event first");
      return;
    }

    if (!faculty) {
      setMessage("Please select faculty first");
      return;
    }

    if (!file) {
      setMessage("Please choose ZIP file");
      return;
    }

    setHasResult(false);
    setFailedFiles([]);
    setSkippedFiles([]);
    setSuccessFiles([]);

    // Upload dijalankan oleh provider di layout admin, sehingga tetap
    // berjalan dan progress-nya tetap terlihat saat pindah halaman.
    startUpload({ file, eventId, faculty });
  };

  const zipEnabled =
    Boolean(eventId && faculty && !loadingFaculty) && !isActive;

  const formLocked = isActive;

  return (
    <div className="space-y-7">
      <PageHeader
        title="Bulk Photo Upload"
        subtitle="Upload personal graduation photos by event and faculty."
      />

      {/* UPLOAD FORM */}
      <Card className="space-y-6 p-6 md:p-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-brand-soft text-brand">
            <PackagePlus size={18} />
          </span>
          <h2 className="text-lg font-bold">Upload ZIP</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* EVENT */}
          <div>
            <Label>Personal Event</Label>

            <Select
              value={eventId}
              disabled={formLocked}
              onChange={(e) => handleEventChange(e.target.value)}
            >
              <option value="">Select Event</option>

              {events.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>

          {/* FACULTY */}
          <div>
            <Label>Faculty</Label>

            <Select
              value={faculty}
              onChange={(e) => handleFacultyChange(e.target.value)}
              disabled={!eventId || loadingFaculty || formLocked}
            >
              <option value="">
                {!eventId
                  ? "Select Event First"
                  : loadingFaculty
                    ? "Loading Faculty..."
                    : faculties.length === 0
                      ? "No Faculty Found"
                      : "Select Faculty"}
              </option>

              {faculties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>

            {eventId && !loadingFaculty && faculties.length > 0 && (
              <p className="mt-2 text-xs text-low">
                Faculty loaded from graduate data.
              </p>
            )}
          </div>
        </div>

        {/* ZIP SELECTOR */}
        <div>
          <Label>ZIP File</Label>

          <input
            ref={zipInputRef}
            id="zip"
            type="file"
            accept=".zip,application/zip"
            disabled={!zipEnabled}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleZipChange(e.target.files);
            }}
          />

          <label
            htmlFor={zipEnabled ? "zip" : undefined}
            onClick={(e) => {
              if (!zipEnabled) {
                e.preventDefault();
                setMessage("Select event and faculty first");
              }
            }}
            className={`
              flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[18px]
              border border-dashed p-8 text-center transition
              ${
                zipEnabled
                  ? "border-line bg-card-2 hover:border-brand/50 hover:bg-field"
                  : "cursor-not-allowed border-line bg-card-2 opacity-50"
              }
            `}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Upload size={22} />
            </span>

            <span className="text-sm font-semibold text-hi">
              {file
                ? file.name
                : zipEnabled
                  ? "Choose ZIP File"
                  : "Select Event & Faculty First"}
            </span>
          </label>
        </div>

        {/* FORMAT INFO */}
        <div className="rounded-[18px] border border-line-soft bg-card-2 p-5">
          <p className="text-sm text-low">ZIP filename format</p>

          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            <div className="rounded-[13px] bg-field p-3 font-mono text-[13px] text-mid">
              BEBAS_0001.jpg
            </div>
            <div className="rounded-[13px] bg-field p-3 font-mono text-[13px] text-mid">
              KUNCIR_0001.jpg
            </div>
            <div className="rounded-[13px] bg-field p-3 font-mono text-[13px] text-mid">
              IJAZAH_0001.jpg
            </div>
          </div>
        </div>

        {formLocked && (
          <Alert tone="warning">
            Upload sedang berjalan. Jangan tutup tab, refresh, logout, atau
            mematikan koneksi. Anda tetap boleh berpindah halaman di menu admin
            — progress akan terus berjalan.
          </Alert>
        )}

        <Button
          onClick={upload}
          disabled={loading || !eventId || !faculty || !file}
          fullWidth
          size="lg"
        >
          <Upload size={16} />
          {loading ? "UPLOADING..." : "UPLOAD ZIP"}
        </Button>

        {message && (
          <Alert
            tone={
              hasResult
                ? failedFiles.length > 0
                  ? "warning"
                  : "success"
                : "info"
            }
          >
            {message}
          </Alert>
        )}
      </Card>

      {/* RESULT */}
      {hasResult && (
        <Card className="space-y-6 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Upload Result</h2>

              <p className="mt-1 text-sm text-low">
                Review the result before preparing the next ZIP.
              </p>
            </div>

            <Button variant="secondary" size="sm" onClick={clearResult}>
              <RotateCcw size={14} />
              Clear Result
            </Button>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <div className="rounded-[18px] border border-success/25 bg-success/10 p-5">
              <p className="flex items-center gap-2 text-sm text-success">
                <CheckCircle2 size={15} />
                SUCCESS
              </p>

              <p className="mt-1 text-3xl font-extrabold text-success">
                {successFiles.length}
              </p>
            </div>

            <div className="rounded-[18px] border border-danger/25 bg-danger/10 p-5">
              <p className="flex items-center gap-2 text-sm text-danger">
                <XCircle size={15} />
                FAILED
              </p>

              <p className="mt-1 text-3xl font-extrabold text-danger">
                {failedFiles.length}
              </p>
            </div>

            <div className="rounded-[18px] border border-line bg-white/5 p-5">
              <p className="flex items-center gap-2 text-sm text-mid">
                <SkipForward size={15} />
                SKIPPED
              </p>

              <p className="mt-1 text-3xl font-extrabold text-mid">
                {skippedFiles.length}
              </p>
            </div>
          </div>

          {/* SKIPPED FILES */}
          {skippedFiles.length > 0 && (
            <div>
              <h3 className="text-base font-bold">Skipped Files</h3>

              <p className="mt-1 text-sm text-low">
                These were not uploaded because the photo already exists or was
                duplicated inside the ZIP.
              </p>

              <div className="mt-4 max-h-[300px] space-y-3 overflow-y-auto pr-1">
                {skippedFiles.map((item, index) => (
                  <div
                    key={`${item.file}-${index}`}
                    className="rounded-[13px] border border-line-soft bg-white/5 p-4"
                  >
                    <p className="truncate text-sm font-semibold text-hi">
                      {item.file}
                    </p>

                    <p className="mt-1 text-sm text-low">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAILED FILES */}
          {failedFiles.length > 0 && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-danger">
                    Failed Files
                  </h3>

                  <p className="mt-1 text-sm text-low">
                    Fix these files and include only them in the next ZIP.
                  </p>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={copyFailedFilenames}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "COPIED" : "COPY FAILED FILENAMES"}
                </Button>
              </div>

              <div className="mt-4 max-h-[500px] space-y-3 overflow-y-auto pr-1">
                {failedFiles.map((item, index) => (
                  <div
                    key={`${item.file}-${index}`}
                    className="rounded-[13px] border border-danger/25 bg-danger/5 p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-danger/20 text-xs text-danger">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="break-all font-medium text-hi">
                          {item.file}
                        </p>

                        <p className="mt-1 text-sm text-danger">
                          {item.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALL SUCCESS */}
          {failedFiles.length === 0 && successFiles.length > 0 && (
            <div className="rounded-[18px] border border-success/25 bg-success/10 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/20 text-success">
                <CheckCircle2 size={24} />
              </div>

              <h3 className="text-base font-bold text-success">
                All Files Uploaded
              </h3>

              <p className="mt-1.5 text-sm text-low">
                No failed files need to be re-uploaded.
              </p>
            </div>
          )}

          {/* SECOND CHANCE INFO */}
          {failedFiles.length > 0 && (
            <div className="rounded-[18px] border border-brand/25 bg-brand-soft p-5">
              <p className="flex items-center gap-2 font-medium text-brand">
                <Info size={16} />
                Second Chance Upload
              </p>

              <p className="mt-2 text-sm leading-relaxed text-mid">
                Perbaiki file yang gagal, buat ZIP baru yang hanya berisi file
                tersebut, lalu upload kembali dengan Event dan Faculty yang
                sama. File yang sudah berhasil tidak perlu dimasukkan lagi.
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
