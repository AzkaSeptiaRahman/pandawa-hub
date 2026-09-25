"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton({
  label = "Back",
  fallback,
  className = "",
}: {
  label?: string;
  fallback?: string;
  className?: string;
}) {
  const router = useRouter();

  const goBack = () => {
    if (fallback) {
      router.push(fallback);
      return;
    }
    router.back();
  };

  return (
    <button
      onClick={goBack}
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-card/80 px-5 py-2.5 text-sm font-semibold text-mid backdrop-blur-xl transition hover:bg-card-2 hover:text-hi ${className}`}
    >
      <ChevronLeft size={16} />
      {label}
    </button>
  );
}
