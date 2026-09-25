import { cn } from "@/lib/cn";

export default function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[26px] bg-card border border-line-soft p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
