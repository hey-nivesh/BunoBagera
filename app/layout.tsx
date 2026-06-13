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
  title: {
    default: "BunoBagera — Smart AI Code Reviewer",
    template: "%s | BunoBagera",
  },
  description: "Advanced AI-powered code review and automated pull request analysis for real production projects.",
  keywords: [
    "AI code review",
    "automated code reviewer",
    "smart code analyzer",
    "pull request assistant",
    "github bot",
    "code scanner",
    "static code analysis",
    "bug detection AI",
    "claude code review",
    "ai developer tools",
    "software quality assurance",
    "production code audit",
    "code refactoring AI",
    "find code bugs AI",
    "AI pull request review",
    "ChatGPT for code review",
    "code smell detector",
    "security vulnerability scanner"
  ],
  authors: [{ name: "BunoBagera Team" }],
  creator: "BunoBagera",
  publisher: "BunoBagera",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google43a546423ee2cbf5",
  },
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
