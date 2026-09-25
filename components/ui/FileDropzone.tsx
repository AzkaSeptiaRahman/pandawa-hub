"use client";

import { cn } from "@/lib/cn";

export default function FileDropzone({
  id,
  accept,
  multiple,
  disabled,
  fileName,
  fileSize,
  placeholder,
  hint,
  onSelect,
  disabledHint,
  className,
}: {
  id: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  fileName?: string | null;
  fileSize?: string;
  placeholder: string;
  hint?: string;
  onSelect: (files: FileList) => void;
  disabledHint?: string;
  className?: string;
}) {
  const locked = Boolean(disabled);

  const label = fileName
    ? fileName
    : locked && disabledHint
    ? disabledHint
    : placeholder;

  return (
    <>
      <label
        htmlFor={locked ? undefined : id}
        onClick={(e) => {
          if (locked) e.preventDefault();
        }}
        className={cn(
          "flex cursor-pointer flex-col gap-3 rounded-[18px] border border-dashed border-line",
          "bg-card-2 p-6 transition hover:border-brand/50 hover:bg-field",
          "sm:flex-row sm:items-center sm:justify-between",
          locked && "cursor-not-allowed opacity-50 hover:bg-card-2",
          className
        )}
      >
        <div className="min-w-0">
          <p className="truncate font-semibold text-hi">{label}</p>
          <p className="mt-1 text-sm text-low">{hint}</p>
        </div>

        <span className="shrink-0 rounded-[13px] border border-line bg-field px-5 py-2.5 text-[13px] font-semibold text-mid">
          {fileName ? "Change" : "Browse"}
        </span>
      </label>

      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={locked}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onSelect(e.target.files);
          }
        }}
      />

      {fileName && fileSize && (
        <p className="mt-2 text-xs text-low">{fileSize}</p>
      )}
    </>
  );
}
