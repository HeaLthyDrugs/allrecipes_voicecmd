import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VoiceProvider } from "./context/VoiceContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Allrecipes - Find and Share Everyday Cooking Inspiration",
  description: "Find and share everyday cooking inspiration on Allrecipes. Discover recipes, cooks, videos, and how-tos based on the food you love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <VoiceProvider>
          {children}
        </VoiceProvider>
      </body>
    </html>
  );
}
