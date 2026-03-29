import type { Metadata } from 'next';
import { ThemeProvider } from '../lib/theme-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'XLResume — AI Resume Builder for India',
  description: 'Build ATS-ready resumes, video resumes, and career roadmaps powered by AI. Built for India. Be Seen. Be Heard. Be Hired.',
  keywords: 'resume builder india, AI resume, ATS resume, video resume india, fresher resume',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}