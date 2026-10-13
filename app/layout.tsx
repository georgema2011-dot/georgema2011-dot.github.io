import type { Metadata } from "next";
import "./globals.css";

const origin = "https://georgema2011-dot.github.io";
const description = "Ma Shun Ngai George is a Singapore-based spatial and industrial designer working across interiors, products, services and inclusive experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: "Ma Shun Ngai George - Spatial and Industrial Designer",
  description,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Ma Shun Ngai George - Spatial and Industrial Designer",
    description,
    type: "website",
    url: "/",
    images: [{ url: "/og-portfolio.png", width: 1736, height: 909, alt: "Ma Shun Ngai George, spatial and industrial design portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ma Shun Ngai George - Spatial and Industrial Designer",
    description,
    images: ["/og-portfolio.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ma Shun Ngai George",
    url: origin,
    email: "mailto:georgem2011@gmail.com",
    jobTitle: "Spatial and Industrial Designer",
    homeLocation: { "@type": "Place", name: "Singapore" },
    knowsAbout: ["Spatial design", "Industrial design", "Inclusive design", "Service design"],
    sameAs: ["https://github.com/georgema2011-dot"],
  };
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(person)}}/></body></html>;
}
