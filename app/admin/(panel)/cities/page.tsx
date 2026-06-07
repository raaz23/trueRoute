import AdminCrud from "@/components/admin/AdminCrud";
import { cityFields } from "@/lib/admin/fields";

export default function AdminCitiesPage() {
  return <AdminCrud model="cities" title="Cities" fields={cityFields} />;
}
