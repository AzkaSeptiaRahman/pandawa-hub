"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export type BulkStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "success"
  | "error";

export type BulkResultItem = {
  file: string;
  reason?: string;
  graduate?: string;
  graduation_number?: string;
  faculty?: string;
  type?: string;
};

export type BulkResult = {
  total?: number;
  success_count?: number;
  failed_count?: number;
  skipped_count?: number;
  success?: BulkResultItem[];
  failed?: BulkResultItem[];
  skipped?: BulkResultItem[];
};

export type BulkUploadState = {
  status: BulkStatus;
  fileName: string;
  fileSize: number;
  uploadedBytes: number;
  uploadPercent: number;
  processed: number;
  total: number;
  processingPercent: number;
  result: BulkResult | null;
  error: string | null;
  startedAt: number | null;
};

type StartArgs = {
  file: File;
  eventId: string;
  faculty: string;
};

type BulkUploadContextValue = {
  state: BulkUploadState;
  isActive: boolean;
  startUpload: (args: StartArgs) => void;
  dismiss: () => void;
};

const INITIAL: BulkUploadState = {
  status: "idle",
  fileName: "",
  fileSize: 0,
  uploadedBytes: 0,
  uploadPercent: 0,
  processed: 0,
  total: 0,
  processingPercent: 0,
  result: null,
  error: null,
  startedAt: null,
};

const BulkUploadContext = createContext<BulkUploadContextValue | null>(null);

export function useBulkUpload() {
  const ctx = useContext(BulkUploadContext);

  if (!ctx) {
    throw new Error("useBulkUpload must be used within BulkUploadProvider");
  }

  return ctx;
}

export default function BulkUploadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<BulkUploadState>(INITIAL);

  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef(false);

  const isActive = state.status === "uploading" || state.status === "processing";

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const finalize = useCallback(
    (patch: Partial<BulkUploadState>) => {
      stopPolling();
      activeRef.current = false;
      xhrRef.current = null;
      setState((s) => ({ ...s, ...patch, startedAt: s.startedAt }));
    },
    [stopPolling]
  );

  // Mulai polling progress pemrosesan di server setelah byte selesai.
  const startPolling = useCallback(() => {
    stopPolling();

    const token = localStorage.getItem("token");

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API}/api/admin/photos/bulk-upload/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();

        setState((s) => {
          if (s.status !== "processing") return s;

          return {
            ...s,
            processed: data.processed ?? s.processed,
            total: data.total ?? s.total,
            processingPercent:
              typeof data.percent === "number"
                ? data.percent
                : s.processingPercent,
          };
        });
      } catch {
        // Abaikan error polling sementara; respons utama tetap sumber kebenaran.
      }
    }, 1500);
  }, [stopPolling]);

  const startUpload = useCallback(
    ({ file, eventId, faculty }: StartArgs) => {
      // Penjagaan: tolak bila masih ada upload berjalan.
      if (activeRef.current) {
        return;
      }

      activeRef.current = true;

      setState({
        ...INITIAL,
        status: "uploading",
        fileName: file.name,
        fileSize: file.size,
        startedAt: Date.now(),
      });

      const token = localStorage.getItem("token");

      const form = new FormData();
      form.append("event_id", eventId);
      form.append("faculty", faculty);
      form.append("file", file);

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      // Progress byte yang benar-benar terkirim ke server.
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;

        const percent = Math.min(
          100,
          Math.round((event.loaded / event.total) * 100)
        );

        setState((s) => ({
          ...s,
          uploadedBytes: event.loaded,
          uploadPercent: percent,
          // Setelah byte terkirim, server masih memproses ZIP.
          status: percent >= 100 ? "processing" : s.status,
        }));

        if (percent >= 100) {
          startPolling();
        }
      };

      xhr.upload.onload = () => {
        setState((s) => ({
          ...s,
          uploadPercent: 100,
          status: "processing",
        }));

        startPolling();
      };

      xhr.onload = () => {
        let data: any = null;

        try {
          data = JSON.parse(xhr.responseText);
        } catch {
          data = null;
        }

        if (xhr.status >= 200 && xhr.status < 300 && data) {
          finalize({
            status: "success",
            uploadPercent: 100,
            processingPercent: 100,
            result: data as BulkResult,
            error: null,
          });
          return;
        }

        finalize({
          status: "error",
          error: data?.message || `Upload failed (${xhr.status})`,
        });
      };

      // Gagal karena sinyal / koneksi terputus / timeout.
      xhr.onerror = () => {
        finalize({
          status: "error",
          error:
            "Connection lost during upload. No data was saved. Please check your connection and try again.",
        });
      };

      xhr.ontimeout = () => {
        finalize({
          status: "error",
          error: "Upload timed out. No data was saved. Please try again.",
        });
      };

      xhr.onabort = () => {
        finalize({
          status: "error",
          error: "Upload was cancelled.",
        });
      };

      xhr.open("POST", `${API}/api/admin/photos/bulk-upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.timeout = 0; // upload besar tidak dibatasi waktu
      xhr.send(form);
    },
    [finalize, startPolling]
  );

  const dismiss = useCallback(() => {
    if (activeRef.current) {
      return;
    }

    stopPolling();
    setState(INITIAL);
  }, [stopPolling]);

  // Peringatkan bila pengguna menutup/refresh tab saat upload berjalan.
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!activeRef.current) return;

      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handler);

    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Bersihkan timer saat provider dilepas.
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return (
    <BulkUploadContext.Provider
      value={{ state, isActive, startUpload, dismiss }}
    >
      {children}
    </BulkUploadContext.Provider>
  );
}
