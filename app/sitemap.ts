import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://trueroute.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/map",
    "/prices",
    "/chat",
    "/translate",
    "/emergency",
    "/places",
    "/submit-price",
    "/login",
    "/signup",
    "/about",
    "/faq",
    "/features",
    "/cities",
    "/how-it-works",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/map") || path === "/prices" ? 0.9 : 0.7,
  }));
}
