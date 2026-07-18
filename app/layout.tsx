import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Loaded as a variable font so the optical-size (opsz) and WONK axes can be
// pinned in CSS; the default high-opsz rendering gives Fraunces a swashy,
// distracting lowercase "f"/"g" at display sizes. See globals.css .font-display.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.themishka.me"),
  title: "Michael Korenevsky | Senior Product Manager",
  description:
    "Senior Product Manager who takes enterprise products from customer discovery and roadmap decisions through deployment and results customers can measure.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Michael Korenevsky | Senior Product Manager",
    description:
      "Senior Product Manager who takes enterprise products from customer discovery and roadmap decisions through deployment and results customers can measure.",
    url: "/",
    siteName: "Michael Korenevsky",
    type: "website",
    images: [
      {
        url: "/OfficialProfile.jpg",
        width: 340,
        height: 425,
        alt: "Michael Korenevsky",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Michael Korenevsky | Senior Product Manager",
    description:
      "Senior Product Manager who takes enterprise products from customer discovery and roadmap decisions through deployment and results customers can measure.",
    images: ["/OfficialProfile.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hankenGrotesk.variable} ${jetBrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-canvas text-on-dark antialiased">
        {children}
      </body>
    </html>
  );
}
