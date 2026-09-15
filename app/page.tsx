"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Glow from "@/components/Glow";
import Button from "@/components/Button";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen">

      {/* HERO */}
      <main className="min-h-screen flex items-center justify-center p-8 relative">
        <Glow />

        <div className="text-center relative z-10 flex flex-col items-center">

          {/* LOGO */}
          <div className="mb-10">
            <Image
              src="/Pandawa_Logo_Short_W.png"
              alt="Pandawa Kreasi Nusantara"
              width={220}
              height={80}
              className="w-auto h-16 md:h-20 object-contain"
              priority
            />
          </div>

          {/* TITLE */}
          <h1 className="text-7xl md:text-8xl font-black leading-[0.9]">
            PANDAWA
            <br />
            <span className="gradient-text">HUB</span>
          </h1>

          {/* SUBTITLE */}
          <p className="mt-10 text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">
            Your Moments, All in One Place.
            <br />
            Access your photos, videos, and livestream recordings.
          </p>

          {/* BUTTON */}
          <div className="mt-12">
            <Button onClick={() => router.push("/events")}>
              EXPLORE YOUR MOMENTS
            </Button>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}