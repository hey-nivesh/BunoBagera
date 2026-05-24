import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans", // Replacing geist-sans for drop-in replacement
});
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuboBagera — Smart AI Code Reviewer",
  description: "AI-powered code review for real production projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        spaceGrotesk.variable,
        geistMono.variable,
        playfairDisplay.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-[#050505] font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
