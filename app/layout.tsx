import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description = "The portfolio of George Ma, a Singapore-based creative technologist working across visual systems, local AI, and thoughtful automation.";

  return {
    metadataBase: new URL(origin),
    title: "George Ma — Creative Technologist",
    description,
    openGraph: {
      title: "George Ma — Creative Technologist",
      description,
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1736, height: 909, alt: "George Ma — Creative Technologist" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "George Ma — Creative Technologist",
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
