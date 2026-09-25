import { cn } from "@/lib/cn";

export default function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-[13px] bg-field border border-line px-4 py-3.5",
        "text-hi placeholder:text-low outline-none transition resize-y",
        "focus:border-brand/60 focus:ring-2 focus:ring-brand/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    />
  );
}
