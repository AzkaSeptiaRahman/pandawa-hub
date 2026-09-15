import "./globals.css";

export const metadata = {
  title: "Pandawa Hub | Pandawa Kreasi Nusantara",
  description: "Access your photos, videos, and livestream recordings from Pandawa Kreasi Nusantara",
  icons:{
    icon:"/Pandawa_Logo_Short_W.png"
  }
};

export default function RootLayout({
 children
}:{
 children: React.ReactNode
}) {
 return (
  <html lang="en" suppressHydrationWarning>
    <body>{children}</body>
  </html>
 )
}