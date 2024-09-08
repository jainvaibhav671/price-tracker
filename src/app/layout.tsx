import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"
import { Inter, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";

import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeProvider"
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Price Tracker",
  description:
    "Track product prices effortless and save on your next purchase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(spaceGrotesk.className, "bg-background")}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <main className="max-w-10xl h-screen mx-auto">
              <Navbar />
              {children}
            </main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
