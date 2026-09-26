"use client";

import { AlertTriangle, CheckCircle2, Loader2, X, XCircle } from "lucide-react";

import { useBulkUpload } from "@/components/admin/BulkUploadProvider";

function formatBytes(bytes: number) {
  if (!bytes || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );

  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Sticky progress bar for bulk ZIP upload.
 *
 * Lives in the protected admin layout, so the upload keeps running
 * (and its progress stays visible) while the admin navigates between
 * pages. Pinned to the top of the viewport.
 */
export default function BulkUploadProgress() {
  const { state, isActive, dismiss } = useBulkUpload();

  if (state.status === "idle") {
    return null;
  }

  const isUploading = state.status === "uploading";
  const isProcessing = state.status === "processing";
  const isSuccess = state.status === "success";
  const isError = state.status === "error";

  const percent = isUploading
    ? state.uploadPercent
    : isProcessing
      ? state.processingPercent
      : isSuccess
        ? 100
        : state.uploadPercent;

  const barColor = isError
    ? "bg-danger"
    : isSuccess
      ? "bg-success"
      : "bg-brand";

  const tone = isError
    ? "border-danger/40"
    : isSuccess
      ? "border-success/40"
      : "border-brand/40";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-3">
      <div
        className={`pointer-events-auto w-full max-w-[1180px] overflow-hidden rounded-[18px] border ${tone} bg-card/95 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur`}
        role="status"
        aria-live="polite"
      >
        {/* TOP ROW */}
        <div className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
          <span className="mt-0.5 shrink-0">
            {isError ? (
              <XCircle size={18} className="text-danger" />
            ) : isSuccess ? (
              <CheckCircle2 size={18} className="text-success" />
            ) : (
              <Loader2 size={18} className="animate-spin text-brand" />
            )}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="truncate text-sm font-semibold text-hi">
                {isUploading
                  ? "Uploading ZIP"
                  : isProcessing
                    ? "Processing ZIP"
                    : isSuccess
                      ? "Bulk upload finished"
                      : "Bulk upload failed"}
              </p>

              <span className="truncate text-xs text-low">
                {state.fileName}
                {state.fileSize > 0 ? ` · ${formatBytes(state.fileSize)}` : ""}
              </span>
            </div>

            {isUploading && (
              <p className="mt-1 text-xs text-mid">
                {formatBytes(state.uploadedBytes)} /{" "}
                {formatBytes(state.fileSize)} · {percent}%
              </p>
            )}

            {isProcessing && (
              <p className="mt-1 text-xs text-mid">
                {state.total > 0
                  ? `${state.processed} / ${state.total} photos · ${percent}%`
                  : "Uploading photos to storage..."}
              </p>
            )}

            {isSuccess && state.result && (
              <p className="mt-1 text-xs text-mid">
                {state.result.success_count ?? 0} uploaded ·{" "}
                {state.result.failed_count ?? 0} failed ·{" "}
                {state.result.skipped_count ?? 0} skipped
              </p>
            )}

            {isError && (
              <p className="mt-1 text-xs text-danger">{state.error}</p>
            )}
          </div>

          {!isActive && (
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="shrink-0 rounded-full p-1.5 text-low transition hover:bg-white/5 hover:text-hi"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* PROGRESS BAR */}
        {(isUploading || isProcessing) && (
          <div className="h-1.5 w-full bg-field">
            <div
              className={`h-full ${barColor} transition-[width] duration-300 ease-out`}
              style={{ width: `${Math.max(2, percent)}%` }}
            />
          </div>
        )}

        {/* WARNINGS / NOTES */}
        {(isUploading || isProcessing) && (
          <div className="flex items-start gap-2.5 border-t border-line-soft bg-accent/10 px-4 py-2.5 sm:px-5">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-accent" />
            <p className="text-xs leading-relaxed text-accent">
              Jangan tutup tab, refresh, logout, atau mematikan koneksi selama
              proses berlangsung. Anda boleh berpindah halaman di menu admin —
              progress akan tetap berjalan.
            </p>
          </div>
        )}

        {isError && (
          <div className="border-t border-line-soft bg-danger/10 px-4 py-2.5 sm:px-5">
            <p className="text-xs leading-relaxed text-danger">
              Upload gagal. Tidak ada data yang disimpan dan file sementara di
              server sudah dibersihkan. Silakan periksa koneksi lalu coba lagi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
