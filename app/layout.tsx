import "./globals.css";
import Footer from "@/components/Footer";

export const metadata = {
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
      suppressHydrationWarning
    >

      <body
        className="
          min-h-screen
          flex
          flex-col
        "
      >

        <main
          className="
            flex-1
            pb-32
          "
        >
          {children}
        </main>


        <div
          className="
            h-20
          "
        />


        <Footer />


      </body>

    </html>

  );
}