"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PhotoMarquee from "@/components/ui/PhotoMarquee";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PhotoMarquee columns={6} duration={60} repeats={16} />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-16">
        <div className="flex w-full max-w-[80%] flex-col items-center text-center">
          <div className="mb-8">
            <Image
              src="/Pandawa_Logo_Short_W.png"
              alt="Pandawa Kreasi Nusantara"
              width={220}
              height={80}
              className="h-16 w-auto object-contain md:h-20"
              priority
            />
          </div>

          <h1 className="text-6xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
            PANDAWA
            <br />
            <span className="text-brand">HUB</span>
          </h1>

          <p className="mt-7 max-w-full text-base leading-relaxed text-mid md:text-lg">
            Your Moments, All in One Place .<br />
            Access your photos, videos, and livestream recordings from your
            special moments.
          </p>

          <div className="mt-10 w-full sm:w-auto">
            <Button size="lg" fullWidth onClick={() => router.push("/events")}>
              EXPLORE YOUR MOMENTS
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
