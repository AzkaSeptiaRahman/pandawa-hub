import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Momo_Trust_Display } from "next/font/google";
import "./globals.css";

// Primary / display font (headings, hero, titles)
const momo = Momo_Trust_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-momo",
  display: "swap",
  // No Google capsize metrics for this family, so skip fallback generation.
  adjustFontFallback: false,
});

// Secondary / body font
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pandawa Hub | Pandawa Kreasi Nusantara",

  description:
    "Access your photos, videos, and livestream recordings from Pandawa Kreasi Nusantara",

  icons: {
    icon: "/Pandawa_Logo_Short_W.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${momo.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-app font-sans text-hi antialiased">
        {children}
      </body>
    </html>
  );
}
