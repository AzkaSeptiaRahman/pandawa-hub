import { cn } from "@/lib/cn";

export default function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={cn("block mb-2 text-[13px] font-semibold text-low", className)}
    >
      {children}
    </label>
  );
}
