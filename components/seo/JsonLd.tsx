const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trueroute.app";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TrueRoute",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web, PWA",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Honest travel companion for Nepal tourists — fair prices, AI guide, maps, translation, emergency tools.",
    url: siteUrl,
    areaServed: { "@type": "Country", name: "Nepal" },
    featureList: [
      "Fair price database",
      "AI travel guide",
      "Offline travel pack",
      "Emergency contacts",
      "Live translation",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
