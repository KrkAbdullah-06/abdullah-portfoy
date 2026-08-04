import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { LoadingScreen } from "@/components/experience/LoadingScreen";

// Gövde metni için modern, okunaklı yazı tipi
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Başlıklar için karakterli, teknolojik his veren yazı tipi
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdullah Kırkıl — 3D Tasarım, CNC, Video & Web",
  description:
    "Abdullah Kırkıl — Mekanik 3D tasarım, CNC üretim hazırlığı, video prodüksiyon, sosyal medya yönetimi ve modern full-stack web geliştirme.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <LoadingScreen />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
