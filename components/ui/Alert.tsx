import { cn } from "@/lib/cn";

type Tone = "info" | "success" | "error" | "warning";

const tones: Record<Tone, string> = {
  info: "border-brand/30 bg-brand-soft text-brand",
  success: "border-success/30 bg-success/10 text-success",
  error: "border-danger/30 bg-danger/10 text-danger",
  warning: "border-accent/30 bg-accent/10 text-accent",
};

export default function Alert({
  tone = "info",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[13px] border px-4 py-3.5 text-sm",
        tones[tone],
        className
      )}
    >
      {children}
    </div>
  );
}
