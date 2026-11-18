import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "TJ Fraser Portfolio",
  description:
    "Portfolio of TJ Fraser, an aspiring software developer showcasing web applications, projects, and technical skills.",
  openGraph: {
    type: "website",
    title: "TJ Fraser Portfolio",
    description:
      "Portfolio of TJ Fraser, an aspiring software developer showcasing web applications, projects, and technical skills.",
    siteName: "TJ Fraser Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TJ Fraser Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TJ Fraser Portfolio",
    description:
      "Portfolio of TJ Fraser, an aspiring software developer showcasing web applications, projects, and technical skills.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="animated-background min-h-screen flex flex-col bg-gradient-to-r from-blue-600 via-blue-900 to-blue-600">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
