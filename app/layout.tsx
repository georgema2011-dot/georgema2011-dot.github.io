import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description = "The interdisciplinary spatial and industrial design portfolio of Ma Shun Ngai George, featuring hospitality, public-space, play and inclusive-design projects.";

  return {
    metadataBase: new URL(origin),
    title: "Ma Shun Ngai George — Spatial & Industrial Designer",
    description,
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: "Ma Shun Ngai George — Spatial & Industrial Designer",
      description,
      type: "website",
      images: [{ url: `${origin}/og-portfolio.png`, width: 1736, height: 909, alt: "Ma Shun Ngai George — Spatial and Industrial Design Portfolio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Ma Shun Ngai George — Spatial & Industrial Designer",
      description,
      images: [`${origin}/og-portfolio.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
