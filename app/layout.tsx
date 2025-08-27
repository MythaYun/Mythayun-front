import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mythayun Live Scores",
  description: "Real-time football scores and match updates",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a', // Updated to slate-900 color for dark theme
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white min-h-screen overflow-x-hidden selection:bg-primary-500/20 selection:text-primary-100 relative`}
        style={{
          background: `
            radial-gradient(ellipse at top left, rgba(59,130,246,0.15), transparent 50%),
            radial-gradient(ellipse at top right, rgba(147,51,234,0.1), transparent 50%),
            radial-gradient(ellipse at bottom, rgba(29,78,216,0.08), transparent 60%),
            conic-gradient(from 180deg at 50% 50%, rgba(59,130,246,0.03) 0deg, transparent 60deg, rgba(147,51,234,0.02) 120deg, transparent 180deg, rgba(29,78,216,0.03) 240deg, transparent 300deg, rgba(59,130,246,0.02) 360deg),
            linear-gradient(135deg, #0c1426 0%, #1e3a8a 25%, #1e40af 50%, #1d4ed8 75%, #0c1426 100%)
          `
        }}
      >
        {/* Global background pattern overlay */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.04),transparent_60%)] opacity-70"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.03),transparent_60%)] opacity-50"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_0%,rgba(29,78,216,0.01)_50%,transparent_100%)] opacity-60"></div>
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_center,rgba(59,130,246,0.01)_0deg,transparent_90deg,rgba(147,51,234,0.01)_180deg,transparent_270deg)] opacity-40"></div>
        </div>
        
        <QueryProvider>
          <AuthProvider>
            {/* Modern container with consistent max-width and centered layout */}
            <div className="flex flex-col min-h-screen w-full relative z-10">
              {/* Main content with proper z-index */}
              <main className="flex-1 w-full relative">
                {children}
              </main>
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
