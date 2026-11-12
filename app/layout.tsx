import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./portfolio.css";

export const metadata: Metadata = {
  title: "Ufuoma Jude Onohwosafe | Senior Software Engineer",
  description:
    "Senior software engineer in Bucharest with 8 years in Laravel, backend APIs, payments and travel technology. Explore projects, experience and résumé.",
  metadataBase: new URL("https://jude4.github.io/Judeverse/"),
  alternates: { canonical: "https://jude4.github.io/Judeverse/" },
  openGraph: {
    title: "Ufuoma Jude Onohwosafe | Senior Software Engineer",
    description:
      "Thoughtful code. Dependable systems. Eight years of engineering across fintech, payments and travel.",
    url: "https://jude4.github.io/Judeverse/",
    images: [
      {
        url: "https://jude4.github.io/Judeverse/assets/portrait/jude-800.webp",
        width: 800,
        height: 1000,
        alt: "Ufuoma Jude Onohwosafe",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon={JSON.stringify({ token: "a6e99d9e22ab4742b902103b3ccf06b2" })}
        />
      </body>
    </html>
  );
}
