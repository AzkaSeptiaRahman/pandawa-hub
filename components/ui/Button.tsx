import { cn } from "@/lib/cn";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

type Size = "sm" | "md" | "lg";

type Props = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand/90",
  secondary: "bg-card-2 text-hi border border-line hover:bg-field",
  outline:
    "bg-transparent text-hi border border-line hover:bg-card-2",
  ghost: "bg-transparent text-mid hover:text-hi hover:bg-white/5",
  danger:
    "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
  success:
    "bg-success/15 text-success border border-success/30 hover:bg-success/25",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition",
        "disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
}
