import { cn } from "@/lib/cn";

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] bg-card-2 border border-line-soft p-10 text-center",
        className
      )}
    >
      {icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-low">
          {icon}
        </div>
      )}

      <h3 className="text-base font-bold text-hi">{title}</h3>

      {description && (
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-low">
          {description}
        </p>
      )}

      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
