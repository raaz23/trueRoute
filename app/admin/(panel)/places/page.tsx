import AdminCrud from "@/components/admin/AdminCrud";
import { placeFields } from "@/lib/admin/fields";

export default function AdminPlacesPage() {
  return <AdminCrud model="places" title="Places" fields={placeFields} />;
}
