import { cn } from "@/lib/cn";

export default function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full appearance-none rounded-[13px] bg-field border border-line",
        "px-4 py-3.5 pr-10 text-hi outline-none transition cursor-pointer",
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23727178%22 stroke-width=%222.4%22><polyline points=%226 9 12 15 18 9%22/></svg>')]",
        "bg-[length:14px] bg-[right_16px_center] bg-no-repeat",
        "focus:border-brand/60 focus:ring-2 focus:ring-brand/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </select>
  );
}
