import AdminCrud from "@/components/admin/AdminCrud";
import { photoFields } from "@/lib/admin/fields";

export default function AdminPhotosPage() {
  return <AdminCrud model="photos" title="Gallery Photos" fields={photoFields} />;
}
