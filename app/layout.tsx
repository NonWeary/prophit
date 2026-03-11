import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "PROPHIT — Absurdist Prediction Markets",
  description: "Bet Prophet Tokens on the outcomes that matter. Or don't matter. Results may vary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body className="antialiased min-h-screen bg-[#080810]">
        {children}
      </body>
    </html>
  );
}