import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
// Supports weights 100-900
import "@fontsource-variable/noto-sans-sc";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Ai Chat",
  description: "Ai Chat",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("h-screen bg-background antialiased", fontSans.variable)}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
