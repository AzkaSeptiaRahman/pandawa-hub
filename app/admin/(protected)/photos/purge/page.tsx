"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Download,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Camera,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Label from "@/components/ui/Label";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import Alert from "@/components/ui/Alert";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";

type Event = { id: number; name: string; type: string };

type Preview = {
  scope: string;
  graduates: number;
  photos: number;
  total_bytes: number;
  breakdown: Record<string, { count: number; bytes: number }>;
};

type PurgeResult = {
  scope: string;
  graduates: number;
  photoCount: number;
  failedCount: number;
  deletedObjects: number;
  totalBytes: number;
  backupDeleted: boolean;
};

type PurgeStatus = {
  active: boolean;
  phase: string;
  total?: number;
  processed?: number;
  percent: number;
  message?: string;
  done?: boolean;
  result?: PurgeResult | null;
  error?: string | null;
};

const API = process.env.NEXT_PUBLIC_API_URL;

function formatBytes(bytes: number) {
  if (!bytes || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );

  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function PurgePhotosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [faculties, setFaculties] = useState<string[]>([]);
  const [studyPrograms, setStudyPrograms] = useState<string[]>([]);

  const [eventId, setEventId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [studyProgram, setStudyProgram] = useState("");

  const [preview, setPreview] = useState<Preview | null>(null);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"info" | "error" | "success">("info");

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [working, setWorking] = useState(false);

  const [confirmText, setConfirmText] = useState("");

  const [status, setStatus] = useState<PurgeStatus | null>(null);
  const [finalResult, setFinalResult] = useState<PurgeResult | null>(null);

  const pollRef = useRef<number | null>(null);

  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // =====================================================
  // POLLING
  // =====================================================

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const poll = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/photos/purge/status`, {
        headers: authHeaders(),
      });

      const data: PurgeStatus = await res.json();

      setStatus(data);

      if (data.done) {
        stopPolling();
        setWorking(false);

        if (data.phase === "done" && data.result) {
          setFinalResult(data.result);
          setTone("success");
          setMessage(`Purge completed. ${data.result.photoCount} photo(s) deleted.`);
          setPreview(null);
          setConfirmText("");

          // Refresh dropdown counts by re-loading options.
          if (eventId) loadOptions(eventId);
        } else {
          setTone("error");
          setMessage(data.error || data.message || "Purge failed");
        }
      }
    } catch (error) {
      console.error("PURGE POLL ERROR:", error);
    }
  }, [eventId, stopPolling]);

  const startPolling = useCallback(() => {
    stopPolling();
    poll();
    pollRef.current = window.setInterval(poll, 1000);
  }, [poll, stopPolling]);

  // Re-attach to a purge that is still running (e.g. after a refresh).
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/admin/photos/purge/status`, {
          headers: authHeaders(),
        });

        const data: PurgeStatus = await res.json();

        if (data.active) {
          setWorking(true);
          setStatus(data);
          startPolling();
        }
      } catch (error) {
        console.error("PURGE STATUS ERROR:", error);
      }
    })();

    return () => stopPolling();
  }, [startPolling, stopPolling]);

  // =====================================================
  // LOAD EVENTS
  // =====================================================

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/admin/events/options`, {
          headers: authHeaders(),
        });

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.events || [];
        setEvents(list);
      } catch (error) {
        console.error("LOAD EVENTS ERROR:", error);
        setMessage("Failed to load events");
        setTone("error");
      }
    })();
  }, []);

  // =====================================================
  // LOAD OPTIONS (faculty + study program) FOR AN EVENT
  // =====================================================

  const loadOptions = async (selectedEventId: string) => {
    if (!selectedEventId) {
      setFaculties([]);
      setStudyPrograms([]);
      return;
    }

    try {
      setLoadingOptions(true);

      const res = await fetch(
        `${API}/api/admin/photos/purge/options?eventId=${selectedEventId}`,
        { headers: authHeaders() },
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to load options");
        setTone("error");
        return;
      }

      setFaculties(Array.isArray(data.faculties) ? data.faculties : []);
      setStudyPrograms(
        Array.isArray(data.study_programs) ? data.study_programs : [],
      );
    } catch (error) {
      console.error("LOAD OPTIONS ERROR:", error);
      setMessage("Failed to load faculty / study program");
      setTone("error");
    } finally {
      setLoadingOptions(false);
    }
  };

  // =====================================================
  // HANDLERS
  // =====================================================

  const resetPreview = () => {
    setPreview(null);
    setConfirmText("");
    setFinalResult(null);
  };

  const handleEventChange = (value: string) => {
    if (working) return;

    setEventId(value);
    setFaculty("");
    setStudyProgram("");
    resetPreview();
    setMessage("");
    setFaculties([]);
    setStudyPrograms([]);

    if (value) loadOptions(value);
  };

  const handleFacultyChange = (value: string) => {
    if (working) return;

    setFaculty(value);
    setStudyProgram("");
    resetPreview();
    setMessage("");
  };

  const handleStudyProgramChange = (value: string) => {
    if (working) return;

    setStudyProgram(value);
    resetPreview();
    setMessage("");
  };

  const scopeBody = () => ({
    event_id: eventId,
    faculty: faculty || null,
    study_program: studyProgram || null,
  });

  const runPreview = async () => {
    if (!eventId) {
      setMessage("Select an event first");
      setTone("error");
      return;
    }

    try {
      setLoadingPreview(true);
      setMessage("");
      setFinalResult(null);

      const res = await fetch(`${API}/api/admin/photos/purge/preview`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(scopeBody()),
      });

      const data = await res.json();

      if (!res.ok) {
        setPreview(null);
        setMessage(data.message || "Preview failed");
        setTone("error");
        return;
      }

      setPreview(data);
      setConfirmText("");
    } catch (error) {
      console.error("PREVIEW ERROR:", error);
      setMessage("Failed to load preview");
      setTone("error");
    } finally {
      setLoadingPreview(false);
    }
  };

  const downloadBackup = async () => {
    try {
      const params = new URLSearchParams({ event_id: eventId });
      if (faculty) params.set("faculty", faculty);
      if (studyProgram) params.set("study_program", studyProgram);

      const res = await fetch(
        `${API}/api/admin/photos/purge/backup?${params.toString()}`,
        { headers: authHeaders() },
      );

      if (!res.ok) {
        setMessage("Failed to download backup");
        setTone("error");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `purge-backup-${studyProgram || faculty || `event-${eventId}`}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("BACKUP ERROR:", error);
      setMessage("Failed to download backup");
      setTone("error");
    }
  };

  const expectedConfirm = studyProgram || faculty || "SEMUA";

  const runPurge = async () => {
    if (!preview) return;

    if (confirmText.trim() !== expectedConfirm) {
      setMessage(`Type "${expectedConfirm}" exactly to confirm`);
      setTone("error");
      return;
    }

    try {
      setWorking(true);
      setMessage("");
      setTone("info");
      setFinalResult(null);

      const res = await fetch(`${API}/api/admin/photos/purge`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(scopeBody()),
      });

      const data = await res.json();

      if (!res.ok) {
        setWorking(false);
        setMessage(data.message || "Failed to start purge");
        setTone("error");
        return;
      }

      setMessage("Purge started...");
      startPolling();
    } catch (error) {
      console.error("PURGE ERROR:", error);
      setWorking(false);
      setMessage("Failed to start purge");
      setTone("error");
    }
  };

  const confirmMatches = confirmText.trim() === expectedConfirm;

  return (
    <div className="space-y-7">
      <PageHeader
        title="Delete Photos by Scope"
        subtitle="Delete graduate photos (database + storage) for a specific event, faculty, or study program."
      />

      <Alert tone="warning">
        <span className="inline-flex items-start gap-2">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" />
          <span>
            This permanently deletes <strong>photos only</strong>. Graduate
            records are kept, so photos can be re-uploaded later. There is no
            undo.
          </span>
        </span>
      </Alert>

      {/* ================= SCOPE SELECTOR ================= */}
      <Card className="space-y-6 p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <Label>Event</Label>
            <Select
              value={eventId}
              onChange={(e) => handleEventChange(e.target.value)}
              disabled={working}
            >
              <option value="">Select Event</option>
              {events.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Faculty (optional)</Label>
            <Select
              value={faculty}
              onChange={(e) => handleFacultyChange(e.target.value)}
              disabled={!eventId || loadingOptions || working}
            >
              <option value="">
                {loadingOptions ? "Loading..." : "All faculties in event"}
              </option>
              {faculties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Study Program (optional)</Label>
            <Select
              value={studyProgram}
              onChange={(e) => handleStudyProgramChange(e.target.value)}
              disabled={!eventId || loadingOptions || working}
            >
              <option value="">
                {faculty
                  ? "All study programs in faculty"
                  : "All study programs in event"}
              </option>
              {studyPrograms.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            onClick={runPreview}
            disabled={!eventId || loadingPreview || working}
          >
            {loadingPreview ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {loadingPreview ? "LOADING..." : "PREVIEW"}
          </Button>

          <Button
            variant="outline"
            onClick={downloadBackup}
            disabled={!eventId || working}
          >
            <Download size={16} />
            DOWNLOAD BACKUP
          </Button>
        </div>

        {message && <Alert tone={tone}>{message}</Alert>}
      </Card>

      {/* ================= PREVIEW ================= */}
      {preview && !finalResult && (
        <Card className="space-y-5 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-hi">Preview</h2>
            <Badge tone="brand">{preview.scope}</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[18px] border border-line-soft bg-card-2 p-5">
              <p className="text-xs uppercase tracking-wide text-low">Graduates</p>
              <p className="mt-1 text-2xl font-bold text-hi">
                {preview.graduates}
              </p>
            </div>

            <div className="rounded-[18px] border border-line-soft bg-card-2 p-5">
              <p className="text-xs uppercase tracking-wide text-low">Photos</p>
              <p className="mt-1 text-2xl font-bold text-hi">
                {preview.photos}
              </p>
            </div>

            <div className="rounded-[18px] border border-line-soft bg-card-2 p-5">
              <p className="text-xs uppercase tracking-wide text-low">
                Total Size
              </p>
              <p className="mt-1 text-2xl font-bold text-hi">
                {formatBytes(preview.total_bytes)}
              </p>
            </div>
          </div>

          {Object.keys(preview.breakdown).length > 0 && (
            <div className="flex flex-wrap gap-3">
              {Object.entries(preview.breakdown).map(([type, info]) => (
                <div
                  key={type}
                  className="flex items-center gap-2 rounded-[13px] border border-line-soft bg-field px-4 py-2.5"
                >
                  <Camera size={15} className="text-mid" />
                  <span className="text-sm font-semibold text-hi">{type}</span>
                  <span className="text-xs text-low">
                    {info.count} · {formatBytes(info.bytes)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {preview.photos === 0 ? (
            <Alert tone="info">
              No photos found for this scope. Nothing to delete.
            </Alert>
          ) : (
            <>
              <div className="rounded-[18px] border border-danger/30 bg-danger/5 p-5">
                <p className="text-sm font-semibold text-danger">
                  This will permanently delete {preview.photos} photo(s) (
                  {formatBytes(preview.total_bytes)}) from storage and the
                  database. {preview.graduates} graduate record(s) will be kept.
                </p>

                <p className="mt-3 text-xs text-mid">
                  Type{" "}
                  <span className="font-mono font-bold text-hi">
                    {expectedConfirm}
                  </span>{" "}
                  below to confirm.
                </p>

                <div className="mt-3 max-w-sm">
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={expectedConfirm}
                    disabled={working}
                  />
                </div>
              </div>

              <Button
                variant="danger"
                size="lg"
                onClick={runPurge}
                disabled={!confirmMatches || working}
              >
                <Trash2 size={16} />
                {working ? "DELETING..." : "DELETE PHOTOS PERMANENTLY"}
              </Button>
            </>
          )}
        </Card>
      )}

      {/* ================= PROGRESS ================= */}
      {status && (status.active || (working && status.phase !== "done")) && (
        <Card className="space-y-4 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Loader2 size={18} className="animate-spin text-brand" />
            <p className="text-sm font-semibold text-hi">
              {status.message || "Deleting..."}
            </p>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-field">
            <div
              className="h-full bg-brand transition-[width] duration-300 ease-out"
              style={{ width: `${Math.max(2, status.percent || 0)}%` }}
            />
          </div>

          <p className="text-xs text-mid">
            {status.total
              ? `${status.processed || 0} / ${status.total} photos · ${status.percent || 0}%`
              : `${status.percent || 0}%`}
          </p>

          <Alert tone="warning">
            Do not close this tab or refresh while the purge is running. The
            process continues on the server, but you will lose the live
            progress view.
          </Alert>
        </Card>
      )}

      {/* ================= RESULT ================= */}
      {finalResult && (
        <Card className="space-y-5 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-success" />
            <h2 className="text-lg font-bold text-hi">
              Purge completed
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[18px] border border-line-soft bg-card-2 p-5">
              <p className="text-xs uppercase tracking-wide text-low">
                Photos deleted
              </p>
              <p className="mt-1 text-2xl font-bold text-hi">
                {finalResult.photoCount}
              </p>
            </div>

            <div className="rounded-[18px] border border-line-soft bg-card-2 p-5">
              <p className="text-xs uppercase tracking-wide text-low">
                Storage objects
              </p>
              <p className="mt-1 text-2xl font-bold text-hi">
                {finalResult.deletedObjects}
              </p>
            </div>

            <div className="rounded-[18px] border border-line-soft bg-card-2 p-5">
              <p className="text-xs uppercase tracking-wide text-low">
                Reclaimed
              </p>
              <p className="mt-1 text-2xl font-bold text-hi">
                {formatBytes(finalResult.totalBytes)}
              </p>
            </div>
          </div>

          <p className="text-xs text-low">
            Scope: {finalResult.scope} · {finalResult.graduates} graduate
            record(s) preserved
            {finalResult.backupDeleted
              ? " · temporary backup removed"
              : ""}
          </p>
        </Card>
      )}

      {!preview && !finalResult && !status && (
        <EmptyState
          icon={<AlertTriangle size={22} />}
          title="Select a scope and preview"
          description="Choose an event (and optionally a faculty and study program), then click Preview to see what will be deleted."
        />
      )}
    </div>
  );
}
