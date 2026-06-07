"use client";

import AdminCrud from "@/components/admin/AdminCrud";
import { businessFields } from "@/lib/admin/fields";

export default function AdminBusinessesPage() {
  return (
    <AdminCrud model="businesses" title="Business Marketplace" fields={businessFields} />
  );
}
