import { cn } from "@/lib/cn";

type Tone = "neutral" | "brand" | "accent" | "success" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-white/5 text-mid border-line-soft",
  brand: "bg-brand-soft text-brand border-brand/30",
  accent: "bg-accent/15 text-accent border-accent/30",
  success: "bg-success/15 text-success border-success/30",
  danger: "bg-danger/15 text-danger border-danger/30",
};

export default function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
