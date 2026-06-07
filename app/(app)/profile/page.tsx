import ProfileDashboard from "@/components/app/ProfileDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile — TrueRoute",
  description:
    "Manage your traveler profile, saved places, notes, adventure photos, sharing, and private medical & emergency essentials.",
};

export default function ProfilePage() {
  return <ProfileDashboard />;
}
