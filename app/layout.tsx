import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XLResume — Be Seen. Be Heard. Be Hired.",
  description: "India's first AI-powered video and PDF resume platform. Build ATS-ready resumes, record 100-second video resumes, and get AI career guidance.",
  keywords: "resume builder India, AI resume, video resume, career platform, job seekers India",
  openGraph: {
    title: "XLResume — Be Seen. Be Heard. Be Hired.",
    description: "India's first AI-powered video and PDF resume platform.",
    url: "https://xlresume.com",
    siteName: "XLResume",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}