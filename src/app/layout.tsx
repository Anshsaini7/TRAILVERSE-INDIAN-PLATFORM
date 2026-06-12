import type { Metadata } from "next";
import { Inter, Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { WeatherProvider } from "../context/WeatherContext";
import { TrekTrackerProvider } from "../context/TrekTrackerContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrailVerse India | Premium Adventure Travel & Trekking Ecosystem",
  description: "Discover, compare, plan, and book the most epic treks and adventure sports across India. A unified portal for high-altitude explorers, guides, and base camp planning.",
  keywords: ["trekking india", "adventure travel", "himalayan treks", "roopkund skeleton lake", "kedarkantha peak", "rafting rishikesh", "outdoor activities india"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <WeatherProvider>
              <TrekTrackerProvider>
                <Navbar />
                <main className="flex-1 flex flex-col">
                  {children}
                </main>
                <Footer />
              </TrekTrackerProvider>
            </WeatherProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
