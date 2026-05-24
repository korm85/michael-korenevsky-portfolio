import type { Metadata } from "next";
import { Poppins, Hepta_Slab, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const heptaSlab = Hepta_Slab({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Michael Korenevsky | Senior Product Manager",
  description:
    "Senior Product Manager building enterprise AI and predictive tools for high-stakes industries.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${heptaSlab.variable} ${jetBrainsMono.variable} h-full`}
    >
      <body className="min-h-full bg-canvas text-text-primary">
        {children}
      </body>
    </html>
  );
}
