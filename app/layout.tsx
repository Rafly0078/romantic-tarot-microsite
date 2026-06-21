import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Nunito_Sans, Patrick_Hand } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const body = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

const accent = Patrick_Hand({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: "400"
});

export const metadata: Metadata = {
  title: "A Little Tarot Gift",
  description: "A dreamy romantic QR microsite for a couple bracelet gift."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fff7ea"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${display.variable} ${body.variable} ${accent.variable}`}>
        {children}
      </body>
    </html>
  );
}
